<script setup lang="ts">
const { init } = useTheme()
const { refresh } = useCycle()
const route = useRoute()

const wide = computed(() => route.path === '/')

onMounted(() => {
  init()
  refresh()
})
</script>

<template>
  <div class="min-h-screen flex flex-col sm:pl-20 lg:pl-56">
    <LayoutAppNav />
    <main
      class="flex-1 w-full mx-auto px-4 py-6 pb-28 sm:pb-10"
      :class="wide ? 'max-w-6xl' : 'max-w-3xl'"
    >
      <slot />
    </main>
    <LayoutThemeToggle />
    <LayoutScrollTopButton />
  </div>
</template>
