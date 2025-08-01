<!-- pages/index.vue -->
<template>
  <div style="min-height: 100vh; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    
    <!-- Header -->
    <div style="background-color: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
        <div>
          <h1 style="margin: 0; font-size: 1.875rem; font-weight: 700; color: #111827;">Tucker Sales Portal</h1>
          <p style="margin: 0.25rem 0 0 0; color: #6b7280;">
            {{ selectedSalesperson || 'All Salespeople' }} • {{ dashboardData?.sampleData?.topDealers?.length || 0 }} customers
          </p>
        </div>

        <!-- Salesperson Selector -->
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <select 
            v-model="selectedSalesperson" 
            @change="refreshData"
            style="padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; font-size: 0.875rem; min-width: 180px;"
          >
            <option value="">All Salespeople</option>
            <option v-for="person in salespeople" :key="person" :value="person">
              {{ person }}
            </option>
          </select>
          
          <div style="width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: 700; font-size: 0.875rem;">
              {{ selectedSalesperson?.charAt(0) || 'A' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" style="display: flex; align-items: center; justify-content: center; padding: 3rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 1.5rem; height: 1.5rem; border: 3px solid #3b82f6; border-top: 3px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span style="color: #6b7280; font-size: 1.125rem;">Loading your data...</span>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else style="max-width: 1200px; margin: 0 auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
      
      <!-- Filter Info -->
      <div v-if="selectedSalesperson" style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 0.75rem; padding: 0.75rem;">
        <p style="margin: 0; color: #1e40af; font-size: 0.875rem;">
          📊 Showing customers for: <strong>{{ selectedSalesperson }}</strong>
        </p>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
        <!-- My Customers -->
        <div style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; background: #dbeafe; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 1.5rem; height: 1.5rem; color: #2563eb;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 700; color: #111827; margin: 0;">{{ totalCustomers || 0 }}</div>
              <div style="font-size: 0.875rem; color: #6b7280; margin: 0;">{{ selectedSalesperson ? 'My Customers' : 'All Customers' }}</div>
            </div>
          </div>
        </div>

        <!-- Need Follow-up -->
        <div style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 3rem; height: 3rem; background: #fee2e2; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 1.5rem; height: 1.5rem; color: #dc2626;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <div style="font-size: 2rem; font-weight: 700; color: #dc2626; margin: 0;">{{ customersNeedingAttention?.length || 0 }}</div>
              <div style="font-size: 0.875rem; color: #6b7280; margin: 0;">Need Follow-up</div>
            </div>
          </div>
        </div>

        <!-- Total Volume -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 1rem; padding: 1.5rem; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">Total Volume</div>
              <div style="font-size: 2.5rem; font-weight: 700; margin: 0.25rem 0;">{{ formatNumber(totalVolumeYTD) }}</div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">bags total</div>
            </div>
            <div style="width: 3rem; height: 3rem; background: rgba(255,255,255,0.2); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 1.5rem; height: 1.5rem;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- YoY Growth -->
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 1rem; padding: 1.5rem; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">YoY Growth</div>
              <div style="font-size: 2.5rem; font-weight: 700; margin: 0.25rem 0;">{{ avgYoyGrowth }}%</div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.8); margin: 0;">average growth</div>
            </div>
            <div style="width: 3rem; height: 3rem; background: rgba(255,255,255,0.2); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers -->
      <div style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #111827;">Top Customers</h2>
          <button style="color: #3b82f6; font-size: 0.875rem; font-weight: 600; background: none; border: none; cursor: pointer;">View All</button>
        </div>
        
        <div v-if="topCustomers?.length" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div
            v-for="(customer, index) in topCustomers.slice(0, 8)"
            :key="customer.dealer_id"
            style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: #f9fafb; border-radius: 0.75rem; transition: background-color 0.2s;"
            @mouseenter="$event.target.style.backgroundColor = '#f3f4f6'"
            @mouseleave="$event.target.style.backgroundColor = '#f9fafb'"
          >
            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0;">
              <div :style="`width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.875rem; background: ${index < 3 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #6b7280, #4b5563)'};`">
                {{ customer.dealer_name?.charAt(0) || '?' }}
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; color: #111827; font-size: 1rem; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ customer.dealer_name }}
                </div>
                <div style="font-size: 0.875rem; color: #6b7280; margin: 0;">
                  {{ customer.salesperson }} • {{ customer.volume_tier }} Volume
                </div>
              </div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
              <div style="font-weight: 700; color: #111827; font-size: 1rem; margin: 0;">
                {{ formatNumber(customer.total_bags) }}
              </div>
              <div :style="`font-size: 0.875rem; font-weight: 500; margin: 0; ${getGrowthColor(customer.yoy_change_percent_current_month)}`">
                {{ formatPercent(customer.yoy_change_percent_current_month) }}%
              </div>
            </div>
          </div>
        </div>
        
        <div v-else style="text-align: center; padding: 3rem; color: #6b7280;">
          <svg style="width: 3rem; height: 3rem; margin: 0 auto 1rem; opacity: 0.5;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p style="margin: 0;">No customers found{{ selectedSalesperson ? ' for ' + selectedSalesperson : '' }}</p>
        </div>
      </div>

      <!-- Customers Needing Attention -->
      <div v-if="customersNeedingAttention?.length" style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #dc2626;">🚨 Needs Follow-up</h2>
          <div style="padding: 0.25rem 0.75rem; background: #fee2e2; border-radius: 9999px;">
            <span style="font-size: 0.875rem; font-weight: 700; color: #dc2626;">
              {{ customersNeedingAttention.length }}
            </span>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div
            v-for="customer in customersNeedingAttention"
            :key="customer.dealer_id"
            style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.75rem;"
          >
            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0;">
              <div style="width: 0.75rem; height: 0.75rem; background: #dc2626; border-radius: 50%; flex-shrink: 0;"></div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; color: #111827; font-size: 1rem; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ customer.dealer_name }}
                </div>
                <div style="font-size: 0.875rem; color: #dc2626; font-weight: 500; margin: 0;">
                  {{ customer.attention_flag }}
                </div>
                <div style="font-size: 0.75rem; color: #6b7280; margin: 0;">
                  {{ customer.days_since_last_order }} days since last order
                </div>
              </div>
            </div>
            <div style="flex-shrink: 0;">
              <div style="padding: 0.25rem 0.5rem; background: #fee2e2; border-radius: 0.375rem;">
                <span style="font-size: 0.75rem; font-weight: 600; color: #991b1b; text-transform: uppercase; letter-spacing: 0.05em;">
                  {{ customer.churn_risk }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Animation CSS -->
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value)
}

