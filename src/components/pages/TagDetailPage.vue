<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '../../stores/tagStore'
import DeckComponent from '../ui/DeckComponent.vue'
document.title = "Decks du tag"

const route = useRoute()
const tagStore = useTagStore()

const decks = ref([])
const tag = ref()
onMounted(async () => {
  tag.value = await tagStore.fetchTag(route.params.id)
  decks.value = await tagStore.fetchDecksForTag(route.params.id)
})
</script>

<template>
  <div class="container">
    <div class="page-title" style="margin-bottom: 25px;">
      <h1>Liste des decks — <span style="color: var(--color-blue)">{{ tag?.nom }}</span></h1>
    </div>
    <div class="decks-grid">
      <router-link
        v-for="deck in decks"
        :key="deck.id"
        :to="`/decks/${deck.id}`"
        class="deck-item"
      >
        <DeckComponent :deck="deck" />
      </router-link>
    </div>
  </div>
</template>
