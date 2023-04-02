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
    it('basic', () => {
      const res = parseWithForTransform(
        `
<script setup>
import { ref } from 'vue'
const foo = ref(false)
</script>

<template>
  <span v-lazy-show="foo">
    Hello
  </span>
</template>
`,
      )

      expect(res.code).toMatchInlineSnapshot(`
        "import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_openBlock(), _createElementBlock(\\"template\\", null, [
            (_cache._lazyshow1 || _ctx.foo)
              ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
                  _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                    [_vShow, _ctx.foo]
                  ])
                ], 64)))
              : _createCommentVNode(\\"v-show-if\\", true)
          ]))
        }"
      `)
    })

    it('v-show.lazy', () => {
      const res = parseWithForTransform(
        `
<script setup>
import { ref } from 'vue'
const foo = ref(false)
</script>

<template>
  <span v-show.lazy="foo">
    Hello
  </span>
</template>
`,
      )

      expect(res.code).toMatchInlineSnapshot(`
        "import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_openBlock(), _createElementBlock(\\"template\\", null, [
            (_cache._lazyshow1 || _ctx.foo)
              ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
                  _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                    [_vShow, _ctx.foo]
                  ])
                ], 64)))
              : _createCommentVNode(\\"v-show-if\\", true)
          ]))
        }"
      `)
    })

    it('error on template', () => {
      expect(() => {
        const res = parseWithForTransform(
        `
<script setup>
import { ref } from 'vue'
const foo = ref(false)
</script>

<template>
  <template v-lazy-show="foo">
    Hello
  </template>
</template>
`,
        )
      }).toThrowErrorMatchingInlineSnapshot('"v-lazy-show can not be used on <template>"')
    })
  })
})
