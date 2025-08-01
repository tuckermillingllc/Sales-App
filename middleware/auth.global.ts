// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  // Check if user is authenticated
  const { $fetch } = useNuxtApp()
  
  return $fetch('/api/auth/me')
    .catch(() => {
      // If not authenticated, redirect to login
      return navigateTo('/login')
    })
})