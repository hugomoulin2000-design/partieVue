<script setup>
import { ref, onMounted } from 'vue'
import { useRankingStore } from '@/stores/classementStore'

const store = useRankingStore()
const tab = ref('flashcards')

onMounted(() => {
  store.fetchAll()
})

function formatTime(seconds) {
  if (!seconds) return "0 min"
  return Math.round(seconds / 60) + " min"
}

function formatDate(date) {
  if (!date) return "Aucune"
  const d = new Date(date)
  if (d.getTime() === 0) return "Aucune"
  return d.toLocaleDateString("fr-FR")
}
</script>

<template>
  <div class="page">
    <h1>Classement</h1>

    <div class="tabs">
      <button @click="tab='flashcards'" :class="{active: tab==='flashcards'}">
        Flashcards
      </button>
      <button @click="tab='decks'" :class="{active: tab==='decks'}">
        Decks
      </button>
      <button @click="tab='time'" :class="{active: tab==='time'}">
        Temps
      </button>
    </div>

    <div v-for="(u, i) in store[tab]" :key="u.id" class="row">
      <div class="pos">#{{ i + 1 }}</div>

      <img :src="u.image_name ? `/uploads/users/${u.image_name}` : '/default_avatar.jpg'" class="avatar"/>


      <div class="info">
        <div class="name">{{ u.username }}</div>

        <div class="details" v-if="tab === 'flashcards'">
          {{ u.flashcards_revised ?? 0 }} cartes révisées
        </div>

        <div class="details" v-if="tab === 'decks'">
          {{ u.decks_revised }} decks révisés
        </div>

        <div class="details" v-if="tab === 'time'">
          {{ formatTime(u.total_seconds) }} de révision
        </div>

        <div class="details">
          Dernière activité : {{ formatDate(u.last_activity) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 650px;
  margin: 40px auto;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid #bcdcff;
  background: #e9f3ff;
  color: #0056a8;
  cursor: pointer;
}


.tabs button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.row {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.pos {
  width: 40px;
  font-weight: bold;
  font-size: 1.2rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.placeholder {
  background: #ccc;
}

.info .name {
  font-weight: bold;
}

.details {
  font-size: 0.9rem;
  color: #666;
}
</style>
