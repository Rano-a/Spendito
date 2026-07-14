export interface CycleData {
  _id: string
  dateDebut: string
  dateFinPrevue: string
  revenuTotal: number
  statut: 'actif' | 'cloture'
}

export interface TransactionData {
  _id: string
  montant: number
  montantPrevu?: number
  type: 'depense_variable' | 'depense_fixe' | 'epargne' | 'revenu'
  categorie: string
  note: string
  date: string
  paye: boolean
  cycleId: string
}

const cycleActif = ref<CycleData | null>(null)
const historique = ref<CycleData[]>([])
const transactions = ref<TransactionData[]>([])
const loading = ref(false)

export function useCycle() {
  async function refresh() {
    loading.value = true
    try {
      const data = await $fetch<{ actif: CycleData | null, historique: CycleData[] }>('/api/cycles')
      cycleActif.value = data.actif
      historique.value = data.historique

      if (cycleActif.value) {
        transactions.value = await $fetch<TransactionData[]>('/api/transactions', {
          query: { cycleId: cycleActif.value._id }
        })
      } else {
        transactions.value = []
      }
    } finally {
      loading.value = false
    }
  }

  async function demarrerNouveauCycle(payload: { revenuTotal: number, dateDebut: string, dateFinPrevue: string, depensesFixesSelectionnees: any[] }) {
    await $fetch('/api/cycles', { method: 'POST', body: payload })
    await refresh()
  }

  async function modifierCycle(id: string, payload: Record<string, any>) {
    await $fetch(`/api/cycles/${id}`, { method: 'PATCH', body: payload })
    await refresh()
  }

  const joursTotal = computed(() => {
    if (!cycleActif.value) return 0
    const debut = new Date(cycleActif.value.dateDebut).getTime()
    const fin = new Date(cycleActif.value.dateFinPrevue).getTime()
    return Math.max(1, Math.round((fin - debut) / 86400000))
  })

  const joursEcoules = computed(() => {
    if (!cycleActif.value) return 0
    const debut = new Date(cycleActif.value.dateDebut).getTime()
    const now = Date.now()
    return Math.min(joursTotal.value, Math.max(0, Math.round((now - debut) / 86400000)))
  })

  const joursRestants = computed(() => {
    if (!cycleActif.value) return 0
    const fin = new Date(cycleActif.value.dateFinPrevue).getTime()
    const now = Date.now()
    return Math.max(0, Math.ceil((fin - now) / 86400000))
  })

  const positionAiguille = computed(() => {
    if (joursTotal.value === 0) return 0
    return Math.min(1, joursEcoules.value / joursTotal.value)
  })

  const totalRevenu = computed(() => sumByType('revenu'))
  const totalDepensesVariables = computed(() => sumByType('depense_variable'))
  const totalEpargne = computed(() => sumByType('epargne'))

  function sumByType(type: TransactionData['type']) {
    return transactions.value
      .filter(t => t.type === type)
      .reduce((acc, t) => acc + t.montant, 0)
  }

  // Bills are entered as "planned" and only count toward the actual totals once
  // checked off as paid; the planned total counts every bill regardless of paid status.
  const totalDepensesFixes = computed(() => {
    return transactions.value
      .filter(t => t.type === 'depense_fixe' && t.paye)
      .reduce((acc, t) => acc + t.montant, 0)
  })

  // Confirmed bills contribute their actual amount; unpaid ones contribute their planned
  // amount, so this total converges to totalDepensesFixes as bills get checked off.
  const totalDepensesFixesPrevu = computed(() => {
    const nonPayees = transactions.value
      .filter(t => t.type === 'depense_fixe' && !t.paye)
      .reduce((acc, t) => acc + (t.montantPrevu ?? t.montant), 0)
    return totalDepensesFixes.value + nonPayees
  })

  const resteADepenser = computed(() => {
    return totalRevenu.value - totalDepensesFixes.value - totalDepensesVariables.value - totalEpargne.value
  })

  const resteADepenserPrevu = computed(() => {
    return totalRevenu.value - totalDepensesFixesPrevu.value - totalDepensesVariables.value - totalEpargne.value
  })

  const resteParJour = computed(() => {
    const jours = Math.max(1, joursRestants.value)
    return resteADepenser.value / jours
  })

  const enveloppeVariable = computed(() => {
    return Math.max(1, totalRevenu.value - totalDepensesFixes.value - totalEpargne.value)
  })

  const enveloppeVariablePrevu = computed(() => {
    return Math.max(1, totalRevenu.value - totalDepensesFixesPrevu.value - totalEpargne.value)
  })

  const progressionVariable = computed(() => {
    return totalDepensesVariables.value / enveloppeVariable.value
  })

  const moisCouvert = computed(() => {
    if (!cycleActif.value) return null
    // Dates are stored as UTC midnight representing a calendar day chosen by
    // the user (via a plain <input type=date>), not a real instant — bucket
    // by UTC calendar fields so this doesn't shift by a day for users west of
    // UTC (local getFullYear/getMonth/getDate would roll UTC midnight back to
    // the previous local day).
    const debut = new Date(cycleActif.value.dateDebut)
    const fin = new Date(cycleActif.value.dateFinPrevue)
    const joursParMois = new Map<string, number>()
    const curseur = new Date(Date.UTC(debut.getUTCFullYear(), debut.getUTCMonth(), debut.getUTCDate()))
    const finUTC = Date.UTC(fin.getUTCFullYear(), fin.getUTCMonth(), fin.getUTCDate())
    while (curseur.getTime() <= finUTC) {
      const cle = `${curseur.getUTCFullYear()}-${curseur.getUTCMonth()}`
      joursParMois.set(cle, (joursParMois.get(cle) || 0) + 1)
      curseur.setUTCDate(curseur.getUTCDate() + 1)
    }
    let meilleureCle = ''
    let max = -1
    for (const [cle, n] of joursParMois) {
      if (n > max) {
        max = n
        meilleureCle = cle
      }
    }
    const [annee, mois] = meilleureCle.split('-').map(Number)
    return new Date(Date.UTC(annee, mois, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  })

  const ambiance = computed<'vert' | 'orange' | 'rouge'>(() => {
    if (progressionVariable.value > 1) return 'rouge'
    const ecart = progressionVariable.value - positionAiguille.value
    if (ecart <= 0.05) return 'vert'
    if (ecart <= 0.2) return 'orange'
    return 'rouge'
  })

  return {
    cycleActif,
    historique,
    transactions,
    loading,
    refresh,
    demarrerNouveauCycle,
    modifierCycle,
    joursTotal,
    joursEcoules,
    joursRestants,
    positionAiguille,
    totalRevenu,
    totalDepensesFixes,
    totalDepensesVariables,
    totalEpargne,
    totalDepensesFixesPrevu,
    resteADepenser,
    resteADepenserPrevu,
    resteParJour,
    enveloppeVariable,
    enveloppeVariablePrevu,
    progressionVariable,
    ambiance,
    moisCouvert
  }
}
