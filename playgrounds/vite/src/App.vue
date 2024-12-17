<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './HelloWorld.vue'

const enabled = ref(false)

function handler(msg?: string) {
  // eslint-disable-next-line no-console
  console.log(msg || '111')
}
</script>

<template>
  <button @click="enabled = !enabled">
    Toggle
  </button>
  <div v-lazy-show="enabled" @click="handler('v-lazy-show')">
    v-lazy-show
  </div>
  <div v-show="enabled" @click="handler('v-show')">
    v-show
  </div>
  <div v-if="enabled">
    v-if
  </div>
  <hr>
  <div v-lazy-show="enabled">
    <HelloWorld msg="v-lazy-show" :handler="handler" />
  </div>
  <div v-show="enabled">
    <HelloWorld msg="v-show" />
  </div>
  <div v-if="enabled">
    <HelloWorld msg="v-if" />
  </div>
</template>
