import { createVNode as _createVNode } from "vue"

export function ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<!--[-->`)
  if (_ctx.foo === 1 || _ctx.bar === 2) {
    _push(`<div>hello</div>`)
  } else {
    _push(`<!---->`)
  }
  if (!_ctx.a) {
    _push(`<div>world</div>`)
  } else {
    _push(`<!---->`)
  }
  _push(`<!--]-->`)
}