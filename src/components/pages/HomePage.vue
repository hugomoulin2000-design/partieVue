<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
document.title = "Accueil"

const auth = useAuthStore()
const user = useUserStore()

auth.loadToken()

if (auth.isAuthenticated) {
  user.fetchUser()
}
</script>

<template>
  <div class="home-container">

    <div v-if="auth.isAuthenticated" class="welcome-box">
      <h1>👋 Bonjour {{ user.username }}</h1>
      <p>Ravi de te revoir ! Prêt à réviser tes flashcards ?</p>
    </div>

    <div v-else class="welcome-box">
      <h1>Bienvenue 👋</h1>
      <p>Connecte-toi ou crée un compte pour accéder à tes flashcards.</p>

      <div class="links">
        <router-link to="/login" class="btn">🔐 Connexion</router-link>
        <router-link to="/register" class="btn">🆕 Créer un compte</router-link>
      </div>
    </div>

    <div v-if="auth.isAuthenticated" class="cards">

      <router-link to="/mesdecks" class="card">
        <div class="icon">📚</div>
        <h2>Mes decks</h2>
        <p>Gère et révise tes propres decks.</p>
      </router-link>

      <router-link to="/decks" class="card">
        <div class="icon">🔍</div>
        <h2>Explorer</h2>
        <p>Découvre les decks publics.</p>
      </router-link>

      <router-link to="/tags" class="card">
        <div class="icon">🏷️</div>
        <h2>Decks par tags</h2>
        <p>Parcours les decks selon leurs catégories.</p>
      </router-link>

      <router-link to="/classement" class="card">
        <div class="icon">🏆</div>
        <h2>Classement</h2>
        <p>Vois ta position parmi les autres.</p>
      </router-link>

      <router-link to="/stats" class="card">
        <div class="icon">📊</div>
        <h2>Statistiques</h2>
        <p>Analyse ta progression et tes performances.</p>
      </router-link>

      <router-link to="/profil" class="card">
        <div class="icon">👤</div>
        <h2>Profil</h2>
        <p>Modifie tes informations personnelles.</p>
      </router-link>

    </div>

  </div>
</template>

