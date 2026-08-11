const STORAGE_KEY = 'spendito-theme'
// Key used before the app was renamed — read once so an existing preference
// survives the rename instead of silently falling back to the OS setting.
const LEGACY_STORAGE_KEY = 'budgeto-theme'

const isDark = ref(false)

function applyTheme() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark.value)
}

export function useTheme() {
  const init = () => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (stored) {
      isDark.value = stored === 'dark'
      window.localStorage.setItem(STORAGE_KEY, stored)
      window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const toggle = () => {
    isDark.value = !isDark.value
    window.localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { isDark, init, toggle }
}
