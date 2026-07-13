<script setup lang="ts">
import * as Icons from 'lucide-vue-next'
import { PiggyBank, Pencil, Trash2, Plus, Minus } from 'lucide-vue-next'
import type { ProjetData } from '~/composables/useProjets'

const props = defineProps<{ projet: ProjetData }>()
const emit = defineEmits<{ edit: [] }>()

const { ajusterMontant, supprimerProjet } = useProjets()

const montantAjustement = ref<number | null>(null)

const progress = computed(() => props.projet.montantActuel / props.projet.montantCible)
const complet = computed(() => progress.value >= 1)

const iconComponent = computed(() => (Icons as any)[props.projet.icone] || PiggyBank)

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

async function ajouter() {
  if (!montantAjustement.value) return
  await ajusterMontant(props.projet._id, montantAjustement.value)
  montantAjustement.value = null
}

async function retirer() {
  if (!montantAjustement.value) return
  await ajusterMontant(props.projet._id, -montantAjustement.value)
  montantAjustement.value = null
}

async function remove() {
  await supprimerProjet(props.projet._id)
}
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center gap-3 mb-3">
      <div
        class="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        :style="{ backgroundColor: projet.couleur + '20', color: projet.couleur }"
      >
        <component :is="iconComponent" :size="20" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium truncate">{{ projet.nom }}</p>
        <p class="text-xs text-slate-400">
          {{ formatMontant(projet.montantActuel) }} € / {{ formatMontant(projet.montantCible) }} €
        </p>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="emit('edit')">
          <Pencil :size="15" />
        </button>
        <button class="p-1.5 rounded-full hover:bg-bad-bg dark:hover:bg-bad/10 text-slate-400 hover:text-bad" @click="remove">
          <Trash2 :size="15" />
        </button>
      </div>
    </div>

    <UiProgressBar :progress="progress" :color="complet ? 'good' : 'indigo'" height="h-3" />
    <p class="mt-1 text-right text-xs font-medium text-slate-400">{{ Math.round(progress * 100) }}%</p>

    <ProjetsCelebrationBadge v-if="complet" />

    <div class="mt-3 flex items-center gap-2">
      <input
        v-model.number="montantAjustement"
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount"
        class="input py-1.5 flex-1"
      >
      <button class="btn-secondary px-3 py-1.5" @click="ajouter">
        <Plus :size="15" />
      </button>
      <button class="btn-secondary px-3 py-1.5" @click="retirer">
        <Minus :size="15" />
      </button>
    </div>
  </div>
</template>