// State
const selectedSalesperson = ref('')

// Load from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('selectedSalesperson')
  if (saved) selectedSalesperson.value = saved
})

// Fetch with reactive query
const { data: dashboardData, pending, error, refresh } = await useFetch('/api/dashboard-auth', {
  query: computed(() => {
    return selectedSalesperson.value ? { salesperson: selectedSalesperson.value } : {}
  })
})

// Store selection in localStorage and refresh when it changes
watch(selectedSalesperson, (newVal) => {
  localStorage.setItem('selectedSalesperson', newVal)
  refresh()
})

// Computed dashboard data
const salespeople = computed(() => dashboardData.value?.sampleData?.allSalespeople || [])
const topCustomers = computed(() => dashboardData.value?.sampleData?.topDealers || [])
const customersNeedingAttention = computed(() => dashboardData.value?.sampleData?.customersNeedingAttention || [])
const totalCustomers = computed(() => dashboardData.value?.debug?.totalCustomers || 0)
const totalVolumeYTD = computed(() => dashboardData.value?.sampleData?.totalVolumeYTD || 0)

const avgYoyGrowth = computed(() => {
  const customers = topCustomers.value.filter(c => c.yoy_change_percent_current_month !== null)
  if (customers.length === 0) return 0
  const avg = customers.reduce((sum, c) => sum + (c.yoy_change_percent_current_month || 0), 0) / customers.length
  return Math.round(avg * 10) / 10
})
</script>



