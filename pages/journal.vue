<script setup lang="ts">
import { Sparkles, Pencil, Check, X } from 'lucide-vue-next'

const { cycleActif, refresh, modifierCycle } = useCycle()
const showNewCycle = ref(false)
const editingDate = ref(false)
const dateDebutEdit = ref('')
const savingDate = ref(false)

onMounted(refresh)

function startEditDate() {
  if (!cycleActif.value) return
  dateDebutEdit.value = cycleActif.value.dateDebut.slice(0, 10)
  editingDate.value = true
}

async function saveDate() {
  if (!cycleActif.value) return
  savingDate.value = true
  try {
    await modifierCycle(cycleActif.value._id, { dateDebut: dateDebutEdit.value })
    editingDate.value = false
  } finally {
    savingDate.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="card p-5 flex items-center justify-between gap-3">
      <div v-if="cycleActif && editingDate" class="flex items-center gap-2">
        <input v-model="dateDebutEdit" type="date" class="input py-1.5">
        <button class="p-1.5 rounded-full hover:bg-good-bg text-good" :disabled="savingDate" @click="saveDate">
          <Check :size="16" />
        </button>
        <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="editingDate = false">
          <X :size="16" />
        </button>
      </div>
      <div v-else>
        <h2 class="font-semibold">This month</h2>
        <p class="text-sm text-slate-400 flex items-center gap-1.5" v-if="cycleActif">
          Started {{ new Date(cycleActif.dateDebut).toLocaleDateString('en-US') }} ·
          ends {{ new Date(cycleActif.dateFinPrevue).toLocaleDateString('en-US') }}
          <button class="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="startEditDate">
            <Pencil :size="13" />
          </button>
        </p>
        <p class="text-sm text-slate-400" v-else>No active month</p>
      </div>
      <button class="btn-primary px-4 py-2 shrink-0" @click="showNewCycle = true">
        <Sparkles :size="16" />
        New month
      </button>
    </div>

    <JournalTransactionList
      v-if="cycleActif"
      titre="Journal"
      :types="['depense_variable', 'epargne']"
      type-ajout="depense_variable"
      bouton-label="Expense"
    />

    <JournalNewCycleModal v-if="showNewCycle" @close="showNewCycle = false" />
  </div>
</template>
