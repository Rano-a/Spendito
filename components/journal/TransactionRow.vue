<script setup lang="ts">
import { Pencil, Trash2, Check, X } from 'lucide-vue-next'
import type { TransactionData } from '~/composables/useCycle'

const props = defineProps<{ transaction: TransactionData }>()

const { modifierTransaction, supprimerTransaction } = useTransactions()

const categories = ref<{ _id: string, nom: string }[]>([])
const editing = ref(false)
const montant = ref(props.transaction.montant)
const categorie = ref(props.transaction.categorie)
const note = ref(props.transaction.note)
const date = ref(props.transaction.date.slice(0, 10))
const saving = ref(false)

const aPrevu = computed(() => props.transaction.type === 'depense_fixe')

const typeLabels: Record<string, string> = {
  depense_variable: 'Expense',
  depense_fixe: 'Bill',
  epargne: 'Savings',
  revenu: 'Income'
}

const typeColor: Record<string, string> = {
  depense_variable: 'text-slate-500',
  depense_fixe: 'text-slate-500',
  epargne: 'text-indigo-500',
  revenu: 'text-good'
}

const signe = computed(() => props.transaction.type === 'revenu' ? '+' : '-')
const togglingPaye = ref(false)

async function togglePaye() {
  togglingPaye.value = true
  try {
    await modifierTransaction(props.transaction._id, { paye: !props.transaction.paye })
  } finally {
    togglingPaye.value = false
  }
}

async function startEdit() {
  montant.value = props.transaction.montant
  categorie.value = props.transaction.categorie
  note.value = props.transaction.note
  date.value = props.transaction.date.slice(0, 10)
  editing.value = true
  if (!categories.value.length) {
    categories.value = await $fetch('/api/categories')
  }
}

async function saveEdit() {
  saving.value = true
  try {
    await modifierTransaction(props.transaction._id, {
      montant: montant.value,
      categorie: categorie.value,
      note: note.value,
      date: date.value
    })
    editing.value = false
  } finally {
    saving.value = false
  }
}

async function remove() {
  await supprimerTransaction(props.transaction._id)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="flex items-center gap-3 py-3 px-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <template v-if="!editing">
      <input
        v-if="transaction.type === 'depense_fixe'"
        type="checkbox"
        class="rounded shrink-0"
        :checked="transaction.paye"
        :disabled="togglingPaye"
        @change="togglePaye"
      >
      <div class="min-w-0 flex-1" :class="{ 'opacity-50': transaction.type === 'depense_fixe' && transaction.paye }">
        <p class="font-medium truncate" :class="{ 'line-through': transaction.type === 'depense_fixe' && transaction.paye }">
          {{ transaction.note || transaction.categorie || typeLabels[transaction.type] }}
        </p>
        <p class="text-xs text-slate-400">
          {{ formatDate(transaction.date) }} · {{ transaction.categorie || typeLabels[transaction.type] }}
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="text-right">
          <span class="font-semibold block" :class="typeColor[transaction.type]">
            {{ signe }}{{ transaction.montant.toFixed(2) }} €
          </span>
          <span
            v-if="aPrevu && transaction.montantPrevu != null && transaction.montantPrevu !== transaction.montant"
            class="text-xs text-slate-400"
          >
            Planned {{ transaction.montantPrevu.toFixed(2) }} €
          </span>
        </div>
        <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="startEdit">
          <Pencil :size="15" />
        </button>
        <button class="p-1.5 rounded-full hover:bg-bad-bg dark:hover:bg-bad/10 text-slate-400 hover:text-bad" @click="remove">
          <Trash2 :size="15" />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="flex-1 flex flex-wrap items-center gap-2">
        <div class="flex flex-col">
          <input v-model.number="montant" type="number" step="0.01" class="input py-1.5 w-24">
          <span
            v-if="aPrevu && transaction.montantPrevu != null && transaction.montantPrevu !== transaction.montant"
            class="text-xs text-slate-400 mt-0.5"
          >
            Planned: {{ transaction.montantPrevu.toFixed(2) }} €
          </span>
        </div>
        <select v-model="categorie" class="input py-1.5 w-32">
          <option v-for="c in categories" :key="c._id" :value="c.nom">{{ c.nom }}</option>
        </select>
        <input v-model="note" type="text" placeholder="Title" class="input py-1.5 flex-1 min-w-[6rem]">
        <input v-model="date" type="date" class="input py-1.5 w-36">
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button class="p-1.5 rounded-full hover:bg-good-bg text-good" :disabled="saving" @click="saveEdit">
          <Check :size="16" />
        </button>
        <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="editing = false">
          <X :size="16" />
        </button>
      </div>
    </template>
  </div>
</template>
