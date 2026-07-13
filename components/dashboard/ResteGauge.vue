<script setup lang="ts">
import { Sun, CloudSun, CloudRain } from 'lucide-vue-next'

const {
  resteADepenser, resteADepenserPrevu, resteParJour, joursRestants, ambiance,
  progressionVariable, positionAiguille, totalDepensesVariables, enveloppeVariable
} = useCycle()

const ambianceConfig = computed(() => ({
  vert: { icon: Sun, label: 'Smooth sailing', text: 'text-good', ring: 'stroke-good', glow: 'dark:drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]' },
  orange: { icon: CloudSun, label: 'Tightening up', text: 'text-warn', ring: 'stroke-warn', glow: 'dark:drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]' },
  rouge: { icon: CloudRain, label: 'Over budget', text: 'text-bad', ring: 'stroke-bad', glow: 'dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]' }
}[ambiance.value]))

const R = 42
const CIRC = 2 * Math.PI * R
const progress = computed(() => Math.min(1, Math.max(0, progressionVariable.value)))
const dashoffset = computed(() => CIRC * (1 - progress.value))
const needleAngle = computed(() => positionAiguille.value * 360)

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <div class="card p-6">
    <div class="flex items-center justify-center gap-2 mb-4" :class="ambianceConfig.text">
      <component :is="ambianceConfig.icon" :size="20" />
      <span class="text-sm font-medium">{{ ambianceConfig.label }}</span>
    </div>

    <div class="relative w-52 h-52 mx-auto">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90 overflow-visible">
        <circle cx="50" cy="50" :r="R" fill="none" stroke-width="9" class="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx="50" cy="50" :r="R" fill="none" stroke-width="9" stroke-linecap="round"
          :class="[ambianceConfig.ring, ambianceConfig.glow]"
          :stroke-dasharray="CIRC"
          :stroke-dashoffset="dashoffset"
          style="transition: stroke-dashoffset 0.5s ease"
        />
        <line
          :x1="50 + R - 7" y1="50" :x2="50 + R + 7" y2="50"
          class="stroke-slate-400 dark:stroke-slate-500" stroke-width="2"
          :transform="`rotate(${needleAngle} 50 50)`"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p class="text-xs text-slate-500 dark:text-slate-400">Left to spend</p>
        <p class="text-3xl font-bold tracking-tight">{{ formatMontant(resteADepenser) }} €</p>
        <p v-if="resteADepenserPrevu !== resteADepenser" class="text-xs text-slate-400 mt-0.5">
          Forecast {{ formatMontant(resteADepenserPrevu) }} €
        </p>
      </div>
    </div>

    <p class="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
      That's <span class="font-semibold text-slate-700 dark:text-slate-200">{{ formatMontant(resteParJour) }} € / day</span>
      over {{ joursRestants }} day{{ joursRestants > 1 ? 's' : '' }}
    </p>
    <p class="mt-1 text-center text-xs text-slate-400">
      {{ formatMontant(totalDepensesVariables) }} € / {{ formatMontant(enveloppeVariable) }} € of the expense envelope
      · the marker shows where you should be today
    </p>
  </div>
</template>
