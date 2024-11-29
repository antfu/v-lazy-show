import { Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, createCommentVNode as _createCommentVNode, createElementVNode as _createElementVNode, vShow as _vShow, withDirectives as _withDirectives } from "vue"

export function render(_ctx, _cache) {
  return (_cache._lazyshow1 || _ctx.foo)
    ? (_cache._lazyshow1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
        _withDirectives(_createElementVNode("span", {
          onClick: _cache[1] || (_cache[1] = $event => (_ctx._ctx.handle && _ctx.handle(...args))),
          id: _ctx.id,
          class: "111"
        }, " Hello ", 8 /* PROPS */, ["id"]), [
          [_vShow, _ctx.foo]
        ])
      ], 64)))
    : _createCommentVNode("v-show-if", true)
}