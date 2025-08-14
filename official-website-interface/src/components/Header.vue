<!-- Header.vue -->
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { router } from '@/router'
import type { RouteRecordName } from 'vue-router'
import { i18n } from '@/i18n'
import { useLangStore } from '@/stores/lang' // ✅ 新增：导入 langStore

const mobileMenuOpen = ref(false)
const t = i18n.global.t
const langStore = useLangStore() // ✅ 使用语言状态

// 当前语言标签
const currentLangLabel = computed(() => {
    return langStore.isEnglish ? 'EN' : '中文'
})

// 语言选项
const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
] as const

const toggleMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

const routes = computed(() => {
    return router.getRoutes().filter(r => r.name)
})

const getNavText = (name: RouteRecordName | undefined) => {
    if (!name) return ''
    const nameStr = typeof name === 'string' ? name : String(name)
    return t(`nav.${nameStr.toLowerCase()}`)
}
// 新增：控制语言菜单是否打开
const isLangMenuOpen = ref(false)
onMounted(() => {
    const handler = () => {
        isLangMenuOpen.value = false
    }

    // 点击非语言菜单区域时关闭
    document.addEventListener('click', (e) => {
        const langEl = (e.target as HTMLElement).closest('.lang-switcher')
        if (!langEl) {
            isLangMenuOpen.value = false
        }
    })
})
</script>

<template>
    <header class="px-4 bg-white shadow-sm sticky top-0 z-50">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="text-xl font-bold text-blue-600">Brand</div>

            <!-- 导航菜单 -->
            <nav class="hidden md:flex space-x-8">
                <router-link v-for="route in routes" :key="route.name" :to="route.path"
                    class="text-gray-700 hover:text-blue-600 pr-1 font-medium transition"
                    active-class="text-blue-600 font-semibold" exact-active-class="text-blue-700 font-bold"
                    @click="mobileMenuOpen = false">
                    {{ getNavText(route.name) }}
                </router-link>
            </nav>

            <!-- 🔤 语言切换 + 菜单按钮 -->
            <div class="flex items-center space-x-4">

                <!-- 语言切换 - 悬停下拉 -->
                <div class="hidden md:flex relative" @mouseenter="isLangMenuOpen = true">
                    <!-- 悬停按钮 -->
                    <div
                        class="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition">
                        <span>🌐 {{ currentLangLabel }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-gray-500 transition-transform duration-200"
                            :class="{ 'rotate-180': isLangMenuOpen }" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <!-- 下拉菜单 -->
                    <div v-show="isLangMenuOpen"
                        class="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg transition-all duration-200 ease-in-out">
                        <ul class="py-1">
                            <li v-for="lang in languages" :key="lang.code"
                                @click="langStore.changeLang(lang.code); isLangMenuOpen = false"
                                class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition">
                                <span class="text-lg">{{ lang.flag }}</span>
                                <span>{{ lang.label }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 菜单按钮（移动端） -->
                <button @click="toggleMenu" class="md:hidden p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- 移动端菜单 -->
        <div v-show="mobileMenuOpen" class="md:hidden bg-white border-t">
            <router-link v-for="route in routes" :key="route.name" :to="route.path"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="mobileMenuOpen = false">
                {{ getNavText(route.name) }}
            </router-link>

            <!-- 🔤 移动端语言切换（点击展开） -->
            <div class="px-4 py-2">
                <details class="group">
                    <summary
                        class="cursor-pointer list-none flex items-center justify-between text-gray-700 hover:text-blue-600">
                        {{ currentLangLabel }}
                        <svg class="w-4 h-4 ml-1 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <ul class="mt-2 space-y-1">
                        <li v-for="lang in languages" :key="lang.code"
                            @click="langStore.changeLang(lang.code); mobileMenuOpen = false"
                            class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded cursor-pointer"
                            :class="{ 'bg-blue-50 text-blue-600 font-medium': langStore.currentLang === lang.code }">
                            <span class="text-lg">{{ lang.flag }}</span>
                            <span>{{ lang.label }}</span>
                        </li>
                    </ul>
                </details>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* 确保下拉菜单在悬停时可交互 */
.group:hover .group-menu {
    pointer-events: auto;
}
</style>