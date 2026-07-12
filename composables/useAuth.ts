export interface AuthUser {
  _id: string
  email: string
  name: string
}

const user = ref<AuthUser | null>(null)
const checked = ref(false)
const loading = ref(false)

export function useAuth() {
  async function fetchUser() {
    loading.value = true
    try {
      user.value = await $fetch<AuthUser | null>('/api/auth/me')
    } catch {
      user.value = null
    } finally {
      checked.value = true
      loading.value = false
    }
  }

  async function register(payload: { email: string, password: string, name: string }) {
    user.value = await $fetch<AuthUser>('/api/auth/register', { method: 'POST', body: payload })
    checked.value = true
  }

  async function login(payload: { email: string, password: string }) {
    user.value = await $fetch<AuthUser>('/api/auth/login', { method: 'POST', body: payload })
    checked.value = true
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  async function updateName(name: string) {
    user.value = await $fetch<AuthUser>('/api/auth/me', { method: 'PATCH', body: { name } })
  }

  async function changePassword(payload: { currentPassword: string, newPassword: string }) {
    await $fetch('/api/auth/password', { method: 'POST', body: payload })
  }

  return { user, checked, loading, fetchUser, register, login, logout, updateName, changePassword }
}
