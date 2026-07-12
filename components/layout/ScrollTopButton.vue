<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button
    v-if="visible"
    class="fixed z-40 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 active:scale-95 transition-all
           bottom-20 left-1/2 -translate-x-1/2 w-14 h-14
           sm:bottom-8 sm:right-8 sm:left-auto sm:translate-x-0 sm:w-16 sm:h-16"
    aria-label="Scroll to top"
    @click="scrollTop"
  >
    <ArrowUp :size="28" />
  </button>
</template>
