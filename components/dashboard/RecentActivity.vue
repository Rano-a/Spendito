<script setup lang="ts">
const { transactions } = useCycle()

const typeLabels: Record<string, string> = {
  depense_variable: 'Expense',
  depense_fixe: 'Bill',
  epargne: 'Savings',
  revenu: 'Income'
}

const recent = computed(() =>
  [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
)

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Recent activity</h3>
    <div v-if="!recent.length" class="text-sm text-slate-400">No transactions yet.</div>
    <div class="space-y-3">
      <div v-for="t in recent" :key="t._id" class="flex items-center justify-between gap-3 text-sm">
        <div class="min-w-0">
          <p class="font-medium truncate">{{ t.note || t.categorie || typeLabels[t.type] }}</p>
          <p class="text-xs text-slate-400">{{ formatDate(t.date) }} · {{ typeLabels[t.type] }}</p>
        </div>
        <span class="shrink-0 font-semibold" :class="t.type === 'revenu' ? 'text-good' : 'text-slate-600 dark:text-slate-300'">
          {{ t.type === 'revenu' ? '+' : '-' }}€{{ formatMontant(t.montant) }}
        </span>
      </div>
    </div>
  </div>
</template>
