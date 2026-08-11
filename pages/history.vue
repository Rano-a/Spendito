<script setup lang="ts">
const { historique, refresh } = useCycle()

onMounted(refresh)

// Two cycles can legitimately cover the same calendar month — a month started
// early, or a short cycle — and would then render two cards under an identical
// "July 2026" heading with no way to tell them apart. Flag only the colliding
// ones so the common case keeps the clean month title.
const cartes = computed(() => {
  const occurrences = new Map<string, number>()
  for (const cycle of historique.value) {
    const label = calculerMoisCouvert(cycle) || ''
    occurrences.set(label, (occurrences.get(label) || 0) + 1)
  }
  return historique.value.map(cycle => ({
    cycle,
    ambigu: (occurrences.get(calculerMoisCouvert(cycle) || '') || 0) > 1
  }))
})
</script>

<template>
  <div class="space-y-5">
    <div class="card p-5">
      <h2 class="font-semibold">History</h2>
      <p class="text-sm text-slate-400">Your closed months, most recent first.</p>
    </div>

    <div v-if="!historique.length" class="card p-6 text-center text-sm text-slate-400">
      No past months yet. Once you start a new month, the closed one will show up here.
    </div>

    <div v-else class="space-y-4">
      <HistoryMonthCard
        v-for="carte in cartes"
        :key="carte.cycle._id"
        :cycle="carte.cycle"
        :ambigu="carte.ambigu"
      />
    </div>
  </div>
</template>
