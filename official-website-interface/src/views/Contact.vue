<template>
    <div>
        <!-- 头部展示图片和文字说明 -->
        <HeaderSection />

        <!-- 内容展示部分 -->
        <div class="sub-padding">
            <ContentSection />
        </div>
    </div>
</template>

<script setup>
import HeaderSection from '@/views/contact/HeaderSection.vue';
import ContentSection from '@/views/contact/ContentSection.vue';
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>