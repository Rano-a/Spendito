<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { ProjetData } from '~/composables/useProjets'

const { projets, refresh } = useProjets()

const showForm = ref(false)
const projetEnEdition = ref<ProjetData | null>(null)

onMounted(refresh)

function ouvrirCreation() {
  projetEnEdition.value = null
  showForm.value = true
}

function ouvrirEdition(p: ProjetData) {
  projetEnEdition.value = p
  showForm.value = true
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold text-lg">Projects & savings</h2>
      <button class="btn-primary px-4 py-2" @click="ouvrirCreation">
        <Plus :size="16" />
        New project
      </button>
    </div>

    <div v-if="!projets.length" class="card p-6 text-center text-sm text-slate-400">
      No projects yet. Create your first savings goal!
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <ProjetsProjetCard
        v-for="p in projets"
        :key="p._id"
        :projet="p"
        @edit="ouvrirEdition(p)"
      />
    </div>

    <ProjetsProjetFormModal
      v-if="showForm"
      :projet="projetEnEdition"
      @close="showForm = false"
    />
  </div>
</template>
