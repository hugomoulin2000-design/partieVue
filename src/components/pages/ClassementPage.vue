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
    <div class="page-title-wrap">
      <div class="page-title">
        <h1>Classement</h1>
      </div>
    </div>

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

     <img
        :src="u.image_name ? `https://backend-flashcardulr.onrender.com/uploads/users/${u.image_name}` : '/default_avatar.jpg'"
        class="avatar"
        @error="e => e.target.src = '/default_avatar.jpg'"
      />


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
