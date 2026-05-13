import { defineStore } from 'pinia'
import { api } from '@/api'

export const useDeckStore = defineStore('deckStore', {
  state: () => ({
    decks: [],
    deck: null
  }),

  actions: {
    async fetchDecks() {
      const response = await api("https://backend-flashcardulr.onrender.com/api/decks", {
        method: "GET"
      })

      if (!response.ok) {
        this.decks = []
        return
      }

      this.decks = await response.json()
    },

    async fetchDeck(id) {
      const response = await api(`https://backend-flashcardulr.onrender.com/api/decks/${id}`, {
        method: "GET"
      })

      if (!response.ok) {
        this.deck = null
        return
      }

      this.deck = await response.json()
      return this.deck
    },

    async fetchMyDecks() {
      const response = await api("https://backend-flashcardulr.onrender.com/api/my-decks", {
        method: "GET"
      })

      if (!response.ok) {
        this.decks = []
        return []
      }

      this.decks = await response.json()
      return this.decks
    },

    async createDeck(payload) {
      const response = await api("https://backend-flashcardulr.onrender.com/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) return null
      return await response.json()
    },

    async deleteDeck(id) {
      const response = await api(`https://backend-flashcardulr.onrender.com/api/decks/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        this.decks = this.decks.filter(d => d.id !== id)
      }

      return response.ok
    },

    async updateDeck(id, payload) {
      const response = await api(`https://backend-flashcardulr.onrender.com/api/decks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      return response.ok
    }
  }
})
