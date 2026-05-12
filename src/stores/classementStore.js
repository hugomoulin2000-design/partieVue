import { defineStore } from 'pinia'
import { api } from '@/api'

export const useRankingStore = defineStore('classement', {
  state: () => ({
    flashcards: [],
    decks: [],
    time: []
  }),

  actions: {
    async fetchAll() {
      const res = await api('https://projetl2.localhost:8443/api/classement')
      if (!res.ok) return

      const data = await res.json()
      this.flashcards = data.flashcards
      this.decks = data.decks
      this.time = data.time
    }
  }
})
