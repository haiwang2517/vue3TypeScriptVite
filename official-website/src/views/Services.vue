<template>
    <div>
        <!-- 头部展示图片和文字说明 -->
        <HeaderSection />

        <!-- 内容展示部分 -->
        <div class="sub-padding">
            <ServicesSection />
        </div>
    </div>
</template>

<script setup>
import HeaderSection from '@/views/services/HeaderSection.vue';
import ServicesSection from '@/views/services/ServicesSection.vue';
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>