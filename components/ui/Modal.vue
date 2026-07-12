<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="emit('close')">
      <div class="w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button class="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" @click="emit('close')">
            <X :size="20" />
          </button>
        </div>
        <div class="p-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
