import { ref } from 'vue'
import { DataConnection, Peer } from 'peerjs'

export const peer = new Peer()
export const peerId = ref('')
export const connected = ref(false)

export const peerName = ref<string>()
export const connectionToPeer = ref<DataConnection>()

peer.on('open', (id) => {
  peerId.value = id
  connected.value = true
})

peer.on('disconnected', () => {
  peer.reconnect()
})
