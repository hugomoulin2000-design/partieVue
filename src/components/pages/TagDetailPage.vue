<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTagStore } from '../../stores/tagStore'
import DeckComponent from '../ui/DeckComponent.vue'
document.title = "Decks du tag"

const route = useRoute()
const tagStore = useTagStore()

const decks = ref([])

onMounted(async () => {

  decks.value = await tagStore.fetchDecksForTag(route.params.id)
})
</script>


<template>
  <div class="container">
    <h1>Liste des decks</h1>



  <router-link v-for="deck in decks" :key="deck.id" :to="`/decks/${deck.id}`" class="deck-card">

    <DeckComponent :deck="deck" />

  </router-link>
  </div>

</template>
