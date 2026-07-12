const isDark = ref(false)

function applyTheme() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark.value)
}

export function useTheme() {
  const init = () => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('budgeto-theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const toggle = () => {
    isDark.value = !isDark.value
    window.localStorage.setItem('budgeto-theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { isDark, init, toggle }
}
