<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
document.title = "Mon profil"

const auth = useAuthStore()
const user = useUserStore()
auth.loadToken()

const router = useRouter()

// afficher l’avatar du userStore
const imageUrl = ref(user.avatarUrl)

async function uploadImage(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert("Fichier trop volumineux (max 2 Mo)")
    return
  }


  const form = new FormData()
  form.append('image', file)

  const res = await fetch('https://projetl2.localhost:8443/api/user/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`
    },
    body: form
  })

  const data = await res.json()

  if (data.imageName) {
    user.imageName = data.imageName
    imageUrl.value = user.avatarUrl
  }
}

async function deleteImage() {
  const res = await fetch('https://projetl2.localhost:8443/api/user/delete-image', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  })

  const data = await res.json()

  if (data.message) {
    user.imageName = null
    imageUrl.value = user.avatarUrl
  }
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <section class="container">
    <h1>Mon profil</h1>

    <div class="profile-section">
      <img :src="imageUrl" alt="Photo de profil" class="avatar" />

      <input type="file" @change="uploadImage" />

      <button class="btn danger" @click="deleteImage">
        Supprimer la photo
      </button>
    </div>

    <button class="btn" @click="logout">
      Déconnexion
    </button>
  </section>
</template>

<style scoped>
.profile-section {
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin-bottom: 10px;
}
</style>
