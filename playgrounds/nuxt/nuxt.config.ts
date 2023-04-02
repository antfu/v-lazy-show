import { transformLazyShow } from '../../src'

// https://nuxt.com/docs/api/configuration/nuxt-config
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
