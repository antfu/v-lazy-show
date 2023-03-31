<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './HelloWorld.vue'

const enabled = ref(false)
</script>

<template>
  <button @click="enabled = !enabled">
    Toggle
  </button>
  <div v-lazy-show="enabled">
    v-lazy-show
  </div>
  <div v-show="enabled">
    v-show
  </div>
  <div v-if="enabled">
    v-if
  </div>
  <hr>
  <div v-lazy-show="enabled">
    <HelloWorld msg="v-lazy-show" />
  </div>
  <div v-show="enabled">
    <HelloWorld msg="v-show" />
  </div>
  <div v-if="enabled">
    <HelloWorld msg="v-if" />
  </div>
</template>
