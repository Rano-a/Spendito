<script setup lang="ts">
import { ShoppingBag, Receipt, PiggyBank, TrendingUp } from 'lucide-vue-next'

const { transactions } = useCycle()

const typeLabels: Record<string, string> = {
  depense_variable: 'Expense',
  depense_fixe: 'Bill',
  epargne: 'Savings',
  revenu: 'Income'
}

const typeIcons: Record<string, any> = {
  depense_variable: ShoppingBag,
  depense_fixe: Receipt,
  epargne: PiggyBank,
  revenu: TrendingUp
}

const typeBubble: Record<string, string> = {
  depense_variable: 'bg-[#2a78d6]/15 text-[#2a78d6] dark:bg-[#3987e5]/15 dark:text-[#3987e5] dark:shadow-glow-blue',
  depense_fixe: 'bg-[#eb6834]/15 text-[#eb6834] dark:bg-[#d95926]/15 dark:text-[#d95926] dark:shadow-glow-orange',
  epargne: 'bg-[#4a3aa7]/15 text-[#4a3aa7] dark:bg-[#9085e9]/15 dark:text-[#9085e9] dark:shadow-glow-violet',
  revenu: 'bg-good/15 text-good dark:shadow-glow-good'
}

const recent = computed(() =>
  transactions.value
    // An unpaid bill hasn't happened yet — it's this month's plan, not
    // activity. Every bill for the month is created up front with a due date,
    // so leaving them in let a wall of unconfirmed bills fill all six slots
    // and hide the expenses and income that actually moved.
    .filter(t => !(t.type === 'depense_fixe' && !t.paye))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
)

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Recent activity</h3>
    <div v-if="!recent.length" class="text-sm text-slate-400">No activity yet.</div>
    <div class="space-y-3">
      <div v-for="t in recent" :key="t._id" class="flex items-center gap-3 text-sm">
        <span class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" :class="typeBubble[t.type]">
          <component :is="typeIcons[t.type]" :size="16" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-medium truncate">{{ t.note || t.categorie || typeLabels[t.type] }}</p>
          <p class="text-xs text-slate-400">{{ formatDate(t.date) }} · {{ typeLabels[t.type] }}</p>
        </div>
        <span class="shrink-0 font-semibold" :class="signeTransaction(t) === '+' ? 'text-good' : 'text-slate-600 dark:text-slate-300'">
          {{ signeTransaction(t) }}{{ formatMontant(montantAffiche(t)) }} €
        </span>
      </div>
    </div>
  </div>
</template>
