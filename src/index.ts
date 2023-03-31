import {
  CREATE_COMMENT,
  createCallExpression,
  createCompoundExpression,
  createConditionalExpression,
  createSequenceExpression,
  createStructuralDirectiveTransform,
  traverseNode,
} from '@vue/compiler-core'

export const transformLazyShow = createStructuralDirectiveTransform(
  'lazy-show',
  (node, dir, context) => {
    const key = '_v_lazy_show_init' // TODO: auto increase
    const wrapNode = createConditionalExpression(
      createCompoundExpression([`_cache.${key}`, ' || ', dir.exp!]),
      createSequenceExpression([
        createCompoundExpression([`_cache.${key} = true`]),
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

    node.props.push({
      ...dir,
      name: 'show',
    })
  },
)
