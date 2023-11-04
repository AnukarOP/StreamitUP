<script setup lang="ts">
defineProps<{
  modelValue: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <input
    v-bind="$attrs"
    type="text"
    :value="modelValue"
    @input="e => $emit('update:modelValue', (e.target as HTMLInputElement).value)"
    class="w-full py-2 px-3 rounded bg-slate-900 outline-none ring-2 ring-transparent transition-all"
    :class="{
      'focus:ring-red-400': error?.length,
      'focus:ring-blue-400': !error?.length
    }" />
  <p className="text-red-400">{{ error }}</p>
</template>
