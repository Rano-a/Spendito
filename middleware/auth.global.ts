const publicPaths = new Set(['/login', '/register'])

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { user, checked, fetchUser } = useAuth()

  if (!checked.value) {
    await fetchUser()
  }

  const isPublic = publicPaths.has(to.path)

  if (!user.value && !isPublic) {
    return navigateTo('/login')
  }
  if (user.value && isPublic) {
    return navigateTo('/')
  }
})
