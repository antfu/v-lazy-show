import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { transformLazyShow } from '../../src'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: {
        compilerOptions: {
          hoistStatic: false,
          nodeTransforms: [
            transformLazyShow,
          ],
        },
      },
    }),
    Inspect(),
  ],
})
