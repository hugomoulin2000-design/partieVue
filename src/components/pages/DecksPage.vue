<script setup>
import { onMounted } from 'vue'
import { useDeckStore } from '../../stores/deckStore'
import DeckComponent from '../ui/DeckComponent.vue'
document.title = "Les decks"

const deckStore = useDeckStore()

onMounted(() => {
  deckStore.fetchDecks()
})
</script>

<template>
  <div class="container">
    <div class="page-title" style="margin-bottom: 25px;">
      <h1>Liste des decks</h1>
    </div>

    <div class="decks-grid">
  <router-link
    v-for="deck in deckStore.decks"
    :key="deck.id"
    :to="`/decks/${deck.id}`"
    class="deck-item"
  >
    <DeckComponent :deck="deck" />
  </router-link>
  </div>
    </div>

</template>
