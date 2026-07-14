<script setup lang="ts">
const { historique, refresh } = useCycle()

onMounted(refresh)
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
      <HistoryMonthCard v-for="cycle in historique" :key="cycle._id" :cycle="cycle" />
    </div>
  </div>
</template>
