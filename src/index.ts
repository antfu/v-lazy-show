import {
  CREATE_COMMENT,
  createCallExpression,
  createCompoundExpression,
  createConditionalExpression,
  createSequenceExpression,
  createStructuralDirectiveTransform,
  traverseNode,
} from '@vue/compiler-core'

const indexMap = new WeakMap()

export const transformLazyShow = createStructuralDirectiveTransform(
  'lazy-show',
  (node, dir, context) => {
    const keyIndex = (indexMap.get(context.root) || 0) + 1
    indexMap.set(context.root, keyIndex)

    const key = `_v_lazy_show_init_${keyIndex}`
    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', dir.exp!]),
      createSequenceExpression([
        // TODO: fix block capture
        // createCallExpression(
        //   context.helper(OPEN_BLOCK),
        // ),
        createCompoundExpression([`_cache.${key} = true`]),
        // TODO: fix hoist check
        node as any,
      ]),
      createCallExpression(context.helper(CREATE_COMMENT), [
        '"v-show-if"',
        'true',
      ]),
    ) as any

    context.replaceNode(wrapNode)

    if (!node.codegenNode)
      traverseNode(node, context)

    // rename `v-lazy-show` to `v-show` and let Vue handles it
    node.props.push({
      ...dir,
      name: 'show',
    })
  },
)
