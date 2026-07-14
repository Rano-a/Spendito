<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

const { categories, refresh, ajouterCategorie } = useCategories()
const { user, updateName, changePassword } = useAuth()

const nouvelleCategorie = ref('')
const saving = ref(false)
const error = ref('')

onMounted(refresh)

async function ajouter() {
  if (!nouvelleCategorie.value.trim()) return
  saving.value = true
  error.value = ''
  try {
    await ajouterCategorie(nouvelleCategorie.value.trim())
    nouvelleCategorie.value = ''
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    saving.value = false
  }
}

const name = ref(user.value?.name || '')
const savingName = ref(false)
const nameError = ref('')
const nameSaved = ref(false)

async function saveName() {
  if (!name.value.trim()) return
  savingName.value = true
  nameError.value = ''
  nameSaved.value = false
  try {
    await updateName(name.value.trim())
    nameSaved.value = true
    setTimeout(() => (nameSaved.value = false), 2000)
  } catch (e: any) {
    nameError.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    savingName.value = false
  }
}

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)
const passwordError = ref('')
const passwordSaved = ref(false)

const peutChangerMdp = computed(() =>
  !!currentPassword.value && newPassword.value.length >= 8 && newPassword.value === confirmPassword.value
)

async function savePassword() {
  if (!peutChangerMdp.value) return
  savingPassword.value = true
  passwordError.value = ''
  passwordSaved.value = false
  try {
    await changePassword({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordSaved.value = true
    setTimeout(() => (passwordSaved.value = false), 2000)
  } catch (e: any) {
    passwordError.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <div class="card p-5">
      <h2 class="font-semibold">Settings</h2>
      <p class="text-sm text-slate-400">Manage your account and the categories used for your expenses.</p>
    </div>

    <div class="card p-5 space-y-3">
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">Account</h3>
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <div class="flex items-center gap-2">
          <input v-model="name" type="text" class="input" @keyup.enter="saveName">
          <button class="btn-secondary px-4 py-2 shrink-0" :disabled="!name.trim() || savingName" @click="saveName">
            {{ savingName ? 'Saving...' : 'Save' }}
          </button>
        </div>
        <p v-if="nameSaved" class="text-xs text-good mt-1">Name updated.</p>
        <p v-if="nameError" class="text-xs text-bad mt-1">{{ nameError }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <p class="text-sm text-slate-400">{{ user?.email }}</p>
      </div>
    </div>

    <div class="card p-5 space-y-3">
      <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">Password</h3>
      <div>
        <label class="block text-sm font-medium mb-1">Current password</label>
        <input v-model="currentPassword" type="password" autocomplete="current-password" class="input">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">New password</label>
        <input v-model="newPassword" type="password" autocomplete="new-password" minlength="8" class="input">
        <p class="mt-1 text-xs text-slate-400">At least 8 characters, with letters and numbers.</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Confirm new password</label>
        <input v-model="confirmPassword" type="password" autocomplete="new-password" class="input" @keyup.enter="savePassword">
        <p v-if="confirmPassword && newPassword !== confirmPassword" class="text-xs text-bad mt-1">Passwords don't match.</p>
      </div>
      <button class="btn-primary w-full py-2.5" :disabled="!peutChangerMdp || savingPassword" @click="savePassword">
        {{ savingPassword ? 'Updating...' : 'Update password' }}
      </button>
      <p v-if="passwordSaved" class="text-xs text-good">Password updated.</p>
      <p v-if="passwordError" class="text-xs text-bad">{{ passwordError }}</p>
    </div>

    <div class="card overflow-hidden">
      <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">Categories</h3>
      </div>

      <div class="flex items-center gap-2 py-3 px-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <input
          v-model="nouvelleCategorie"
          type="text"
          placeholder="New category"
          class="input py-1.5 flex-1"
          @keyup.enter="ajouter"
        >
        <button class="btn-primary px-3 py-1.5 flex items-center gap-1" :disabled="!nouvelleCategorie.trim() || saving" @click="ajouter">
          <Plus :size="16" />
          Add
        </button>
      </div>
      <p v-if="error" class="text-xs text-bad px-4 pt-2">{{ error }}</p>

      <div v-if="!categories.length" class="p-6 text-center text-sm text-slate-400">
        No categories.
      </div>
      <ParametresCategorieItem v-for="c in categories" :key="c._id" :categorie="c" />
    </div>
  </div>
</template>
