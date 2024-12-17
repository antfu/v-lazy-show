import { mergeProps as _mergeProps, createVNode as _createVNode } from "vue"
import { ssrRenderAttrs as _ssrRenderAttrs } from "vue/server-renderer"

export function ssrRender(_ctx, _push, _parent, _attrs) {
  if (_ctx.foo) {
    _push(`<span${_ssrRenderAttrs(_mergeProps({
      id: _ctx.id,
      class: "111"
    }, _attrs, _attrs))}> Hello </span>`)
  } else {
    _push(`<!---->`)
  }
}