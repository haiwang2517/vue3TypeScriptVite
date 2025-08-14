<!-- src/App.vue -->
<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <!-- 外层：全宽（可用于背景色） -->
  <div class="min-h-screen bg-gray-50">
    <Header />
    <!-- 内层：固定最大宽度，居中 class="px-1 sm:px-6 lg:px-8" -->
    <div>
      <main>
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>