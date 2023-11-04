<script setup lang="ts">
import { useRouter } from 'vue-router'
import Brand from '../components/Brand.vue'
import Button from '../components/Button.vue'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
</script>

<template>
  <Navbar>
    <Brand />
    <Button type="button" @click="router.push('/create')">Create room</Button>
  </Navbar>

  <main
    className="flex-1 flex flex-col items-center justify-center space-y-10 text-center">
    <h1 className="text-2xl md:text-3xl font-bold">StreamitUP 🚀 <br> Github.com/AnukarOP</h1>
    <h2 className="max-w-xs text-lg md:text-xl md:max-w-md">
      Peer-2-peer screensharing and chat, with anyone,
      <strong>No account neded</strong>.
    </h2>
    <Button
      type="button"
      class="text-lg shadow-lg"
      @click="router.push('/create')"
      >Create room</Button
    >
  </main>
</template>
