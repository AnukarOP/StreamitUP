<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="text-center">
    <h2 class="motion-safe:animate-bounce text-xl mt-6 mb-8">
      {{ title }}
    </h2>

    <button
      class="text-red-400 hover:text-red-500 transition-colors"
      @click="$emit('cancel')">
      Cancel 😲
    </button>
  </div>
</template>
