<script setup lang="ts">
import { DataConnection } from 'peerjs'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Brand from '../components/Brand.vue'
import Button from '../components/Button.vue'
import Modal from '../components/Modal.vue'
import Navbar from '../components/Navbar.vue'
import UsernameModal from '../components/UsernameModal.vue'
import WaitingModal from '../components/WaitingModal.vue'
import {
  connected,
  connectionToPeer,
  peer,
  peerId,
  peerName
} from '../lib/peer'
import { username } from '../lib/user'

const router = useRouter()

const url = computed(() => {
  return `${location.protocol}//${location.host}/join?id=${peerId.value}`
})

const copied = ref(false)

function copyToClipboard() {
  if (copied.value) return

  navigator.clipboard.writeText(url.value).then(() => {
    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 1000)
  })
}

// Requests
interface Request {
  username: string
  connection: DataConnection
}

const queue = ref<Request[]>([])

onMounted(() => {
  peer.on('connection', (connection) => {
    connection.once('data', (data) => {
      if (typeof data !== 'string') return connection.close()

      queue.value.push({
        connection,
        username: data
      })
    })

    connection.on('close', () => {
      queue.value = queue.value.filter((item) => {
        return item.connection.peer !== connection.peer
      })
    })
  })
})

onUnmounted(() => {
  // Close pending connections
  queue.value.forEach((request) => {
    request.connection.close()
  })

  peer.off('connection')
})

function decline(request: Request) {
  request.connection.close()
}

function accept(request: Request) {
  request.connection.send(username.value)
  request.connection.off('close')

  peerName.value = request.username
  connectionToPeer.value = request.connection
  // Remove from requests so it is not closed during cleanup
  queue.value = queue.value.filter((item) => {
    return item.connection.peer !== request.connection.peer
  })
}

watchEffect(() => {
  if (peerName.value && connectionToPeer.value) {
    router.push(`/rooms/${peerId.value}`)
  }
})
</script>

<template>
  <Navbar>
    <Brand />
  </Navbar>

  <Modal :show="!username.length">
    <UsernameModal />
  </Modal>

  <Modal :show="username.length > 0 && !connected">
    <WaitingModal title="Creating room..." @cancel="router.push('/')" />
  </Modal>

  <main
    v-if="username.length && connected"
    class="flex-1 flex flex-col space-y-8 items-center justify-center px-6 text-center mx-auto">
    <h1 class="text-2xl font-medium">Your room is ready.</h1>

    <p class="text-lg">
      Send the below Link to your peer so they can Join you!
    </p>

    <p class="text-blue-400">
      {{ url }}
    </p>

    <Button type="button" class="w-48" @click="copyToClipboard">
      {{ copied ? 'Copied!' : 'Copy link' }}
    </Button>
  </main>

  <Modal :show="queue.length > 0">
    <div v-if="queue.length" class="text-center">
      <p class="text-lg mt-6 mb-8">
        <strong>{{ queue[0].username }}</strong> wants to join your room.
      </p>

      <div class="space-x-2">
        <Button
          type="button"
          class="bg-red-400 hover:bg-red-500 flex-1"
          @click="decline(queue[0] as Request)">
          Decline ❌
        </Button>
        <Button
          type="button"
          @click="accept(queue[0] as Request)"
          class="flex-1">
          Accept ✅
        </Button>
      </div>
    </div>
  </Modal>
</template>
