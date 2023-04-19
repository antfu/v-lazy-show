import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    (_cache._lazyshow1 || _ctx.foo === 1 || _ctx.bar === 2)
      ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
          _withDirectives(_createElementVNode("div", null, "hello", 512 /* NEED_PATCH */), [
            [_vShow, _ctx.foo === 1 || _ctx.bar === 2]
          ])
        ], 64)))
      : _createCommentVNode("v-show-if", true),
    (_cache._lazyshow2 || !_ctx.a)
      ? (_cache._lazyshow2 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
          _withDirectives(_createElementVNode("div", null, "world", 512 /* NEED_PATCH */), [
            [_vShow, !_ctx.a]
          ])
        ], 64)))
      : _createCommentVNode("v-show-if", true)
  ], 64 /* STABLE_FRAGMENT */))
}