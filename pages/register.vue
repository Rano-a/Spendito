<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const saving = ref(false)
const error = ref('')

async function submit() {
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
      <input v-model="password" type="password" required minlength="6" class="input" autocomplete="new-password">
      <p class="mt-1 text-xs text-slate-400">At least 6 characters.</p>
    </div>

    <p v-if="error" class="text-sm text-bad">{{ error }}</p>

    <button type="submit" class="btn-primary w-full py-2.5" :disabled="saving">
      {{ saving ? 'Creating account...' : 'Create account' }}
    </button>

    <p class="text-sm text-center text-slate-500">
      Already have an account?
      <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-medium">Log in</NuxtLink>
    </p>
  </form>
</template>
