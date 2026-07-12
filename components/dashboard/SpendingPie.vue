<script setup lang="ts">
const { totalDepensesVariables, totalDepensesFixes, totalEpargne } = useCycle()

const CATS = [
  { label: 'Expenses', dot: 'bg-[#2a78d6] dark:bg-[#3987e5]', stroke: 'stroke-[#2a78d6] dark:stroke-[#3987e5]' },
  { label: 'Bills', dot: 'bg-[#1baf7a] dark:bg-[#199e70]', stroke: 'stroke-[#1baf7a] dark:stroke-[#199e70]' },
  { label: 'Savings & projects', dot: 'bg-[#4a3aa7] dark:bg-[#9085e9]', stroke: 'stroke-[#4a3aa7] dark:stroke-[#9085e9]' }
]

const R = 38
const STROKE = 12
const CIRC = 2 * Math.PI * R
const GAP = 1.5

const total = computed(() => totalDepensesVariables.value + totalDepensesFixes.value + totalEpargne.value)

const donnees = computed(() => [
  { ...CATS[0], valeur: totalDepensesVariables.value },
  { ...CATS[1], valeur: totalDepensesFixes.value },
  { ...CATS[2], valeur: totalEpargne.value }
])

const segments = computed(() => {
  if (total.value <= 0) return []
  let cursor = 0
  return donnees.value
    .filter(d => d.valeur > 0)
    .map(d => {
      const longueur = (d.valeur / total.value) * CIRC
      const seg = {
        label: d.label,
        stroke: d.stroke,
        dasharray: `${Math.max(0, longueur - GAP)} ${CIRC}`,
        dashoffset: -cursor
      }
      cursor += longueur
      return seg
    })
})

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function pourcentage(valeur: number) {
  if (total.value <= 0) return 0
  return Math.round((valeur / total.value) * 100)
}
</script>

<template>
  <div class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Spending breakdown</h3>

    <div class="flex flex-col sm:flex-row items-center gap-6">
      <div class="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
          <circle cx="50" cy="50" :r="R" fill="none" :stroke-width="STROKE" class="stroke-slate-100 dark:stroke-slate-800" />
          <circle
            v-for="s in segments"
            :key="s.label"
            cx="50" cy="50" :r="R" fill="none" :stroke-width="STROKE"
            :class="s.stroke"
            :stroke-dasharray="s.dasharray"
            :stroke-dashoffset="s.dashoffset"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p class="text-xs text-slate-500 dark:text-slate-400">Total</p>
          <p class="text-lg font-bold tracking-tight">€{{ formatMontant(total) }}</p>
        </div>
      </div>

      <div class="flex-1 w-full space-y-2">
        <div v-if="!total" class="text-sm text-slate-400">No spending recorded yet.</div>
        <div v-for="d in donnees" :key="d.label" class="flex items-center justify-between gap-2 text-sm">
          <span class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="d.dot" />
            <span class="truncate text-slate-600 dark:text-slate-300">{{ d.label }}</span>
          </span>
          <span class="shrink-0 font-medium">
            €{{ formatMontant(d.valeur) }} <span class="text-slate-400 font-normal">({{ pourcentage(d.valeur) }}%)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
