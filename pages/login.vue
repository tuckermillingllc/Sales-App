<!-- pages/login.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-sm w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tucker Milling</h1>
        <p class="text-gray-500 mt-2">Sales Portal</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <form @submit.prevent="login">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Name or Email
              </label>
              <input
                v-model="credentials.email"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                v-model="credentials.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>

            <div v-if="error" class="text-red-600 text-sm text-center">
              {{ error }}
            </div>
          </div>
        </form>

        <!-- Temp Credentials for Testing -->
        <div class="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p><strong>For testing:</strong></p>
          <p>Use any salesperson name from your data + password "tucker2025"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials.value
    })

    // Redirect to dashboard
    await navigateTo('/')
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>