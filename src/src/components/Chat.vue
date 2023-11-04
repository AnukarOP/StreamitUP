<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { connectionToPeer, peerName } from '../lib/peer'
import { username } from '../lib/user'

// Chat resizing
const chatEl = ref<HTMLUListElement | null>(null)

function onResize() {
  if (chatEl.value) {
    if (window.innerWidth < 1024) {
      // Get the stream section
      const section = document.getElementById('stream-section')

      chatEl.value.style.height = `calc(${window.innerHeight}px - 4rem - 3.8rem - ${section?.clientHeight}px)`
    } else {
      chatEl.value.style.height = `calc(${window.innerHeight}px - 4rem - 3rem - 3.8rem)`
    }
  }
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

interface Message {
  id: string
  username: string
  text: string
}

// Messages
const messages = ref<Message[]>([])

function onData(data: unknown) {
  if (typeof data !== 'string') return

  const [type, ...fragments] = data.split(':')

  if (type === 'msg_create') {
    const message: Message = {
      id: crypto.randomUUID(),
      username: peerName.value as string,
      text: fragments.join(':')
    }

    messages.value = [message, ...messages.value].slice(0, 100)
  }
}

onMounted(() => {
  connectionToPeer.value?.on('data', onData)
})

onUnmounted(() => {
  connectionToPeer.value?.off('data', onData)
})

const text = ref('')

function sendMessage() {
  const trimmed = text.value.trim()

  if (!trimmed.length) return

  const message: Message = {
    id: crypto.randomUUID(),
    username: username.value,
    text: trimmed
  }

  messages.value = [message, ...messages.value].slice(0, 100)

  connectionToPeer.value?.send(`msg_create:${trimmed}`)
  text.value = ''
}
</script>

<template>
  <section class="h-full w-full flex flex-col">
    <div class="hidden lg:flex bg-slate-600 h-12 items-center px-3 shadow">
      <h1 class="font-medium">Chat</h1>
    </div>

    <ul
      ref="chatEl"
      id="chat-container"
      class="overflow-y-scroll flex flex-col-reverse p-2">
      <li v-for="message in messages" :key="message.id" class="mb-2">
        <strong
          class="font-medium"
          :class="{
            'text-blue-400': message.username === username,
            'text-slate-400': message.username !== username
          }"
          >{{ message.username
          }}<span v-if="message.username === username" class="italic">
            (you)</span
          >:</strong
        >
        {{ message.text }}
      </li>
    </ul>

    <form
      @submit.prevent="sendMessage"
      class="flex-1 border-t-2 border-t-slate-700 relative flex items-center justify-center p-2">
      <input
        type="text"
        v-model="text"
        :placeholder="`Message @${peerName}`"
        class="flex-1 h-full outline-none bg-slate-900 rounded px-3 ring-2 ring-transparent focus:ring-blue-400 transition-all" />

      <button type="submit" class="absolute right-4">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_77_128)">
            <path
              class="transition-colors"
              :class="{
                'fill-slate-600': !text.length,
                'fill-blue-400': text.length
              }"
              d="M29.2938 15.6075C29.4128 15.5565 29.5143 15.4717 29.5856 15.3636C29.6569 15.2555 29.6949 15.1288 29.6949 14.9993C29.6949 14.8698 29.6569 14.7432 29.5856 14.6351C29.5143 14.527 29.4128 14.4422 29.2938 14.3912L10.2388 6.22504L10.2379 6.2241L9.64659 5.96961C9.53454 5.92146 9.41136 5.90522 9.29066 5.92269C9.16996 5.94015 9.05644 5.99063 8.96263 6.06857C8.86882 6.1465 8.79838 6.24884 8.75909 6.36429C8.71979 6.47975 8.71317 6.60381 8.73997 6.72279L8.88031 7.34966L8.87937 7.35247L10.5794 14.9993L8.87937 22.6462L8.87937 22.6499L8.73903 23.2768C8.71267 23.3956 8.71961 23.5195 8.75909 23.6346C8.79856 23.7498 8.86905 23.8518 8.96278 23.9295C9.05651 24.0071 9.16985 24.0575 9.29034 24.0749C9.41082 24.0923 9.53377 24.0761 9.64565 24.0281L29.2938 15.6075V15.6075ZM25.8104 15.6608L11.7873 15.6608L11.9024 15.1434C11.9236 15.0485 11.9236 14.9501 11.9024 14.8552L11.7873 14.3378L25.8104 14.3378L27.3533 14.9993L25.8114 15.6618L25.8104 15.6608Z" />
          </g>
          <defs>
            <clipPath id="clip0_77_128">
              <rect
                width="21.1708"
                height="21.1708"
                fill="white"
                transform="translate(14.9994 0.0292969) rotate(45)" />
            </clipPath>
          </defs>
        </svg>
        <span class="sr-only">Send</span>
      </button>
    </form>
  </section>
</template>

<style scoped>
#chat-container::-webkit-scrollbar {
  width: 8px;
  @apply bg-slate-900;
}

#chat-container::-webkit-scrollbar-thumb {
  @apply rounded bg-slate-700;
}

#chat-container {
  scrollbar-width: 5px;
  --tw-bg-opacity: 1;
  scrollbar-color: rgb(51 65 85 / var(--tw-bg-opacity));
  scrollbar-track-color: rgb(15 23 42 / var(--tw-bg-opacity));
}
</style>
