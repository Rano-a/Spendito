<script setup lang="ts">
import { ShoppingBag, Receipt, PiggyBank, TrendingUp, Check } from 'lucide-vue-next'
import type { TransactionData } from '~/composables/useCycle'

const props = defineProps<{ transaction: TransactionData }>()

const typeLabels: Record<string, string> = {
  depense_variable: 'Expense',
  depense_fixe: 'Bill',
  epargne: 'Savings',
  revenu: 'Income'
}

const typeColor: Record<string, string> = {
  depense_variable: 'text-[#2a78d6] dark:text-[#3987e5]',
  depense_fixe: 'text-[#eb6834] dark:text-[#d95926]',
  epargne: 'text-[#4a3aa7] dark:text-[#9085e9]',
  revenu: 'text-good'
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

const aPrevu = computed(() =>
  props.transaction.type === 'depense_fixe' &&
  props.transaction.montantPrevu != null &&
  props.transaction.montantPrevu !== props.transaction.montant
)
const paye = computed(() => props.transaction.type === 'depense_fixe' && props.transaction.paye)
</script>

<template>
  <div class="flex items-center gap-3 py-3 px-4 border-b border-slate-100 dark:border-white/10 last:border-0">
    <span class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" :class="typeBubble[transaction.type]">
      <Check v-if="paye" :size="16" />
      <component :is="typeIcons[transaction.type]" v-else :size="16" />
    </span>
    <div class="min-w-0 flex-1" :class="{ 'opacity-50': paye }">
      <p class="font-medium truncate" :class="{ 'line-through': paye }">
        {{ transaction.note || transaction.categorie || typeLabels[transaction.type] }}
      </p>
      <p class="text-xs text-slate-400">{{ transaction.categorie || typeLabels[transaction.type] }}</p>
    </div>
    <div class="text-right shrink-0">
      <span class="font-semibold block" :class="typeColor[transaction.type]">
        {{ signeTransaction(transaction) }}{{ montantAffiche(transaction).toFixed(2) }} €
      </span>
      <span v-if="aPrevu" class="text-xs text-slate-400">
        Planned {{ transaction.montantPrevu!.toFixed(2) }} €
      </span>
    </div>
  </div>
</template>
