<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const saving = ref(false)
const error = ref('')

const passwordMismatch = computed(() => confirmPassword.value.length > 0 && password.value !== confirmPassword.value)

async function submit() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  saving.value = true
  error.value = ''
  try {
    await register({ name: name.value, email: email.value, password: password.value })
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Something went wrong'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="card p-6 space-y-4" @submit.prevent="submit">
    <h1 class="text-lg font-semibold">Create your account</h1>

    <div>
      <label class="block text-sm font-medium mb-1">Name</label>
      <input v-model="name" type="text" required autofocus class="input" autocomplete="name">
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input v-model="email" type="email" required class="input" autocomplete="email">
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <div class="relative">
        <input
          v-model="password" :type="showPassword ? 'text' : 'password'" required minlength="8" class="input pr-10"
          autocomplete="new-password"
        >
        <button
          type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"
        >
          <component :is="showPassword ? EyeOff : Eye" :size="18" />
        </button>
      </div>
      <p class="mt-1 text-xs text-slate-400">At least 8 characters, with letters and numbers.</p>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Confirm password</label>
      <input
        v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" required minlength="8" class="input"
        autocomplete="new-password"
      >
      <p v-if="passwordMismatch" class="mt-1 text-xs text-bad">Passwords do not match.</p>
    </div>

    <p v-if="error" class="text-sm text-bad">{{ error }}</p>

    <button type="submit" class="btn-primary w-full py-2.5" :disabled="saving || passwordMismatch">
      {{ saving ? 'Creating account...' : 'Create account' }}
    </button>

    <p class="text-sm text-center text-slate-500">
      Already have an account?
      <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-medium">Log in</NuxtLink>
    </p>
  </form>
</template>
