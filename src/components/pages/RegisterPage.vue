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
