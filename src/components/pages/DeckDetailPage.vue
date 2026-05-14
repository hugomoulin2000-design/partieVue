<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDeckStore } from '../../stores/deckStore'
import { useFlashcardStore } from '../../stores/flashcardStore'
import TagComponent from '../ui/TagComponent.vue'
document.title = "Détail du deck"

const route = useRoute()
const deckStore = useDeckStore()
const flashcardStore = useFlashcardStore()
const flashcards = ref([])

onMounted(async () => {
  await deckStore.fetchDeck(route.params.id)
  const all = await flashcardStore.fetchFlashcards(route.params.id)
  flashcards.value = all.slice(0, 4)
})
</script>

<template>
  <div class="container deck-detail" v-if="deckStore.deck">

    <div class="page-title" style="margin-bottom: 25px;">
      <h1>{{ deckStore.deck.titre }}</h1>
    </div>

    <div class="deck-info-block">
      <div class="deck-info-left">
        <p class="description">{{ deckStore.deck.description }}</p>
        <p class="count">{{ deckStore.deck.flashcards_count }} cartes</p>
        <p class="deck-meta">Créé le
          {{ new Date(deckStore.deck.cree_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          par <strong>{{ deckStore.deck.username }}</strong>
        </p>
        <div class="tags-row">
          <router-link v-for="tag in deckStore.deck.tags" :key="tag.id" :to="`/tags/${tag.id}`">
            <TagComponent :tag="tag" />
          </router-link>
          <span v-if="!deckStore.deck.tags || deckStore.deck.tags.length === 0" class="no-tags">Aucun tag</span>
        </div>
      </div>

      <router-link :to="`/decks/${deckStore.deck.id}/revision`" class="btn-primary deck-revise-btn">
        Réviser ce deck
      </router-link>
    </div>

    <div v-if="flashcards.length > 0" class="flashcards-preview">
      <h2>Aperçu des cartes</h2>
      <div class="flashcards-preview-grid">
        <div v-for="card in flashcards" :key="card.id" class="flashcard-preview-card">
          <p>{{ card.question }}</p>
        </div>
      </div>
    </div>

  </div>
</template>
