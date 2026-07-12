<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun v-if="isDark" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>
