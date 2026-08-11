<script setup lang="ts">
import { Home, BookOpen, PiggyBank, CalendarCheck, Settings, TrendingUp, LogOut, History, Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const { user, logout } = useAuth()
const { isDark, toggle: toggleTheme } = useTheme()

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/income', label: 'Income', icon: TrendingUp },
  { to: '/bills', label: 'Bills', icon: CalendarCheck },
  { to: '/projects', label: 'Projects', icon: PiggyBank }
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <!-- Desktop left sidebar -->
  <nav
    class="hidden sm:flex sm:flex-col fixed left-0 top-0 h-screen w-20 lg:w-56 shrink-0 z-20
      border-r border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900/60 dark:backdrop-blur-xl"
  >
    <div class="flex items-center gap-2 font-semibold text-lg px-4 lg:px-6 py-5 justify-center lg:justify-start">
      <PiggyBank :size="24" class="text-indigo-500 dark:text-accent-violet-dark shrink-0" />
      <span class="hidden lg:inline">Spendito</span>
    </div>
    <div class="flex-1 flex flex-col gap-1 px-2 lg:px-3 mt-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-full text-sm font-medium transition-colors justify-center lg:justify-start"
        :class="isActive(link.to)
          ? 'bg-indigo-600 text-white dark:bg-white/10 dark:text-white dark:border dark:border-accent-violet-dark/60 dark:shadow-glow-violet'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
      >
        <component :is="link.icon" :size="18" class="shrink-0" />
        <span class="hidden lg:inline">{{ link.label }}</span>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-1 px-2 lg:px-3 py-4 border-t border-slate-100 dark:border-white/10">
      <span v-if="user" class="hidden lg:block px-4 pb-2 text-xs text-slate-500 dark:text-slate-400 truncate">{{ user.name }}</span>
      <NuxtLink
        to="/history"
        class="flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-full text-sm font-medium transition-colors justify-center lg:justify-start"
        :class="isActive('/history')
          ? 'bg-indigo-600 text-white dark:bg-white/10 dark:text-white dark:border dark:border-accent-violet-dark/60 dark:shadow-glow-violet'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
      >
        <History :size="18" class="shrink-0" />
        <span class="hidden lg:inline">History</span>
      </NuxtLink>
      <NuxtLink
        to="/settings"
        class="flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-full text-sm font-medium transition-colors justify-center lg:justify-start"
        :class="isActive('/settings')
          ? 'bg-indigo-600 text-white dark:bg-white/10 dark:text-white dark:border dark:border-accent-violet-dark/60 dark:shadow-glow-violet'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
      >
        <Settings :size="18" class="shrink-0" />
        <span class="hidden lg:inline">Settings</span>
      </NuxtLink>
      <button
        class="flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors justify-center lg:justify-start"
        aria-label="Log out"
        @click="handleLogout"
      >
        <LogOut :size="18" class="shrink-0" />
        <span class="hidden lg:inline">Log out</span>
      </button>
    </div>
  </nav>

  <!-- Mobile top bar -->
  <div class="flex sm:hidden items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 dark:bg-slate-900/60 dark:backdrop-blur-xl">
    <div class="flex items-center gap-2 font-semibold">
      <PiggyBank :size="20" class="text-indigo-500 dark:text-accent-violet-dark" />
      Spendito
    </div>
    <div class="flex items-center gap-1">
      <button
        class="p-2 rounded-full text-slate-400 transition-colors"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>
      <NuxtLink
        to="/history"
        class="p-2 rounded-full transition-colors"
        :class="isActive('/history') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
      >
        <History :size="18" />
      </NuxtLink>
      <NuxtLink
        to="/settings"
        class="p-2 rounded-full transition-colors"
        :class="isActive('/settings') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
      >
        <Settings :size="18" />
      </NuxtLink>
      <button class="p-2 rounded-full text-slate-400" aria-label="Log out" @click="handleLogout">
        <LogOut :size="18" />
      </button>
    </div>
  </div>

  <!-- Mobile bottom nav -->
  <nav class="fixed sm:hidden bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-900/80 dark:backdrop-blur-xl border-t border-slate-100 dark:border-white/10 flex items-center justify-around py-2 pb-safe">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium"
      :class="isActive(link.to) ? 'text-indigo-600 dark:text-accent-violet-dark' : 'text-slate-400'"
    >
      <component :is="link.icon" :size="20" />
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
