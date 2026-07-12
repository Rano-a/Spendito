<script setup lang="ts">
import { Pencil, Trash2, Check, X } from 'lucide-vue-next'
import type { CategorieData } from '~/composables/useCategories'

const props = defineProps<{ categorie: CategorieData }>()

const { modifierCategorie, supprimerCategorie } = useCategories()

const editing = ref(false)
const nom = ref(props.categorie.nom)
const saving = ref(false)
const removing = ref(false)
const error = ref('')

function startEdit() {
  nom.value = props.categorie.nom
  error.value = ''
  editing.value = true
}

async function saveEdit() {
  if (!nom.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    await modifierCategorie(props.categorie._id, nom.value.trim())
    editing.value = false
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    saving.value = false
  }
}

async function remove() {
  removing.value = true
  try {
    await supprimerCategorie(props.categorie._id)
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <div class="py-2.5 px-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div class="flex items-center justify-between gap-3">
      <template v-if="!editing">
        <p class="font-medium truncate">{{ categorie.nom }}</p>
        <div class="flex items-center gap-1 shrink-0">
          <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="startEdit">
            <Pencil :size="15" />
          </button>
          <button
            class="p-1.5 rounded-full hover:bg-bad-bg dark:hover:bg-bad/10 text-slate-400 hover:text-bad"
            :disabled="removing"
            @click="remove"
          >
            <Trash2 :size="15" />
          </button>
        </div>
      </template>
      <template v-else>
        <input v-model="nom" type="text" class="input py-1.5 flex-1" @keyup.enter="saveEdit">
        <div class="flex items-center gap-1 shrink-0">
          <button class="p-1.5 rounded-full hover:bg-good-bg text-good" :disabled="saving" @click="saveEdit">
            <Check :size="16" />
          </button>
          <button class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400" @click="editing = false">
            <X :size="16" />
          </button>
        </div>
      </template>
    </div>
    <p v-if="error" class="text-xs text-bad mt-1">{{ error }}</p>
  </div>
</template>
