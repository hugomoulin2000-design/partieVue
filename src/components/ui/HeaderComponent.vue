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

