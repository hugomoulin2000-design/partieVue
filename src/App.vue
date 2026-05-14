<script setup>
import FooterComponent from './components/ui/FooterComponent.vue';
import HeaderComponent from './components/ui/HeaderComponent.vue';

</script>


<template>
  <div id="layout">
    <header-component />
    <main>
      <router-view />
    </main>
    <footer-component />
  </div>
</template>


