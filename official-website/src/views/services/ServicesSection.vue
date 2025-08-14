<script setup lang="ts">
import { servicesList } from '@/types/services'
</script>

<template>
    <section class="py-16">
        <header class="text-center mb-12">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ $t('services.title') }}</h1>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(service, index) in servicesList" :key="index"
                class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100 text-center">
                <div class="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span class="text-blue-600 font-bold text-lg">{{ index + 1 }}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ $t(service.titleKey) }}</h3>
                <p class="text-gray-500 text-sm">
                    High-quality delivery with modern tools and best practices.
                </p>
            </div>
        </div>

        <!-- CTA -->
        <div class="mt-16 text-center">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Need a custom solution?</h2>
            <p class="text-gray-600 mb-6">We offer tailored development services for startups and enterprises.</p>
            <router-link to="/contact"
                class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition">
                {{ $t('nav.contact') }} Us
            </router-link>
        </div>
    </section>
</template>