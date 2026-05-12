<script setup>
import { onMounted } from 'vue'
import { useStatsStore } from '@/stores/statsStore'
document.title = "Dashboard"

const statsStore = useStatsStore()

function formatLastActivity(date) {
  if (!date || date === "1970-01-01T00:00:00+00:00") {
    return "Aucune"
  }

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

onMounted(() => {
  statsStore.fetchStats()
})
</script>

<template>
  <div class="dashboard" v-if="statsStore.stats">

    <h1>Mes Statistiques</h1>

    <div class="stats-grid">

      <div class="stat">
        <h3>Decks révisés</h3>
        <p>{{ statsStore.stats.decks_revised }}</p>
      </div>

      <div class="stat">
        <h3>Flashcards révisées</h3>
        <p>{{ statsStore.stats.flashcards_revised }}</p>
      </div>

      <div class="stat">
        <h3>Temps total</h3>
        <p>{{ statsStore.stats.total_minutes }} min</p>
      </div>

      <div class="stat">
        <h3>Streak</h3>
        <p>{{ statsStore.stats.streak }} jours </p>
      </div>

      <div class="stat">
        <h3>Dernière activité</h3>
        <p>

             {{ formatLastActivity(statsStore.stats.last_activity) }}

        </p>
      </div>

    </div>

  </div>
</template>

<style scoped>
.dashboard {
  max-width: 700px;
  margin: 40px auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}
</style>
