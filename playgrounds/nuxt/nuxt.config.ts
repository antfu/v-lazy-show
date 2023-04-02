import { transformLazyShow } from '../../src'

// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore ignore
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      nodeTransforms: [
        transformLazyShow,
      ],
    },
  },
  modules: [
    '@nuxt/devtools',
  ],
})
