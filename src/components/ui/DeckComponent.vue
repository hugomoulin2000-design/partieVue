<template>
  <div class="deck-item-header">
    <h3>{{ deck.titre }}</h3>
    <span class="deck-difficulty">{{ difficultyLabels[deck.difficulte] }}</span>
  </div>
  <p class="deck-description">{{ deck.description }}</p>
  <div class="tags">
    <span v-for="tag in deck.tags" :key="tag.id" class="tag">{{ tag.nom }}</span>
  </div>
</template>

<script setup>
import { difficultyLabels } from '@/utils/difficulty'

defineProps({
  deck: Object
})
</script>
