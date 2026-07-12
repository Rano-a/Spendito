<script setup lang="ts">
import { PiggyBank } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
    <div class="flex items-center gap-2 font-semibold text-xl mb-6 text-slate-900 dark:text-slate-100">
      <PiggyBank :size="26" class="text-indigo-500" />
      Budgeto
    </div>
    <div class="w-full max-w-sm">
      <slot />
    </div>
  </div>
</template>
