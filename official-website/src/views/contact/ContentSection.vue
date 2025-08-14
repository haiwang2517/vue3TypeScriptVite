<template>
    <section class="py-16">
        <header class="text-center mb-12">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ $t('contact.title') }}</h1>
            <p class="mt-4 text-lg text-gray-600">{{ $t('contact.message') }}</p>
        </header>

        <!-- 联系信息卡片 -->
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">📧 {{ $t('contact.email') }}</h2>
            <p class="text-gray-600 mb-6">We usually respond within 1-2 business days.</p>

            <!-- 表单 -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Name Field -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="name">Name</label>
                    <input v-model="formData.name" id="name" type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name" />
                    <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
                </div>

                <!-- Email Field -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="email">Email</label>
                    <input v-model="formData.email" id="email" type="email"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com" />
                    <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
                </div>

                <!-- Message Field -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="message">Message</label>
                    <textarea v-model="formData.message" id="message" rows="5"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your project..."></textarea>
                    <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>
                </div>

                <!-- Submit Button -->
                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow transition">
                    Send Message
                </button>
            </form>
        </div>

        <!-- 小提示 -->
        <div class="text-center text-gray-500 text-sm">
            <p>We care about your data. Read our <a href="#" class="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 初始化表单数据
const formData = ref({
    name: '',
    email: '',
    message: ''
});

// 错误信息
const errors = ref({
    name: '',
    email: '',
    message: ''
});

// 邮箱正则表达式
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 表单提交处理函数
const handleSubmit = () => {
    // 清除错误信息
    errors.value = {};

    let isValid = true;

    // 验证邮箱格式
    if (!emailPattern.test(formData.value.email)) {
        errors.value.email = t('contact.error.invalidEmail');
        isValid = false;
    }

    // 检查是否所有字段都有内容
    if (formData.value.name.trim() === '') {
        errors.value.name = t('contact.error.emptyName');
        isValid = false;
    }
    if (formData.value.email.trim() === '') {
        errors.value.email = t('contact.error.emptyEmail');
        isValid = false;
    }
    if (formData.value.message.trim() === '') {
        errors.value.message = t('contact.error.emptyMessage');
        isValid = false;
    }

    if (isValid) {
        // 在这里处理表单提交逻辑
        console.log('Form submitted:', formData.value);
        alert('Form submitted successfully!');
        // 例如：发送请求到服务器等
    }
};
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>