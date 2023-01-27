<script setup>
import { RouterLink, RouterView } from "vue-router"
import Navigation from "./components/Navigation.vue"
</script>

<template>
  <main class="min-h-screen p-dekstop text-white">
    <RouterView />

    <Navigation />
  </main>
</template>
