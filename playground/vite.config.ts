import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { transformLazyShow } from '../src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: {
        compilerOptions: {
          nodeTransforms: [
            transformLazyShow,
          ],
        },
      },
    }),
    Inspect(),
  ],
})
