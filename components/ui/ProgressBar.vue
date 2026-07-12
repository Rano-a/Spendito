<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress: number
  color?: 'good' | 'warn' | 'bad' | 'indigo'
  height?: string
  needlePosition?: number | null
}>(), {
  color: 'indigo',
  height: 'h-4',
  needlePosition: null
})

const colorClass = computed(() => ({
  good: 'bg-good',
  warn: 'bg-warn',
  bad: 'bg-bad',
  indigo: 'bg-indigo-500'
}[props.color]))

const widthPct = computed(() => `${Math.min(100, Math.max(0, props.progress * 100))}%`)
const needlePct = computed(() => props.needlePosition === null ? null : `${Math.min(100, Math.max(0, props.needlePosition * 100))}%`)
</script>

<template>
  <div class="relative w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" :class="height">
    <div class="h-full rounded-full transition-all duration-500" :class="colorClass" :style="{ width: widthPct }" />
    <div
      v-if="needlePct !== null"
      class="absolute top-0 h-full w-0.5 bg-slate-700 dark:bg-slate-200"
      :style="{ left: needlePct }"
      title="Today's marker"
    />
  </div>
</template>
