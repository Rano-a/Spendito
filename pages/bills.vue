<script setup lang="ts">
const { cycleActif, refresh } = useCycle()

onMounted(refresh)
</script>

<template>
  <div class="space-y-5">
    <div class="card p-5">
      <h2 class="font-semibold">Bills</h2>
      <p class="text-sm text-slate-400">Subscriptions, insurance, repayments... check them off as you pay them.</p>
    </div>

    <JournalTransactionList
      v-if="cycleActif"
      titre="This month"
      :types="['depense_fixe']"
      type-ajout="depense_fixe"
      bouton-label="Bill"
    />
    <div v-else class="card p-6 text-center text-sm text-slate-400">
      No active month.
    </div>
  </div>
</template>
