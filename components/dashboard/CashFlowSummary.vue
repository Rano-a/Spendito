<script setup lang="ts">
const { enveloppeVariable, totalDepensesVariables, totalDepensesFixesPrevu, totalDepensesFixes, totalEpargne } = useCycle()

const categories = computed(() => [
  {
    label: 'Expenses',
    planned: enveloppeVariable.value,
    actual: totalDepensesVariables.value,
    solid: 'bg-[#2a78d6] dark:bg-[#3987e5]',
    light: 'bg-[#2a78d6]/25 dark:bg-[#3987e5]/25'
  },
  {
    label: 'Bills',
    planned: totalDepensesFixesPrevu.value,
    actual: totalDepensesFixes.value,
    solid: 'bg-[#1baf7a] dark:bg-[#199e70]',
    light: 'bg-[#1baf7a]/25 dark:bg-[#199e70]/25'
  },
  {
    label: 'Savings',
    planned: totalEpargne.value,
    actual: totalEpargne.value,
    solid: 'bg-[#4a3aa7] dark:bg-[#9085e9]',
    light: 'bg-[#4a3aa7]/25 dark:bg-[#9085e9]/25'
  }
])

const maxValeur = computed(() => Math.max(1, ...categories.value.flatMap(c => [c.planned, c.actual])))

function pct(v: number) {
  return Math.min(100, (v / maxValeur.value) * 100)
}

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <div class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Cash flow summary</h3>
    <p class="text-xs text-slate-400 mb-4">Planned vs. actual per category</p>

    <div class="flex items-center gap-4 mb-4 text-xs text-slate-400">
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        Planned
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-2.5 rounded-full bg-slate-500 dark:bg-slate-400" />
        Actual
      </span>
    </div>

    <div class="space-y-4">
      <div v-for="cat in categories" :key="cat.label">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{{ cat.label }}</p>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="cat.light" :style="{ width: pct(cat.planned) + '%' }" />
            </div>
            <span class="text-xs text-slate-400 w-16 text-right shrink-0 tabular-nums">{{ formatMontant(cat.planned) }} €</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="cat.solid" :style="{ width: pct(cat.actual) + '%' }" />
            </div>
            <span class="text-xs font-medium text-slate-700 dark:text-slate-200 w-16 text-right shrink-0 tabular-nums">{{ formatMontant(cat.actual) }} €</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
