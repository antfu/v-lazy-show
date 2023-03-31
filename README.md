# v-lazy-show

[![NPM version](https://img.shields.io/npm/v/v-lazy-show?color=a1b858&label=)](https://www.npmjs.com/package/v-lazy-show)

A compile-time directive to lazy initialize v-show for Vue. It makes components mount after first truthy value (`v-if`), and the DOM keep alive when toggling (`v-show`).

## Install

```bash
npm i -D v-lazy-show
```

This package is complete compile-time, installed it as a `nodeTransformer` in Vue's compiler options. For example in Vue:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { transformLazyShow } from 'v-lazy-show'

export default defineConfig({
  plugins: [
    Vue({
      template: {
        compilerOptions: {
          nodeTransforms: [
            transformLazyShow, // <--- add this
          ],
        },
      },
    }),
  ]
})
```

## Usage

You can use it as a directive. Both `v-lazy-show` and `v-show.lazy` are supported and equivalent.

```vue
<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <div v-lazy-show="show">
    <MyComponent />
  </div>
</template>
```

With it, `<MyComponent />` will not be mounted for the first render. Until the first time `show.value = true`, it will be mounted and the DOM will be kept alive. Later if you switch `show.value` back to `false`, `<MyComponent />` will not be unmounted, instead, `display: none` will be applied to the DOM just like `v-show`.

## How does it work?

Just like how `v-if` works, when you use this directive, it tell the compiler to do some transformation to the generated vnodes.

```vue
<template>
  <div v-lazy-show="foo">
    Hello
  </div>
</template>
```

will be compiled to

```ts
import { Fragment as _Fragment, createCommentVNode as _createCommentVNode, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, openBlock as _openBlock, vShow as _vShow, withDirectives as _withDirectives } from 'vue'

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock('template', null, [
    (_cache._v_lazy_show_init_1 || _ctx.foo)
      ? (_cache._v_lazy_show_init_1 = true, (_openBlock(), _createElementBlock(_Fragment, null, [
          _withDirectives(_createElementVNode('span', null, ' Hello ', 512 /* NEED_PATCH */), [
            [_vShow, _ctx.foo]
          ])
        ], 64)))
      : _createCommentVNode('v-show-if', true)
  ]))
}
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
