import {
  CREATE_COMMENT,
  FRAGMENT,
  createCallExpression,
  createCompoundExpression,
  createConditionalExpression,
  createSequenceExpression,
  createStructuralDirectiveTransform,
  createVNodeCall,
  traverseNode,
} from '@vue/compiler-core'

const indexMap = new WeakMap()

// https://github.com/vuejs/core/blob/f5971468e53683d8a54d9cd11f73d0b95c0e0fb7/packages/compiler-core/src/ast.ts#L62
const ElementTypes = {
  TEMPLATE: 3,
}

// https://github.com/vuejs/core/blob/f5971468e53683d8a54d9cd11f73d0b95c0e0fb7/packages/shared/src/patchFlags.ts#L19
const PatchFlags = {
  STABLE_FRAGMENT: 64,
}

export const transformLazyShow = createStructuralDirectiveTransform(
  /^(lazy-show|show)$/,
  (node, dir, context) => {
    if (dir.name === 'show' && !dir.modifiers.includes('lazy')) {
      return () => {
        node.props.push(dir)
      }
    }

    const directiveName = dir.name === 'show' ? 'v-show.lazy' : 'v-lazy-show'
    if (node.tagType === ElementTypes.TEMPLATE || node.tag === 'template')
      throw new Error(`${directiveName} can not be used on <template>`)

    const { helper } = context
    const keyIndex = (indexMap.get(context.root) || 0) + 1
    indexMap.set(context.root, keyIndex)

    const key = `_lazyshow${keyIndex}`

    const body = createVNodeCall(
      context,
      helper(FRAGMENT),
      undefined,
      [node],
      PatchFlags.STABLE_FRAGMENT.toString(),
      undefined,
      undefined,
      true,
      false,
      false /* isComponent */,
      node.loc,
    )

    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', dir.exp!]),
      createSequenceExpression([
        createCompoundExpression([`_cache.${key} = true`]),
        body,
      ]),
      createCallExpression(helper(CREATE_COMMENT), [
        '"v-show-if"',
        'true',
      ]),
    ) as any

    context.replaceNode(wrapNode)

    return () => {
      if (!node.codegenNode)
        traverseNode(node, context)

      // rename `v-lazy-show` to `v-show` and let Vue handles it
      node.props.push({
        ...dir,
        modifiers: dir.modifiers.filter(i => i !== 'lazy'),
        name: 'show',
      })
    }
  },
)
