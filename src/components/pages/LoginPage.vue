<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
document.title = "Connexion"

const username = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()
const user = useUserStore()
const router = useRouter()

async function submit() {
  error.value = ''

  const api = import.meta.env.VITE_API_URL

  const response = await fetch(`${api}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })

  if (!response.ok) {
    error.value = 'Identifiants incorrects'
    return
  }

  const data = await response.json()

  auth.setToken(data.token)
  await user.fetchUser()
  router.push('/profil')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Connexion</h1>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" v-model="username" required />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>

        <button type="submit">Se connecter</button>

        <p v-if="error !== ''" class="error">{{ error }}</p>
      </form>

      <router-link to="/register" class="auth-link">
        Pas de compte ? Créez-en un
      </router-link>
    </div>
  </div>
</template>
