<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
})

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log(`${props.msg} mounted`)
})
</script>

<template>
  <div>
    Hello {{ msg }}
  </div>
</template>
