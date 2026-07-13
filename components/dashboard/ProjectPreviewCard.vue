<script setup lang="ts">
import * as Icons from 'lucide-vue-next'
import { PiggyBank } from 'lucide-vue-next'

const { projetPrincipal, refresh } = useProjets()

onMounted(refresh)

const progress = computed(() => {
  if (!projetPrincipal.value) return 0
  return projetPrincipal.value.montantActuel / projetPrincipal.value.montantCible
})

const iconComponent = computed(() => {
  const name = projetPrincipal.value?.icone
  return (name && (Icons as any)[name]) || PiggyBank
})

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <NuxtLink to="/projects" class="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <template v-if="projetPrincipal">
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        :style="{ backgroundColor: projetPrincipal.couleur + '20', color: projetPrincipal.couleur }"
      >
        <component :is="iconComponent" :size="22" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <p class="font-medium truncate">{{ projetPrincipal.nom }}</p>
          <span class="text-sm font-semibold shrink-0 ml-2">{{ Math.round(progress * 100) }}%</span>
        </div>
        <UiProgressBar :progress="progress" color="indigo" height="h-2.5" />
        <p class="mt-1 text-xs text-slate-400">
          {{ formatMontant(projetPrincipal.montantActuel) }} € / {{ formatMontant(projetPrincipal.montantCible) }} €
        </p>
      </div>
    </template>
    <p v-else class="text-sm text-slate-500">
      No savings project yet. Create one from the Projects page.
    </p>
  </NuxtLink>
</template>
