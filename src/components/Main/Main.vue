<script lang="ts" setup>
import Header from "../CommonComponents/Header/Header.vue";
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
