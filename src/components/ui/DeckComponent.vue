<template>
  <div >

    <h3>{{ deck.titre }}</h3>
    <p>{{ deck.description }}</p>
    <p>Difficulé : {{ deck.difficulte }}</p>

  </div>

</template>

<script setup>

defineProps({
  deck: Object
})

</script>
