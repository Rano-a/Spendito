export interface CategorieData {
  _id: string
  nom: string
  parDefaut: boolean
}

const categories = ref<CategorieData[]>([])
const loading = ref(false)

export function useCategories() {
  async function refresh() {
    loading.value = true
    try {
      categories.value = await $fetch<CategorieData[]>('/api/categories')
    } finally {
      loading.value = false
    }
  }

  async function ajouterCategorie(nom: string) {
    await $fetch('/api/categories', { method: 'POST', body: { nom } })
    await refresh()
  }

  async function modifierCategorie(id: string, nom: string) {
    await $fetch(`/api/categories/${id}`, { method: 'PATCH', body: { nom } })
    await refresh()
  }

  async function supprimerCategorie(id: string) {
    await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { categories, loading, refresh, ajouterCategorie, modifierCategorie, supprimerCategorie }
}
