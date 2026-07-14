<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const saving = ref(false)
const error = ref('')

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await login({ email: email.value, password: password.value })
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
    <h1 class="text-lg font-semibold">Log in</h1>

    <div>
      <label class="block text-sm font-medium mb-1">Email</label>
      <input v-model="email" type="email" required autofocus class="input" autocomplete="email">
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Password</label>
      <div class="relative">
        <input
          v-model="password" :type="showPassword ? 'text' : 'password'" required class="input pr-10"
          autocomplete="current-password"
        >
        <button
          type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"
        >
          <component :is="showPassword ? EyeOff : Eye" :size="18" />
        </button>
      </div>
    </div>

    <p v-if="error" class="text-sm text-bad">{{ error }}</p>

    <button type="submit" class="btn-primary w-full py-2.5" :disabled="saving">
      {{ saving ? 'Logging in...' : 'Log in' }}
    </button>

    <p class="text-sm text-center text-slate-500">
      No account yet?
      <NuxtLink to="/register" class="text-indigo-600 dark:text-indigo-400 font-medium">Create one</NuxtLink>
    </p>
  </form>
</template>
