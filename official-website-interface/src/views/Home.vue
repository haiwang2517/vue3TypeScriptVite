<script setup lang="ts">
</script>

<template>
    <section class="py-16 sub-padding">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h1 class="text-3xl lg:text-5xl font-bold text-gray-900" v-html="$t('hero.title')"></h1>
                <p class="mt-6 text-lg text-gray-600">{{ $t('hero.desc') }}</p>
                <div class="mt-8 flex flex-wrap gap-4">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                        {{ $t('hero.getStarted') }}
                    </button>
                </div>
            </div>
            <div class="bg-blue-50 rounded-2xl h-60 flex items-center justify-center">
                <span class="text-blue-600 font-semibold">Hero Image</span>
            </div>
        </div>
    </section>
</template>