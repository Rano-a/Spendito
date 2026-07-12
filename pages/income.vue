<script setup lang="ts">
const { cycleActif, refresh } = useCycle()

onMounted(refresh)
</script>

<template>
  <div class="space-y-5">
    <div class="card p-5">
      <h2 class="font-semibold">Income</h2>
      <p class="text-sm text-slate-400">Salary, incoming transfers, and other money coming in this month.</p>
    </div>

    <JournalTransactionList
      v-if="cycleActif"
      titre="This month"
      :types="['revenu']"
      type-ajout="revenu"
      bouton-label="Income"
    />
    <div v-else class="card p-6 text-center text-sm text-slate-400">
      No active month.
    </div>
  </div>
</template>
