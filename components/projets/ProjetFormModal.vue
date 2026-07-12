<script setup lang="ts">
import type { ProjetData } from '~/composables/useProjets'

const props = defineProps<{ projet?: ProjetData | null }>()
const emit = defineEmits<{ close: [] }>()

const { creerProjet, modifierProjet } = useProjets()

const nom = ref(props.projet?.nom || '')
const montantCible = ref(props.projet?.montantCible ?? null)
const montantActuel = ref(props.projet?.montantActuel ?? 0)
const couleur = ref(props.projet?.couleur || '#6366f1')
const saving = ref(false)

const peutValider = computed(() => !!nom.value && !!montantCible.value && (montantCible.value as number) > 0)

async function valider() {
  if (!peutValider.value) return
  saving.value = true
  try {
    const payload = {
      nom: nom.value,
      montantCible: montantCible.value as number,
      montantActuel: montantActuel.value,
      couleur: couleur.value
    }
    if (props.projet) {
      await modifierProjet(props.projet._id, payload)
    } else {
      await creerProjet(payload)
    }
    emit('close')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UiModal :title="projet ? 'Edit project' : 'New project'" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="valider">
      <div>
        <label class="block text-sm font-medium mb-1">Project name</label>
        <input v-model="nom" type="text" placeholder="e.g. Summer vacation" class="input" autofocus>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Target amount</label>
        <input v-model.number="montantCible" type="number" step="0.01" min="0" class="input">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Current amount</label>
        <input v-model.number="montantActuel" type="number" step="0.01" min="0" class="input">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Color</label>
        <input v-model="couleur" type="color" class="h-10 w-16 rounded cursor-pointer">
      </div>
      <button type="submit" class="btn-primary w-full py-2.5" :disabled="!peutValider || saving">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
    </form>
  </UiModal>
</template>
