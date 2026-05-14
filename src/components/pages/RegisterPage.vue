<script setup>
import { ref } from 'vue'
import { api } from '@/api'
import { useRouter } from 'vue-router'
document.title = "Inscription"

const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const router = useRouter()

async function register() {
  error.value = ''
  success.value = ''

  const baseUrl = import.meta.env.VITE_API_URL

  const res = await api(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })

  if (!res.ok) {
    error.value = "Impossible de créer le compte"
    return
  }

  success.value = "Compte créé avec succès"
  setTimeout(() => router.push('/login'), 1200)
}
</script>
<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Créer un compte</h1>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" v-model="username" required />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>

        <button type="submit">Créer le compte</button>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>
    </div>
  </div>
</template>
