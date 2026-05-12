<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'

const auth = useAuthStore()
const user = useUserStore()

auth.loadToken()

if (auth.isAuthenticated) {
  user.fetchUser()
}
</script>

<template>
  <header class="header">
    <div class="header-content">

      <nav class="left-links">
        <router-link to="/">Accueil</router-link>
        <router-link to="/decks">Tous les decks</router-link>
        <router-link to="/tags">Decks par Tags</router-link>
        <router-link to="/mesdecks">Mes Decks</router-link>
        <router-link to="/decks/creer">Créer un deck</router-link>

      </nav>

      <nav v-if="!auth.isAuthenticated">
        <router-link to="/login">Connexion</router-link>
      </nav>

      <nav v-else class="right-links">

        <router-link to="/classement">Classements</router-link>
        <router-link to="/stats">Statistiques</router-link>


        <router-link to="/profil" class="avatar-link">
          <img :src="user.avatarUrl" class="avatar" />
        </router-link>
      </nav>

    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 0.9rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 90%;
  margin: 0 auto;
}

.left-links {
  display: flex;
  gap: 32px;
}

.left-links a,
.right-links a {
  font-size: 18px;
  font-weight: 500;
  color: #1a1a1a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.left-links a:hover,
.right-links a:hover {
  color: #3b82f6;
}

.right-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}


</style>
