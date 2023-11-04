<script setup lang="ts">
import { DataConnection } from 'peerjs'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Brand from '../components/Brand.vue'
import Button from '../components/Button.vue'
import Modal from '../components/Modal.vue'
import Navbar from '../components/Navbar.vue'
import UsernameModal from '../components/UsernameModal.vue'
import WaitingModal from '../components/WaitingModal.vue'
import { connected, connectionToPeer, peer, peerName } from '../lib/peer'
import { username } from '../lib/user'

const router = useRouter()
const route = useRoute()

const id = computed(() => {
  if (Array.isArray(route.query.id)) {
    return route.query.id[0] as string
  }

  return route.query.id || ''
})

// Invalid peer events
const invalidId = ref(false)

onMounted(() => {
  peer.on('error', (e: unknown) => {
    const err = e as { type: string }

    if (err.type === 'peer-unavailable') {
      invalidId.value = true
    }
  })
})

onUnmounted(() => {
  peer.off('error')
})

// Joinr request
const rejected = ref(false)
const connection = ref<DataConnection>()

watchEffect(() => {
  if (username.value.length && connected.value && !rejected.value) {
    connection.value = peer.connect(id.value)

    connection.value.on('open', () => {
      connection.value?.send(username.value)
    })

    connection.value.once('data', (data: unknown) => {
      if (typeof data !== 'string') {
        rejected.value = true
        connection.value?.close()
        return
      }

      connection.value?.off('close')
      peerName.value = data.substring(0, 12)
      connectionToPeer.value = connection.value
    })

    connection.value.on('close', () => {
      rejected.value = true
    })
  }
})

watchEffect(() => {
  if (connectionToPeer.value && peerName.value) {
    router.push(`/rooms/${connectionToPeer.value.peer}`)
  }
})

// Close pending connection if any
onUnmounted(() => {
  if (connection.value && !connectionToPeer.value) {
    connection.value.close()
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

  <Modal
    :show="username.length > 0 && !connectionToPeer && !invalidId && !rejected">
    <WaitingModal
      title="Requesting to join room..."
      @cancel="router.push('/')" />
  </Modal>

  <Modal :show="invalidId || rejected">
    <div class="text-center">
      <h1 v-if="rejected" class="text-xl mt-6 mb-8">
        Your request was rejected.
      </h1>
      <h1 v-else class="text-xl mt-6 mb-8">Invalid room ID.</h1>

      <Button @click="router.push('/')">Go back</Button>
    </div>
  </Modal>
</template>
