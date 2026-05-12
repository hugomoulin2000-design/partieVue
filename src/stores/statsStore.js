import { defineStore } from 'pinia'
import { api } from '@/api'

export const useStatsStore = defineStore('statsStore', {
  state: () => ({
    stats: null
  }),

  actions: {
    async fetchStats() {
      const res = await api("https://projetl2.localhost:8443/api/stats/me")

      if (!res.ok) {
        this.stats = null
        return
      }

      this.stats = await res.json()
    }
  }
})
