import { describe, expect, it } from 'vitest'
import type { CompilerOptions } from '@vue/compiler-core'
import { compileTemplate } from 'vue/compiler-sfc'
import { getBaseTransformPreset } from '@vue/compiler-core'
import { transformLazyShow } from '../src'

function parseWithForTransform(
  template: string,
  options: CompilerOptions = {},
  ssr = false,
) {
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset()

  const result = compileTemplate({
    id: 'foo.vue',
    filename: 'foo.vue',
    source: template,
    ssr,
    ssrCssVars: [],
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
<span v-lazy-show="foo">
  Hello
</span>
`,
      )

      expect(res.code).toMatchInlineSnapshot(`
        "import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_cache._lazyshow1 || _ctx.foo)
            ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
                _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                  [_vShow, _ctx.foo]
                ])
              ], 64)))
            : _createCommentVNode(\\"v-show-if\\", true)
        }"
      `)
    })

    it('v-show.lazy', () => {
      const res = parseWithForTransform(
        `
<span v-show.lazy="foo">
  Hello
</span>
`,
      )

      expect(res.code).toMatchInlineSnapshot(`
        "import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_cache._lazyshow1 || _ctx.foo)
            ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
                _withDirectives(_createElementVNode(\\"span\\", null, \\" Hello \\", 512 /* NEED_PATCH */), [
                  [_vShow, _ctx.foo]
                ])
              ], 64)))
            : _createCommentVNode(\\"v-show-if\\", true)
        }"
      `)
    })

    it('error on template', () => {
      expect(() => {
        parseWithForTransform(
        `
<template v-lazy-show="foo">
  Hello
</template>
`,
        )
      }).toThrowErrorMatchingInlineSnapshot('"v-lazy-show can not be used on <template>"')
    })
  })

  it('basic ssr', () => {
    const res = parseWithForTransform(
      `
<span v-lazy-show="foo">
  Hello
</span>
`, {}, true)

    expect(res.code).toMatchInlineSnapshot(`
      "import { mergeProps as _mergeProps, createVNode as _createVNode } from \\"vue\\"
      import { ssrRenderAttrs as _ssrRenderAttrs } from \\"vue/server-renderer\\"

      export function ssrRender(_ctx, _push, _parent, _attrs) {
        if (_ctx.foo) {
          _push(\`<span\${_ssrRenderAttrs(_mergeProps(_attrs, _attrs))}> Hello </span>\`)
        } else {
          _push(\`<!---->\`)
        }
      }"
    `)
  })

  // https://github.com/antfu/v-lazy-show/issues/3
  it('with dynamic attrs', () => {
    const res = parseWithForTransform(
      '<div :role="role" v-lazy-show="isOpen">hello world</div>',
    )

    expect(res.code).toMatchInlineSnapshot(`
        "import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from \\"vue\\"

        export function render(_ctx, _cache) {
          return (_cache._lazyshow1 || _ctx.isOpen)
            ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
                _withDirectives(_createElementVNode(\\"div\\", { role: _ctx.role }, \\"hello world\\", 8 /* PROPS */, [\\"role\\"]), [
                  [_vShow, _ctx.isOpen]
                ])
              ], 64)))
            : _createCommentVNode(\\"v-show-if\\", true)
        }"
      `)
  })

  // https://github.com/antfu/v-lazy-show/issues/3
  it('with dynamic attrs ssr', () => {
    const res = parseWithForTransform(
      '<div :role="role" v-lazy-show="isOpen">hello world</div>',
      {}, true)

    expect(res.code).toMatchInlineSnapshot(`
      "import { mergeProps as _mergeProps, createVNode as _createVNode } from \\"vue\\"
      import { ssrRenderAttrs as _ssrRenderAttrs } from \\"vue/server-renderer\\"

      export function ssrRender(_ctx, _push, _parent, _attrs) {
        if (_ctx.isOpen) {
          _push(\`<div\${_ssrRenderAttrs(_mergeProps({ role: _ctx.role }, _attrs, _attrs))}>hello world</div>\`)
        } else {
          _push(\`<!---->\`)
        }
      }"
    `)
  })
})
