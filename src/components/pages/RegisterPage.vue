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
  <div class="login-container">
    <h1>Créer un compte</h1>

    <form @submit.prevent="register">
      <label>Nom d'utilisateur</label>
      <input type="text" v-model="username" required />

      <label>Mot de passe</label>
      <input type="password" v-model="password" required />

      <button type="submit">Créer le compte</button>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
  </div>
</template>

<style scoped>
/* ton CSS inchangé */
.login-container {
  max-width: 420px;
  margin: 80px auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.login-container h1 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 26px;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s;
}

button:hover {
  background: #3a7ac4;
}

.error {
  margin-top: 12px;
  color: #d9534f;
  font-size: 14px;
  text-align: center;
}

.success {
  margin-top: 12px;
  color: #28a745;
  font-size: 14px;
  text-align: center;
}

.register-link {
  display: block;
  margin-top: 12px;
  text-align: center;
  color: #4a90e2;
}
</style>
