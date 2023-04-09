import { createCommentVNode as _createCommentVNode, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createCommentVNode(" https://github.com/antfu/v-lazy-show/issues/3 "),
    (_cache._lazyshow1 || _ctx.isOpen)
      ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
          _withDirectives(_createElementVNode("div", { role: _ctx.role }, "hello world", 8 /* PROPS */, ["role"]), [
            [_vShow, _ctx.isOpen]
          ])
        ], 64)))
      : _createCommentVNode("v-show-if", true)
  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
}