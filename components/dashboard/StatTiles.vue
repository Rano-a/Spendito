<script setup lang="ts">
const { totalRevenu, totalDepensesVariables, totalDepensesFixes, totalEpargne } = useCycle()

const tuiles = computed(() => [
  { label: 'Income', valeur: totalRevenu.value, dot: 'bg-good' },
  { label: 'Expenses', valeur: totalDepensesVariables.value, dot: 'bg-[#2a78d6] dark:bg-[#3987e5]' },
  { label: 'Bills', valeur: totalDepensesFixes.value, dot: 'bg-[#1baf7a] dark:bg-[#199e70]' },
  { label: 'Savings', valeur: totalEpargne.value, dot: 'bg-[#4a3aa7] dark:bg-[#9085e9]' }
])

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div v-for="t in tuiles" :key="t.label" class="card p-3.5">
      <div class="flex items-center gap-1.5 mb-1.5">
        <span class="w-2 h-2 rounded-full shrink-0" :class="t.dot" />
        <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ t.label }}</p>
      </div>
      <p class="text-lg font-semibold">€{{ formatMontant(t.valeur) }}</p>
    </div>
  </div>
</template>
