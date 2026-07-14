<script setup lang="ts">
import { Plus, ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { TransactionData } from '~/composables/useCycle'

const props = defineProps<{
  titre: string
  types: TransactionData['type'][]
  typeAjout?: TransactionData['type']
  boutonLabel?: string
}>()

const { transactions, cycleActif } = useCycle()
const { ajouterTransaction } = useTransactions()

const trie = computed(() =>
  transactions.value
    .filter(t => props.types.includes(t.type))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
)

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function libelleJour(iso: string) {
  // Transaction dates are stored as UTC midnight representing a calendar day
  // the user picked, not a real instant — slicing the ISO string gives that
  // intended day directly. Comparing against local Today/Yesterday strings
  // (rather than constructing Date objects and using local get*() methods)
  // avoids a same-day transaction reading as "Yesterday" for users west of
  // UTC, where UTC midnight falls on the previous local calendar day.
  const cle = iso.slice(0, 10)
  const maintenant = new Date()
  const aujourdHui = localDateStr(maintenant)
  const hier = new Date(maintenant)
  hier.setDate(hier.getDate() - 1)

  if (cle === aujourdHui) return 'Today'
  if (cle === localDateStr(hier)) return 'Yesterday'

  const [annee, mois, jour] = cle.split('-').map(Number)
  return new Date(Date.UTC(annee, mois - 1, jour)).toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
  })
}

function grouperParJour(liste: typeof trie.value) {
  const parJour = new Map<string, { label: string, total: number, items: typeof trie.value }>()
  for (const t of liste) {
    const cle = t.date.slice(0, 10)
    if (!parJour.has(cle)) {
      parJour.set(cle, { label: libelleJour(t.date), total: 0, items: [] })
    }
    const groupe = parJour.get(cle)!
    groupe.items.push(t)
    groupe.total += t.type === 'revenu' ? t.montant : -t.montant
  }
  return [...parJour.values()]
}

const APERCU = 5
const expanded = ref(false)

const groupes = computed(() =>
  grouperParJour(expanded.value ? trie.value : trie.value.slice(0, APERCU))
)
const masquees = computed(() => Math.max(0, trie.value.length - APERCU))

const total = computed(() =>
  trie.value.reduce((acc, t) => acc + (t.type === 'revenu' ? t.montant : -t.montant), 0)
)
const categories = ref<{ _id: string, nom: string }[]>([])
const adding = ref(false)
const saving = ref(false)
const addError = ref('')
const montant = ref<number | null>(null)
const categorie = ref('')
const note = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

async function startAdd() {
  if (!categories.value.length) {
    categories.value = await $fetch('/api/categories')
  }
  montant.value = null
  categorie.value = categories.value[0]?.nom || ''
  note.value = ''
  date.value = new Date().toISOString().slice(0, 10)
  adding.value = true
}

const peutValider = computed(() => !!montant.value && montant.value > 0 && !!cycleActif.value)

async function confirmAdd() {
  if (!peutValider.value) return
  saving.value = true
  addError.value = ''
  try {
    await ajouterTransaction({
      montant: montant.value as number,
      type: props.typeAjout || props.types[0],
      categorie: categorie.value,
      note: note.value,
      date: date.value,
      cycleId: cycleActif.value!._id
    })
    adding.value = false
  } catch (e: any) {
    addError.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="card overflow-hidden">
    <div class="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">
        {{ titre }}
        <span v-if="trie.length" class="text-xs text-slate-400 font-normal">({{ trie.length }})</span>
      </h3>
      <button
        v-if="!adding && typeAjout"
        class="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-accent-violet-dark"
        @click="startAdd"
      >
        <Plus :size="16" />
        {{ boutonLabel || 'Add' }}
      </button>
    </div>

    <div v-if="adding" class="flex flex-wrap items-center gap-2 py-3 px-4 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
      <input
        v-model.number="montant"
        type="number"
        inputmode="decimal"
        step="0.01"
        min="0"
        placeholder="Amount"
        class="input py-1.5 w-24"
        autofocus
        @keyup.enter="confirmAdd"
      >
      <select v-model="categorie" class="input py-1.5 w-32">
        <option v-for="c in categories" :key="c._id" :value="c.nom">{{ c.nom }}</option>
      </select>
      <input v-model="note" type="text" placeholder="Title" class="input py-1.5 flex-1 min-w-[6rem]" @keyup.enter="confirmAdd">
      <input v-model="date" type="date" class="input py-1.5 w-36">
      <button class="btn-primary px-3 py-1.5" :disabled="!peutValider || saving" @click="confirmAdd">
        {{ saving ? '...' : 'Add' }}
      </button>
      <button class="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400" @click="adding = false">
        Cancel
      </button>
    </div>
    <p v-if="addError" class="text-xs text-bad px-4 pt-2">{{ addError }}</p>

    <div v-if="!trie.length && !adding" class="p-6 text-center text-sm text-slate-400">
      No transactions.
    </div>
    <div v-for="groupe in groupes" :key="groupe.label + groupe.items[0]._id">
      <div class="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 py-1.5 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
        <span>{{ groupe.label }}</span>
        <span :class="groupe.total >= 0 ? 'text-good' : 'text-slate-500 dark:text-slate-400'">
          {{ groupe.total >= 0 ? '+' : '' }}{{ groupe.total.toFixed(2) }} €
        </span>
      </div>
      <JournalTransactionRow v-for="t in groupe.items" :key="t._id" :transaction="t" />
    </div>

    <button
      v-if="masquees > 0"
      class="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-indigo-600 dark:text-accent-violet-dark border-t border-slate-100 dark:border-white/10"
      @click="expanded = !expanded"
    >
      <component :is="expanded ? ChevronUp : ChevronDown" :size="16" />
      {{ expanded ? 'Show less' : `Show ${masquees} more` }}
    </button>

    <div v-if="trie.length" class="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-200 dark:border-white/10 text-sm font-semibold">
      <span>Total</span>
      <span :class="total >= 0 ? 'text-good' : 'text-slate-700 dark:text-slate-200'">
        {{ total >= 0 ? '+' : '' }}{{ total.toFixed(2) }} €
      </span>
    </div>
  </div>
</template>
