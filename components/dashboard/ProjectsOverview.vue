<script setup lang="ts">
const { projets, refresh } = useProjets()

onMounted(refresh)

function progress(p: { montantActuel: number, montantCible: number }) {
  if (!p.montantCible) return 0
  return Math.min(1, p.montantActuel / p.montantCible)
}

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <div v-if="projets.length > 1" class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Savings projects</h3>
    <div class="space-y-3">
      <div v-for="p in projets" :key="p._id">
        <div class="flex items-center justify-between gap-2 mb-1 text-sm">
          <span class="truncate font-medium">{{ p.nom }}</span>
          <span class="shrink-0 text-slate-400">€{{ formatMontant(p.montantActuel) }} / €{{ formatMontant(p.montantCible) }}</span>
        </div>
        <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: `${progress(p) * 100}%`, backgroundColor: p.couleur }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
