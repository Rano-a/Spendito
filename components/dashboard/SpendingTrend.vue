<script setup lang="ts">
const { transactions, cycleActif, joursTotal, joursEcoules, enveloppeVariable, enveloppeVariablePrevu } = useCycle()

const W = 280
const H = 110
const PAD = 4

const serie = computed(() => {
  if (!cycleActif.value) return []
  const debut = new Date(cycleActif.value.dateDebut)
  debut.setHours(0, 0, 0, 0)
  const total = joursTotal.value
  const parJour = new Array(total + 1).fill(0)
  for (const t of transactions.value) {
    if (t.type !== 'depense_variable') continue
    const d = new Date(t.date)
    d.setHours(0, 0, 0, 0)
    const idx = Math.round((d.getTime() - debut.getTime()) / 86400000)
    if (idx >= 0 && idx <= total) parJour[idx] += t.montant
  }
  let cumul = 0
  const jusquaAujourdhui = Math.min(joursEcoules.value, total)
  return parJour.slice(0, jusquaAujourdhui + 1).map((v, i) => {
    cumul += v
    return { jour: i, cumul }
  })
})

const maxY = computed(() => Math.max(enveloppeVariable.value, enveloppeVariablePrevu.value, serie.value.at(-1)?.cumul || 0, 1))

function xFor(jour: number) {
  return PAD + (jour / Math.max(1, joursTotal.value)) * (W - PAD * 2)
}
function yFor(valeur: number) {
  return H - PAD - (valeur / maxY.value) * (H - PAD * 2)
}

const lignePoints = computed(() =>
  serie.value.map(p => `${xFor(p.jour)},${yFor(p.cumul)}`).join(' ')
)

const aireChemin = computed(() => {
  if (!serie.value.length) return ''
  const derniereX = xFor(serie.value.at(-1)!.jour)
  return `M${xFor(0)},${H - PAD} L${lignePoints.value.replace(/ /g, ' L')} L${derniereX},${H - PAD} Z`
})

const paceLine = computed(() => {
  const x1 = xFor(0)
  const y1 = yFor(0)
  const x2 = xFor(joursTotal.value)
  const y2 = yFor(enveloppeVariable.value)
  return { x1, y1, x2, y2 }
})

const paceLinePrevu = computed(() => {
  const x1 = xFor(0)
  const y1 = yFor(0)
  const x2 = xFor(joursTotal.value)
  const y2 = yFor(enveloppeVariablePrevu.value)
  return { x1, y1, x2, y2 }
})

const afficherPrevu = computed(() => enveloppeVariablePrevu.value !== enveloppeVariable.value)

function formatMontant(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>

<template>
  <div class="card p-6">
    <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Spending pace</h3>
    <p class="text-xs text-slate-400 mb-4">Cumulative expenses vs. budget pace</p>

    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full h-28">
      <line :x1="PAD" :y1="H - PAD" :x2="W - PAD" :y2="H - PAD" class="stroke-slate-200 dark:stroke-slate-700" stroke-width="1" />
      <line
        :x1="paceLine.x1" :y1="paceLine.y1" :x2="paceLine.x2" :y2="paceLine.y2"
        class="stroke-slate-300 dark:stroke-slate-600" stroke-width="2" stroke-dasharray="4 4"
      />
      <line
        v-if="afficherPrevu"
        :x1="paceLinePrevu.x1" :y1="paceLinePrevu.y1" :x2="paceLinePrevu.x2" :y2="paceLinePrevu.y2"
        class="stroke-[#9085e9] dark:stroke-[#7c6ee0]" stroke-width="2" stroke-dasharray="1 3"
      />
      <path v-if="serie.length" :d="aireChemin" class="fill-[#2a78d6] dark:fill-[#3987e5]" opacity="0.1" />
      <polyline
        v-if="serie.length"
        :points="lignePoints"
        fill="none" class="stroke-[#2a78d6] dark:stroke-[#3987e5]" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
      />
      <circle
        v-if="serie.length"
        :cx="xFor(serie.at(-1)!.jour)" :cy="yFor(serie.at(-1)!.cumul)" r="3"
        class="fill-[#2a78d6] dark:fill-[#3987e5]"
      />
    </svg>

    <div class="flex items-center justify-between mt-2 text-xs text-slate-400">
      <span class="flex items-center gap-3">
        <span class="flex items-center gap-1.5">
          <span class="inline-block w-3 h-0.5 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" />
          Actual
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block w-3 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          Budget pace
        </span>
        <span v-if="afficherPrevu" class="flex items-center gap-1.5">
          <span class="inline-block w-3 h-0.5 rounded-full bg-[#9085e9] dark:bg-[#7c6ee0]" />
          Forecast pace
        </span>
      </span>
      <span>{{ formatMontant(enveloppeVariable) }} € envelope</span>
    </div>
  </div>
</template>
