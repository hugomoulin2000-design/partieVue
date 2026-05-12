import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: null,
    imageName: null,
  }),

  getters: {
    avatarUrl(state) {
      if (state.imageName) {
        return `https://projetl2.localhost:8443/uploads/users/${state.imageName}`
      }
      return '/default_avatar.jpg'
    }
  },

  actions: {
    async fetchUser() {
      const auth = useAuthStore()
      if (!auth.token) return

      const res = await fetch('https://projetl2.localhost:8443/api/me', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })

      if (!res.ok) {
        return
      }

      const data = await res.json()

      this.username = data.username
      this.imageName = data.imageName
    }
  }
})
