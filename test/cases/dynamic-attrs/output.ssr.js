import { mergeProps as _mergeProps, createVNode as _createVNode } from "vue"
import { ssrRenderAttrs as _ssrRenderAttrs } from "vue/server-renderer"

export function ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><!-- https://github.com/antfu/v-lazy-show/issues/3 -->`)
  if (_ctx.isOpen) {
    _push(`<div${_ssrRenderAttrs(_mergeProps({ role: _ctx.role }, _attrs, _attrs))}>hello world</div>`)
  } else {
    _push(`<!---->`)
  }
  _push(`<!--]-->`)
}