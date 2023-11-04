<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

function resize() {
  document.body.style.width = `${window.innerWidth}px`
  document.body.style.height = `${window.innerHeight}px`
}

resize()

onMounted(() => {
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <RouterView></RouterView>
</template>
