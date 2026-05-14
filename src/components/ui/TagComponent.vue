<script setup>
defineProps({
  tag: Object
})
</script>

<template>
  <div class="tag-card">{{ tag.nom }}</div>
</template>

