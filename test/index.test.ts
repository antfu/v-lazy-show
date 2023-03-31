import { describe, expect, it } from 'vitest'
import type { CompilerOptions } from '@vue/compiler-core'
import { compileTemplate } from 'vue/compiler-sfc'
import { getBaseTransformPreset } from '@vue/compiler-core'
import { transformLazyShow } from '../src'

function parseWithForTransform(
  template: string,
  options: CompilerOptions = {},
) {
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset()

  const result = compileTemplate({
    id: 'foo.vue',
    filename: 'foo.vue',
    source: template,
    compilerOptions: {
      nodeTransforms: [
        // (node) => {
        //   if ('props' in node && node.props) {
        //     node.props.forEach((i) => {
        //       if (i.type === 7)
        //         console.dir(i, { depth: 5 })
        //     })
        //   }
        // },
        transformLazyShow,
        ...nodeTransforms,
      ],
      directiveTransforms,
      ...options,
    },
  })

  return result
}

describe('compiler: v-lazy-show', () => {
  describe('transform', () => {
    it('number expression', () => {
      const res = parseWithForTransform(
        `
<script setup>
import { ref } from 'vue'
const foo = ref(false)
</script>

<template>
  <div>
    <span v-lazy-show="foo">
      Hello
    </span>
    <span v-show="foo">
      Hello
    </span>
  </div>
</template>
`,
      )

      expect(res.code).toMatchInlineSnapshot(`
        "import { createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives, openBlock as _openBlock, createElementBlock as _createElementBlock } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_openBlock(), _createElementBlock(\\"template\\", null, [
            _createElementVNode(\\"div\\", null, [
              (_cache._v_lazy_show_init || _ctx.foo)
                ? (_cache._v_lazy_show_init = true, _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                    [_vShow, _ctx.foo]
                  ]))
                : _createCommentVNode(\\"v-show-if\\", true),
              _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                [_vShow, _ctx.foo]
              ])
            ])
          ]))
        }"
      `)
    })
  })
})
