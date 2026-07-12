<script setup lang="ts">
import { Home, BookOpen, PiggyBank, CalendarCheck, Settings, TrendingUp, LogOut } from 'lucide-vue-next'

const route = useRoute()
const { user, logout } = useAuth()

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
  <!-- Desktop top nav -->
  <nav class="hidden sm:flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
    <div class="flex items-center gap-2 font-semibold text-lg">
      <PiggyBank :size="22" class="text-indigo-500" />
      Budgeto
    </div>
    <div class="flex items-center gap-1">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="isActive(link.to) ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <component :is="link.icon" :size="16" />
        {{ link.label }}
      </NuxtLink>
    </div>
    <div class="flex items-center gap-2">
      <span v-if="user" class="text-sm text-slate-500 dark:text-slate-400 hidden md:inline">{{ user.name }}</span>
      <NuxtLink
        to="/settings"
        class="p-2 rounded-full transition-colors"
        :class="isActive('/settings') ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
      >
        <Settings :size="18" />
      </NuxtLink>
      <button
        class="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Log out"
        @click="handleLogout"
      >
        <LogOut :size="18" />
      </button>
      <LayoutThemeToggle />
    </div>
  </nav>

  <!-- Mobile top bar -->
  <div class="flex sm:hidden items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
    <div class="flex items-center gap-2 font-semibold">
      <PiggyBank :size="20" class="text-indigo-500" />
      Budgeto
    </div>
    <div class="flex items-center gap-1">
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
      <LayoutThemeToggle />
    </div>
  </div>

  <!-- Mobile bottom nav -->
  <nav class="fixed sm:hidden bottom-0 inset-x-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around py-2 pb-safe">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="flex flex-col items-center gap-1 px-4 py-1 text-xs font-medium"
      :class="isActive(link.to) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'"
    >
      <component :is="link.icon" :size="20" />
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
