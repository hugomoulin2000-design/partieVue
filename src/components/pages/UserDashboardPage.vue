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

  const res = await fetch('https://backend-flashcardulr.onrender.com/api/user/upload', {
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
  const res = await fetch('https://backend-flashcardulr.onrender.com/api/user/delete-image', {
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
  <div class="page">
    <div class="page-title-wrap">
      <div class="page-title">
        <h1>Mon Compte</h1>
      </div>
    </div>
    
    <div class="profile-card">
      <div class="profile-avatar-wrap">
        <img :src="imageUrl" alt="Photo de profil" class="profile-avatar" />
      </div>

      <div class="profile-info">
        <p class="profile-username">{{ user.username }}</p>
      </div>

      <div class="profile-actions">
        <label class="btn-outline profile-upload">
          Changer la photo
          <input type="file" @change="uploadImage" style="display:none" />
        </label>

        <button class="danger" @click="deleteImage">
          Supprimer la photo
        </button>
      </div>
    </div>

    <div class="profile-logout">
      <button class="btn-outline" @click="logout">
        Déconnexion
      </button>
    </div>
  </div>
</template>
