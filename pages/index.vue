<script setup lang="ts">
const { cycleActif, moisCouvert, refresh } = useCycle()

onMounted(refresh)
</script>

<template>
  <div class="space-y-5">
    <div>
      <p class="text-xs font-medium uppercase tracking-wider text-slate-400">Budgeto dashboard</p>
      <h1 class="text-2xl font-bold tracking-tight">
        {{ moisCouvert ? `${moisCouvert} overview` : 'Overview' }}
      </h1>
    </div>

    <div v-if="!cycleActif" class="card p-6 text-center text-sm text-slate-500">
      No active month. Head to the Journal page to start a new month.
    </div>
    <template v-else>
      <DashboardStatTiles />

      <div class="columns-1 lg:columns-2 gap-5 [&>*]:mb-5 [&>*]:break-inside-avoid">
        <DashboardResteGauge />
        <DashboardSpendingPie />
        <DashboardSpendingTrend />
        <DashboardRecentActivity />
        <DashboardProjectPreviewCard />
        <DashboardProjectsOverview />
      </div>
    </template>
  </div>
</template>
