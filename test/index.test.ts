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
        transformLazyShow,
        ...nodeTransforms,
      ],
      directiveTransforms,
      ...options,
    },
  })

  return result
}

describe('cases', () => {
  const cases = import.meta.glob('./cases/**/input.html', { as: 'raw' })
  for (const [path, fn] of Object.entries(cases)) {
    it(path, async () => {
      const csr = parseWithForTransform(await fn()).code
      expect(csr).toMatchFileSnapshot(path.replace('input.html', 'output.csr.js'))
      const ssr = parseWithForTransform(await fn(), {}, true).code
      expect(ssr).toMatchFileSnapshot(path.replace('input.html', 'output.ssr.js'))
    })
  }
})

describe('errors', () => {
  it('error on template', () => {
    expect(() => {
      parseWithForTransform(
      `
<template v-lazy-show="foo">
Hello
</template>
`,
      )
    }).toThrowErrorMatchingInlineSnapshot(`[Error: v-lazy-show can not be used on <template>]`)
  })
})
