import { transformLazyShow } from '.'

export default function (_: any, nuxt: any) {
  nuxt.options.vue ||= {}
  nuxt.options.vue.compilerOptions ||= {}
  nuxt.options.vue.compilerOptions.nodeTransforms ||= []
  nuxt.options.vue.compilerOptions.nodeTransforms.unshift(transformLazyShow)
}
