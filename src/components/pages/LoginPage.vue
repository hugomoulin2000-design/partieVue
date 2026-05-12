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
  <div class="login-container">
    <h1>Connexion</h1>

    <form @submit.prevent="submit">
      <label>Nom d'utilisateur</label>
      <input type="text" v-model="username" required />

      <label>Mot de passe</label>
      <input type="password" v-model="password" required />

      <button type="submit">Se connecter</button>

      <p v-if="error !== ''" class="error">{{ error }}</p>
    </form>

    <router-link to="/register" class="register-link">
      Pas de compte ? Créez-en un
    </router-link>
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

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
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

.register-link {
  display: block;
  margin-top: 12px;
  text-align: center;
  color: #4a90e2;
}
</style>
