<script setup>
import { onMounted } from 'vue'
import { useDeckStore } from '../../stores/deckStore'
import DeckComponent from '../ui/DeckComponent.vue'
import { difficultyLabels } from '@/utils/difficulty'
document.title = "Les decks"

const deckStore = useDeckStore()

onMounted(() => {
  deckStore.fetchDecks()
})
</script>

<template>
  <div class="container">
    <h1>Liste des decks</h1>

    <router-link
      v-for="deck in deckStore.decks"
      :key="deck.id"
      :to="`/decks/${deck.id}`"
      class="deck-card"
    >
      <DeckComponent :deck="deck" />

      <p class="difficulty">
        Difficulté : {{ difficultyLabels[deck.difficulte] }}
      </p>

      <div class="tags">
        <span
          v-for="tag in deck.tags"
          :key="tag.id"
          class="tag"
        >
          {{ tag.nom }}
        </span>
      </div>
    </router-link>
  </div>
</template>
