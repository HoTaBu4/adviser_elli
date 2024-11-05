<script lang="ts" setup>
import Header from "../CommonComponents/Header/Header.vue";
import eventBus from '../../eventBus'
import { onMounted } from 'vue'
console.log(eventBus)

onMounted(() => {
  eventBus.emit("add-message", { text: "Your message", duration: 5 });
});
</script>

<template>
  <Header />
  <main class="main">
    <div class="main__container">
      <div class="main__image">
        <img src="/pictures/images/main_girl.png" alt="" class="main__image" />
      </div>
      <RouterView />
    </div>
  </main>
</template>

<style>
@import "./MainStyle.scss";
</style>
