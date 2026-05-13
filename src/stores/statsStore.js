import { defineStore } from 'pinia'
import { api } from '@/api'

export const useStatsStore = defineStore('statsStore', {
  state: () => ({
    stats: null
  }),

  actions: {
    async fetchStats() {
      const res = await api("https://backend-flashcardulr.onrender.com/api/stats/me")

      if (!res.ok) {
        this.stats = null
        return
      }

      this.stats = await res.json()
    }
  }
})
