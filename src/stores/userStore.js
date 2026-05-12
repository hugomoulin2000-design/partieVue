import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null,
    imageName: null,
  }),

  getters: {
    avatarUrl(state) {
      const baseUrl = import.meta.env.VITE_API_URL

      if (state.imageName) {
        return `${baseUrl}/uploads/users/${state.imageName}`
      }

      return '/default_avatar.jpg'
    }
  },

  actions: {
    async fetchUser() {
      const auth = useAuthStore()
      if (!auth.token) return

      const baseUrl = import.meta.env.VITE_API_URL

      const res = await fetch(`${baseUrl}/api/me`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })

      if (!res.ok) return

      const data = await res.json()

      this.username = data.username
      this.imageName = data.imageName
    }
  }
})
