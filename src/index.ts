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

export const transformLazyShow = createStructuralDirectiveTransform(
  /^(lazy-show|show)$/,
  (node, dir, context) => {
    if (dir.name === 'show' && !dir.modifiers.includes('lazy')) {
      return () => {
        node.props.push(dir)
      }
    }

    const { helper } = context

    const keyIndex = (indexMap.get(context.root) || 0) + 1
    indexMap.set(context.root, keyIndex)

    const patchFlag = 64 /* STABLE_FRAGMENT */

    const key = `_v_lazy_show_init_${keyIndex}`
    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', dir.exp!]),
      createSequenceExpression([
        createCompoundExpression([`_cache.${key} = true`]),
        createVNodeCall(
          context,
          helper(FRAGMENT),
          undefined,
          [node],
          patchFlag.toString(),
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
