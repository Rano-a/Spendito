<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

// Attributes land on the <input>, not the positioning wrapper.
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ enter: [] }>()

const visible = ref(false)
</script>

<template>
  <div class="relative">
    <input
      v-bind="$attrs"
      v-model="model"
      :type="visible ? 'text' : 'password'"
      class="input pr-10"
      @keyup.enter="emit('enter')"
    >
    <button
      type="button"
      class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      @click="visible = !visible"
    >
      <component :is="visible ? EyeOff : Eye" :size="18" />
    </button>
  </div>
</template>
