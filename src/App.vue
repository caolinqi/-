<template>
  <a-layout class="app-layout">
    <Navbar />
    <a-layout-content class="app-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </a-layout-content>
    <Footer />
  </a-layout>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
  background: var(--bg-secondary);

  .app-content {
    min-height: calc(100vh - 64px - 80px);
  }


}

// 全局过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
