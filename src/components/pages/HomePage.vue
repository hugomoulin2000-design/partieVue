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

    <!-- Si connecté -->
    <div v-if="auth.isAuthenticated" class="welcome-box">
      <h1>👋 Bonjour {{ user.username }}</h1>
      <p>Ravi de te revoir ! Prêt à réviser tes flashcards ?</p>
    </div>

    <!-- Si NON connecté -->
    <div v-else class="welcome-box">
      <h1>Bienvenue 👋</h1>
      <p>Connecte-toi ou crée un compte pour accéder à tes flashcards.</p>

      <div class="links">
        <router-link to="/login" class="btn">🔐 Connexion</router-link>
        <router-link to="/register" class="btn">🆕 Créer un compte</router-link>
      </div>
    </div>

    <!-- GRANDES CARTES -->
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

<style scoped>
.home-container {
  max-width: 900px;
  margin: 80px auto;
  padding: 32px;
  text-align: center;
}

.welcome-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

h1 {
  font-size: 32px;
  margin-bottom: 12px;
}

p {
  font-size: 18px;
  margin-bottom: 24px;
  color: #555;
}

.links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 20px;
  background: #4a90e2;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  transition: 0.2s;
}

.btn:hover {
  background: #3a7ac4;
}

/* GRANDES CARTES */
.cards {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 14px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: 0.2s;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.card .icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.card h2 {
  margin: 10px 0 6px;
  font-size: 22px;
}

.card p {
  color: #666;
  font-size: 15px;
}
</style>
