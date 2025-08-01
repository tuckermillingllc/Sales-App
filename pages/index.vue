<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm px-4 py-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Good morning</h1>
          <p class="text-gray-500">
            {{ dashboardData?.user?.name || 'Sales Rep' }}
            <span v-if="!dashboardData?.isAuthenticated" class="text-orange-500">(Guest Mode)</span>
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button v-if="dashboardData?.isAuthenticated" @click="logout" 
                  class="text-sm text-gray-500 hover:text-gray-700">
            Logout
          </button>
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold">
              {{ dashboardData?.user?.name?.charAt(0) || 'G' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="p-4">
      <div class="animate-pulse">Loading...</div>
    </div>

    <!-- Content -->
    <div v-else class="p-4 space-y-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="text-2xl font-bold text-gray-900">{{ topCustomers?.length || 0 }}</div>
          <div class="text-sm text-gray-500">My Customers</div>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <div class="text-2xl font-bold text-red-600">{{ customersNeedingAttention?.length || 0 }}</div>
          <div class="text-sm text-gray-500">Need Follow-up</div>
        </div>
      </div>

      <!-- Volume Card -->
      <div class="bg-green-500 rounded-xl p-6 text-white">
        <div class="text-3xl font-bold">{{ formatNumber(totalBags) }}</div>
        <div class="text-green-100">Total Volume</div>
      </div>

      <!-- Growth Card -->
      <div class="bg-purple-500 rounded-xl p-6 text-white">
        <div class="text-3xl font-bold">{{ avgYoyGrowth }}%</div>
        <div class="text-purple-100">YoY Growth</div>
      </div>

      <!-- Top Customers -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-bold mb-4">Top Customers</h2>
        <div v-if="topCustomers?.length" class="space-y-3">
          <div v-for="customer in topCustomers.slice(0, 5)" :key="customer.dealer_id" 
               class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div class="font-medium">{{ customer.dealer_name }}</div>
              <div class="text-sm text-gray-500">{{ customer.volumeTier }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold">{{ formatNumber(customer.total_bags) }}</div>
              <div class="text-sm" :class="getGrowthColor(customer.yoyChangePercentCurrentMonth)">
                {{ formatPercent(customer.yoyChangePercentCurrentMonth) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Needing Attention -->
      <div v-if="customersNeedingAttention?.length" class="bg-white rounded-xl p-4 shadow-sm">
        <h2 class="text-lg font-bold mb-4 text-red-600">Needs Follow-up</h2>
        <div class="space-y-3">
          <div v-for="customer in customersNeedingAttention" :key="customer.dealer_id"
               class="p-3 bg-red-50 rounded-lg border border-red-200">
            <div class="font-medium">{{ customer.dealer_name }}</div>
            <div class="text-sm text-red-600">{{ customer.attentionFlag }}</div>
            <div class="text-xs text-gray-500">{{ customer.daysSinceLastOrder }} days ago</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div class="grid grid-cols-5 py-2">
        <button class="flex flex-col items-center py-2 text-blue-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="text-xs">Home</span>
        </button>
        <button class="flex flex-col items-center py-2 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="text-xs">Customers</span>
        </button>
        <button class="flex flex-col items-center py-2 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span class="text-xs">Products</span>
        </button>
        <button class="flex flex-col items-center py-2 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <span class="text-xs">Calculator</span>
        </button>
        <button class="flex flex-col items-center py-2 text-gray-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span class="text-xs">Settings</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Same script as before
const { data: dashboardData, pending, error } = await useFetch('/api/dashboard-auth')

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/login')
}

const topCustomers = computed(() => dashboardData.value?.sampleData?.topDealers || [])
const customersNeedingAttention = computed(() => dashboardData.value?.sampleData?.customersNeedingAttention || [])

const totalBags = computed(() => {
  return topCustomers.value.reduce((sum, customer) => sum + (customer.total_bags || 0), 0)
})

const avgYoyGrowth = computed(() => {
  const customers = topCustomers.value.filter(c => c.yoyChangePercentCurrentMonth !== null)
  if (customers.length === 0) return 0
  const avg = customers.reduce((sum, c) => sum + (c.yoyChangePercentCurrentMonth || 0), 0) / customers.length
  return Math.round(avg * 10) / 10
})

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return new Intl.NumberFormat().format(num || 0)
}

const formatPercent = (num) => {
  if (num === null || num === undefined) return '0'
  return Math.round((num || 0) * 10) / 10
}

const getGrowthColor = (growth) => {
  if (growth > 0) return 'text-green-600'
  if (growth < 0) return 'text-red-600'
  return 'text-gray-600'
}

useHead({
  title: 'Tucker Sales',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})
</script>