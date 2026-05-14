<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDeckStore } from '../../stores/deckStore'
import TagComponent from '../ui/TagComponent.vue'
document.title = "Détail du deck"

const route = useRoute()
const deckStore = useDeckStore()

onMounted(() => {
  deckStore.fetchDeck(route.params.id)
})
</script>

<template>
<div class="container deck-detail" v-if="deckStore.deck">
<div class="page-title">
  <h1>{{ deckStore.deck.titre }}</h1>
</div>
  <p class="description">{{ deckStore.deck.description }}</p>

  <p class="count">
    Cartes : <strong>{{ deckStore.deck.flashcards_count }}</strong>
  </p>

  <p>
    Créé le :
    {{new Date(deckStore.deck.cree_le).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'})}} par {{ deckStore.deck.username }}
  </p>





  <router-link :to="`/decks/${deckStore.deck.id}/revision`" class="btn-primary">
    Réviser ce deck
  </router-link>

  <div v-if="!deckStore.deck.tags || deckStore.deck.tags.length === 0" class="no-tags">
    Aucun tag
  </div>

  <div class="tags-row">
    <router-link
      v-for="tag in deckStore.deck.tags"
      :key="tag.id"
      :to="`/tags/${tag.id}`"
    >
      <TagComponent :tag="tag" />
    </router-link>
  </div>

</div>
</template>
