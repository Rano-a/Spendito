<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const { demarrerNouveauCycle } = useCycle()

interface DepenseReguliereData {
  _id: string
  nom: string
  montantParDefaut: number
  categorie: string
}

const depensesRegulieres = ref<DepenseReguliereData[]>([])
const selection = ref<Set<string>>(new Set())
const salaire = ref<number | null>(null)
const dateDebut = ref(new Date().toISOString().slice(0, 10))
const dateProchainSalaire = ref('')
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  depensesRegulieres.value = await $fetch('/api/depenses-regulieres')
  selection.value = new Set(depensesRegulieres.value.map(d => d._id))

  const defaultNext = new Date()
  defaultNext.setDate(defaultNext.getDate() + 30)
  dateProchainSalaire.value = defaultNext.toISOString().slice(0, 10)
})

function toggle(id: string) {
  if (selection.value.has(id)) selection.value.delete(id)
  else selection.value.add(id)
}

const peutValider = computed(() => !!salaire.value && salaire.value > 0 && !!dateProchainSalaire.value)

async function valider() {
  if (!peutValider.value) return
  saving.value = true
  error.value = ''
  try {
    const depensesFixesSelectionnees = depensesRegulieres.value
      .filter(d => selection.value.has(d._id))
      .map(d => ({ nom: d.nom, montant: d.montantParDefaut, categorie: d.categorie }))

    await demarrerNouveauCycle({
      revenuTotal: salaire.value as number,
      dateDebut: dateDebut.value,
      dateFinPrevue: dateProchainSalaire.value,
      depensesFixesSelectionnees
    })
    emit('close')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UiModal title="New month" @close="emit('close')">
    <form class="space-y-5" @submit.prevent="valider">
      <div>
        <label class="block text-sm font-medium mb-1">Salary amount received</label>
        <input
          v-model.number="salaire"
          type="number"
          inputmode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          class="input text-xl font-semibold py-3"
          autofocus
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Date the salary was received</label>
        <input v-model="dateDebut" type="date" class="input">
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Estimated date of next salary</label>
        <input v-model="dateProchainSalaire" type="date" class="input">
      </div>

      <div v-if="depensesRegulieres.length">
        <p class="block text-sm font-medium mb-2">Bills to confirm for this month</p>
        <div class="space-y-2">
          <label
            v-for="d in depensesRegulieres"
            :key="d._id"
            class="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer transition-colors"
          >
            <span class="flex items-center gap-2">
              <input
                type="checkbox"
                class="rounded w-4 h-4 accent-[#4a3aa7] dark:accent-[#9085e9]"
                :checked="selection.has(d._id)"
                @change="toggle(d._id)"
              >
              <span class="text-sm">{{ d.nom }}</span>
            </span>
            <span class="text-sm font-medium text-slate-500">{{ d.montantParDefaut.toFixed(2) }} €</span>
          </label>
        </div>
      </div>

      <p v-if="error" class="text-sm text-bad">{{ error }}</p>

      <button type="submit" class="btn-primary w-full py-2.5" :disabled="!peutValider || saving">
        {{ saving ? 'Starting...' : 'Start the new month' }}
      </button>
    </form>
  </UiModal>
</template>
