<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  (e: 'hidden'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition appear @after-leave="$emit('hidden')">
      <div
        v-if="show"
        class="backdrop w-screen h-screen overflow-hidden absolute top-0 left-0 z-50 flex items-center justify-center">
        <section
          class="content bg-slate-800 px-6 py-4 rounded shadow-lg w-[90%] max-w-lg">
          <slot></slot>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

.v-enter-active,
.v-leave-active {
  transition: background-color 0.2s;
}

.v-enter-from,
.v-leave-to {
  background-color: rgba(0, 0, 0, 0);
}

.v-enter-active .content {
  animation: slide-in 0.2s;
}

@media screen and (prefers-reduced-motion: no-preference) {
  .v-leave-active .content {
    animation: slide-out 0.21s;
  }

  .v-enter-from .content .v-leave-to .content {
    transform: translateY(calc(50vh + 50%));
  }
}

@keyframes slide-in {
  0% {
    transform: translateY(calc(50vh + 50%));
  }

  80% {
    transform: translateY(-2vh);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(calc(50vh + 50%));
  }
}
</style>
