import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import Create from './pages/Create.vue'
import Join from './pages/Join.vue'
import Room from './pages/Room.vue'
import { connectionToPeer } from './lib/peer'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/join', component: Join },
    { path: '/rooms/:id', component: Room }
  ]
})

router.beforeEach((to) => {
  if (to.path.startsWith('/rooms/') && !connectionToPeer.value) {
    return { path: '/' }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
