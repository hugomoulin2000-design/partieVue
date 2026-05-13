import { defineStore } from 'pinia'
import { api } from '@/api'

export const useFlashcardStore = defineStore('flashcardStore', {
  state: () => ({
    flashcards: []
  }),

  actions: {
    async fetchFlashcards(deckId) {
      const res = await api(`https://backend-flashcardulr.onrender.com/api/decks/${deckId}/flashcards`)

      if (!res.ok) {
        this.flashcards = []
        return []
      }

      const data = await res.json()
      this.flashcards = data
      return data
    },

    async addFlashcard(deckId, payload) {
      const res = await api(`https://backend-flashcardulr.onrender.com/api/decks/${deckId}/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) return null
      return await res.json()
    },

    async updateFlashcard(id, payload) {
      const res = await api(`https://backend-flashcardulr.onrender.com/api/flashcards/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) return null
      return await res.json()
    },

    async deleteFlashcard(id) {
      const res = await api(`https://backend-flashcardulr.onrender.com/api/flashcards/${id}`, {
        method: "DELETE"
      })

      return res.ok
    }
  }
})
