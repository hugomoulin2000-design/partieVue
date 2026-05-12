<script setup>
import FooterComponent from './components/ui/FooterComponent.vue';
import HeaderComponent from './components/ui/HeaderComponent.vue';

</script>

vue
<template>
  <div id="layout">
    <header-component />
    <main>
      <router-view />
    </main>
    <footer-component />
  </div>
</template>


<style>
#layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
