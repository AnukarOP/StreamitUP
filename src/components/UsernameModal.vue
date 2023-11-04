<script setup lang="ts">
import { ref, watch } from 'vue'
import { username } from '../lib/user'
import Button from './Button.vue'
import TextInput from './TextInput.vue'

const text = ref('')
const error = ref('')

watch(text, (value) => {
  if (value.length > 12) {
    error.value = 'Username cannot exceed 12 characters.'
    return
  }

  error.value = ''
})

function submit() {
  const trimmed = text.value.trim()

  if (!trimmed.length) {
    error.value = 'Username cannot be empty.😕'
    return
  }

  if (trimmed.length > 12) {
    error.value = 'Username cannot exceed 12 characters.🙄'
    return
  }

  error.value = ''
  username.value = trimmed
}
</script>

<template>
  <h2 className="text-center text-lg font-medium mb-6">Choose a username 👇🏻</h2>

  <form @submit.prevent="submit">
    <div className="flex flex-col space-y-1 mb-3">
      <label for="username">Username</label>
      <TextInput id="username" v-model="text" :error="error" />
    </div>

    <div className="text-right">
      <Button type="submit" class="w-full sm:w-min">Confirm 🚀</Button>
    </div>
  </form>
</template>
