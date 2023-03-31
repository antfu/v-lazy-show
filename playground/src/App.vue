<script setup lang="ts">
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <button @click="enabled = !enabled">
    Toggle
  </button>
  <div v-lazy-show="enabled">
    <div>v-lazy-show</div>
  </div>
  <div v-show="enabled">
    <div>v-show</div>
  </div>
  <div v-if="enabled">
    <div>v-if</div>
  </div>
</template>
