import { useAuthStore } from '@/stores/authStore'

export async function api(url, options = {}) {
  const auth = useAuthStore()


  if (!auth.token) {
    auth.loadToken()
  }

  const headers = options.headers || {}

  if (auth.token) {
    headers['Authorization'] = 'Bearer ' + auth.token
  }

  return fetch(url, { ...options, headers })
}
