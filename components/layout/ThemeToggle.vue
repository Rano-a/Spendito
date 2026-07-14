<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="hidden sm:flex fixed z-40 sm:top-6 sm:right-6 p-2.5 rounded-full transition-colors
      bg-white shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-100
      dark:bg-slate-900/70 dark:backdrop-blur-xl dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun v-if="isDark" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>
