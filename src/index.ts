import type { TemplateChildNode } from '@vue/compiler-core'
import {
  CREATE_COMMENT,
  FRAGMENT,
  createCallExpression,
  createCompoundExpression,
  createConditionalExpression,
  createSequenceExpression,
  createSimpleExpression,
  createStructuralDirectiveTransform,
  createVNodeCall,
  traverseNode,
} from '@vue/compiler-core'

const indexMap = new WeakMap()

/**
 * @see {@link https://github.com/vuejs/core/blob/f5971468e53683d8a54d9cd11f73d0b95c0e0fb7/packages/shared/src/patchFlags.ts#L19 |@vue/compiler-core}
 * @description STABLE_FRAGMENT is number, for the purpose of this module is made string so it will not be called toString on it
 */
const PATCH_FLAGS = {
  STABLE_FRAGMENT: '64',
} as const

const DIRECTIVE_NODES = {
  SHOW: 'show',
} as const

export const transformLazyShow = createStructuralDirectiveTransform(
  /^(lazy-show|show)$/,
  (node, dir, context) => {
    // forward normal `v-show` as-is
    if (dir.name === DIRECTIVE_NODES.SHOW && !dir.modifiers.includes('lazy')) {
      return () => {
        node.props.push(dir)
      }
    }

    const directiveName = dir.name === DIRECTIVE_NODES.SHOW
      ? 'v-show.lazy'
      : 'v-lazy-show'

    if (node.tag === 'template')
      throw new Error(`${directiveName} can not be used on <template>`)

    // FIXME: Not sure why Vue prefixes `_ctx.` twice in the generated code, workaround it here
    const conditionExp = dir.exp!

    node.props
      .forEach((prop) => {
        if ('exp' in prop && prop.exp && 'content' in prop.exp && prop.exp.loc.source)
          prop.exp = createSimpleExpression(prop.exp.loc.source)
      })

    if (conditionExp.loc.source)
      dir.exp = createSimpleExpression(conditionExp.loc.source)

    if (context.ssr || context.inSSR) {
      /**
       * rename `v-lazy-show` to `v-if` in SSR, and let Vue handles it
       *
       * since user nodeTransforms always runs after built-in,
       * we need to grab the built-in transform to let it process again.
       *
       * we are relying on the order of them, which is an implementation detail.
       * https://github.com/vuejs/core/blob/f811dc2b60ba7efdbb9b1ab330dcbc18c1cc9a75/packages/compiler-ssr/src/index.ts#L58
       */
      const ssrTransformIf = context.nodeTransforms[0]

      node.props
        .push({
          ...dir,
          modifiers: dir.modifiers.filter(modifier => modifier !== 'lazy'),
          name: 'if',
        })

      ssrTransformIf(node, context)
      return
    }

    const { helper } = context
    const keyIndex = (indexMap.get(context.root) ?? 0) + 1
    indexMap.set(context.root, keyIndex)

    const key = `_lazyshow${keyIndex}`

    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', conditionExp]),
      createSequenceExpression([
        createCompoundExpression([`_cache.${key} = true`]),
        createVNodeCall(
          context,
          helper(FRAGMENT),
          undefined,
          [node],
          PATCH_FLAGS.STABLE_FRAGMENT,
          undefined,
          undefined,
          true,
          false,
          false /* isComponent */,
          node.loc,
        ),
      ]),
      createCallExpression(helper(CREATE_COMMENT), [
        '"v-show-if"',
        'true',
      ]),
    )

    // rename `v-lazy-show` to `v-show` and let Vue handles it
    node.props.push({
      ...dir,
      modifiers: dir.modifiers.filter(modifier => modifier !== 'lazy'),
      name: DIRECTIVE_NODES.SHOW,
    })

    context.replaceNode(<TemplateChildNode><unknown>wrapNode)

    return () => {
      if (!node.codegenNode)
        traverseNode(node, context)
    }
  },
)
