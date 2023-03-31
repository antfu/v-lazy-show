<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    required: true,
  },
})

console.log('HI')
</script>

<template>
  <div>
    {{ msg }}
  </div>
</template>
