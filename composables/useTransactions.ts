export function useTransactions() {
  const { refresh } = useCycle()

  async function ajouterTransaction(payload: {
    montant: number
    type: string
    categorie: string
    note?: string
    date?: string
    cycleId: string
  }) {
    await $fetch('/api/transactions', { method: 'POST', body: payload })
    await refresh()
  }

  async function modifierTransaction(id: string, payload: Record<string, any>) {
    await $fetch(`/api/transactions/${id}`, { method: 'PATCH', body: payload })
    await refresh()
  }

  async function supprimerTransaction(id: string) {
    await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { ajouterTransaction, modifierTransaction, supprimerTransaction }
}
