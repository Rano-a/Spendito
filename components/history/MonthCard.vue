<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { CycleData, TransactionData } from '~/composables/useCycle'

const props = withDefaults(defineProps<{ cycle: CycleData, ambigu?: boolean }>(), { ambigu: false })

const transactions = ref<TransactionData[]>([])
const loading = ref(true)
const error = ref('')
const expanded = ref(false)

onMounted(async () => {
  try {
    transactions.value = await $fetch<TransactionData[]>('/api/transactions', {
      query: { cycleId: props.cycle._id }
    })
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    loading.value = false
  }
})

const moisLabel = computed(() => calculerMoisCouvert(props.cycle))
const totaux = computed(() => calculerTotauxCycle(transactions.value))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}
const plage = computed(() => `${formatDate(props.cycle.dateDebut)} – ${formatDate(props.cycle.dateFinPrevue)}`)

// When another closed cycle resolves to the same month, the range is what
// actually tells the two apart — so it takes the heading and the month drops
// to the subtitle rather than repeating an identical title twice.
const titre = computed(() => props.ambigu ? plage.value : moisLabel.value)
const sousTitre = computed(() => props.ambigu ? moisLabel.value : plage.value)

const tuiles = computed(() => [
  { label: 'Income', valeur: totaux.value.totalRevenu, dot: 'bg-good' },
  { label: 'Expenses', valeur: totaux.value.totalDepensesVariables, dot: 'bg-[#2a78d6] dark:bg-[#3987e5]' },
  {
    label: 'Bills', valeur: totaux.value.totalDepensesFixes, dot: 'bg-[#eb6834] dark:bg-[#d95926]',
    prevu: totaux.value.totalDepensesFixesPrevu
  },
  { label: 'Savings', valeur: totaux.value.totalEpargne, dot: 'bg-[#4a3aa7] dark:bg-[#9085e9]' }
])

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function libelleJour(iso: string) {
  const [annee, mois, jour] = iso.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(annee, mois - 1, jour)).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
  })
}

const groupes = computed(() => {
  const trie = [...transactions.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const parJour = new Map<string, { label: string, total: number, items: TransactionData[] }>()
  for (const t of trie) {
    const cle = t.date.slice(0, 10)
    if (!parJour.has(cle)) parJour.set(cle, { label: libelleJour(t.date), total: 0, items: [] })
    const groupe = parJour.get(cle)!
    groupe.items.push(t)
    groupe.total += t.type === 'revenu' ? t.montant : -t.montant
  }
  return [...parJour.values()]
})
</script>

<template>
  <div class="card overflow-hidden">
    <button class="w-full flex items-center justify-between gap-3 p-5 text-left" @click="expanded = !expanded">
      <div>
        <h3 class="font-semibold">{{ titre }}</h3>
        <p class="text-xs text-slate-400">{{ sousTitre }}</p>
      </div>
      <component :is="expanded ? ChevronUp : ChevronDown" :size="18" class="shrink-0 text-slate-400" />
    </button>

    <p v-if="error" class="px-5 pb-4 text-xs text-bad">{{ error }}</p>

    <div v-else-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pb-5">
      <div v-for="t in tuiles" :key="t.label">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="w-2 h-2 rounded-full shrink-0" :class="t.dot" />
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ t.label }}</p>
        </div>
        <p class="font-semibold">{{ formatMontant(t.valeur) }} €</p>
        <p v-if="t.prevu !== undefined && t.prevu !== t.valeur" class="text-xs text-slate-400">
          Planned {{ formatMontant(t.prevu) }} €
        </p>
      </div>
    </div>

    <div v-if="expanded" class="border-t border-slate-100 dark:border-white/10">
      <div v-if="!transactions.length" class="p-6 text-center text-sm text-slate-400">
        No transactions this month.
      </div>
      <div v-for="groupe in groupes" :key="groupe.label + groupe.items[0]._id">
        <div class="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{{ groupe.label }}</span>
          <span :class="groupe.total >= 0 ? 'text-good' : 'text-slate-500 dark:text-slate-400'">
            {{ groupe.total >= 0 ? '+' : '' }}{{ groupe.total.toFixed(2) }} €
          </span>
        </div>
        <HistoryTransactionRow v-for="t in groupe.items" :key="t._id" :transaction="t" />
      </div>
    </div>
  </div>
</template>
