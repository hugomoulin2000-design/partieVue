import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    loadToken() {
      const saved = localStorage.getItem('token')
      if (saved) this.token = saved
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
