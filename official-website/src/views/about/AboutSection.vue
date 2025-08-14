<script setup lang="ts">
</script>

<template>
    <section class="py-16 sub-padding">
        <header class="text-center mb-12">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ $t('about.title') }}</h1>
        </header>

        <div class="prose prose-lg mx-auto text-gray-600 text-center leading-relaxed mb-12">
            <p>{{ $t('about.content') }}</p>
        </div>

        <!-- 特性卡片 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            <article class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">🎨 {{ $t('services.list')[0] }}</h3>
                <p class="text-gray-600">
                    We focus on clean, modern design that enhances user experience and brand identity.
                </p>
            </article>

            <article class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">⚡ {{ $t('services.list')[1] }}</h3>
                <p class="text-gray-600">
                    Built with Vue 3, TypeScript, and best practices for performance and maintainability.
                </p>
            </article>

            <article class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">📱 {{ $t('services.list')[2] }}</h3>
                <p class="text-gray-600">
                    Fully responsive layouts that work seamlessly on mobile, tablet, and desktop.
                </p>
            </article>

            <article class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3">🚀 {{ $t('services.list')[3] }}</h3>
                <p class="text-gray-600">
                    Optimized for speed, SEO, and Core Web Vitals to ensure top performance.
                </p>
            </article>
        </div>
    </section>
</template>