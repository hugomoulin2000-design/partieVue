<script setup>
import { useTagStore } from '../../stores/tagStore'
import { computed, onMounted } from 'vue'
import TagComponent from '../ui/TagComponent.vue'
document.title = "Les tags"

const tagStore = useTagStore()


const tags = computed(() => tagStore.tags)

onMounted(() => {
  tagStore.fetchTags()
})
</script>

<template>
  <div class="container">
<div class="page-title">
  <h1>Liste des tags</h1>
</div>

    <div class="tags-grid">
      <router-link
        v-for="tag in tags"
        :key="tag.id"
        :to="`/tags/${tag.id}`"
      >
        <TagComponent :tag="tag" />
      </router-link>
    </div>
  </div>
</template>
