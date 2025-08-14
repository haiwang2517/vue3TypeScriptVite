<!-- Footer.vue -->
<script setup lang="ts">
// 无需导入 langStore
</script>

<template>
    <footer class="px-4 bg-gray-50 py-8 border-t">
        <div class="text-center text-gray-600 text-sm">
            &copy; 2025 Your Brand. {{ $t('footer.rights') }}<br class="md:hidden" />
            <span class="hidden md:inline">|</span> {{ $t('footer.links') }}
        </div>
    </footer>
</template>