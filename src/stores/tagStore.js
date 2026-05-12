import { defineStore } from 'pinia'
import { api } from '@/api'

export const useTagStore = defineStore('tagStore', {
  state: () => ({
    tags: [],
    tagDetails: {},
    decksByTag: {}
  }),

  actions: {
    async fetchTags() {
      const res = await api('https://projetl2.localhost:8443/api/tags')
      if (!res.ok) {
        this.tags = []
        return
      }
      this.tags = await res.json()
      return this.tags
    },

    async fetchTag(id) {
      if (this.tagDetails[id]) {
        return this.tagDetails[id]
      }
      const res = await api(`https://projetl2.localhost:8443/api/tags/${id}`)
      if (!res.ok) {
        this.tagDetails[id] = null
        return null
      }
      const data = await res.json()
      this.tagDetails[id] = data
      return data
    },

    async fetchDecksForTag(id) {
      if (this.decksByTag[id]) {
        return this.decksByTag[id]
      }
      const res = await api(`https://projetl2.localhost:8443/api/tags/${id}/decks`)
      if (!res.ok) {
        this.decksByTag[id] = []
        return []
      }
      const data = await res.json()
      this.decksByTag[id] = data
      return data
    },

    async createTag(nom) {
      const res = await api('https://projetl2.localhost:8443/api/tags', {
        method: 'POST',
        body: JSON.stringify({ nom }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la création du tag')
      }

      const data = await res.json()
      const newTag = data.tag
      this.tags.push(newTag)
      return newTag
    }
  }
})
