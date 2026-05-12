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
