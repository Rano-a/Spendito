export interface ProjetData {
  _id: string
  nom: string
  montantCible: number
  montantActuel: number
  icone: string
  couleur: string
  principal: boolean
}

const projets = ref<ProjetData[]>([])
const loading = ref(false)

export function useProjets() {
  async function refresh() {
    loading.value = true
    try {
      projets.value = await $fetch<ProjetData[]>('/api/projets')
    } finally {
      loading.value = false
    }
  }

  async function creerProjet(payload: Partial<ProjetData>) {
    await $fetch('/api/projets', { method: 'POST', body: payload })
    await refresh()
  }

  async function modifierProjet(id: string, payload: Partial<ProjetData>) {
    await $fetch(`/api/projets/${id}`, { method: 'PATCH', body: payload })
    await refresh()
  }

  async function ajusterMontant(id: string, delta: number) {
    await $fetch(`/api/projets/${id}`, { method: 'PATCH', body: { delta } })
    // The server mirrors the movement as an `epargne` transaction on the active
    // cycle, so the cycle totals are stale until they're refetched too.
    await Promise.all([refresh(), useCycle().refresh()])
  }

  async function supprimerProjet(id: string) {
    await $fetch(`/api/projets/${id}`, { method: 'DELETE' })
    await refresh()
  }

  const projetPrincipal = computed(() => projets.value.find(p => p.principal) || projets.value[0] || null)

  return { projets, loading, refresh, creerProjet, modifierProjet, ajusterMontant, supprimerProjet, projetPrincipal }
}
