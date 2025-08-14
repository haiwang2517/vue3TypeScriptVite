import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// 定义合法语言类型
type Lang = 'en' | 'zh'

// 类型守卫：检查是否为合法语言
const isValidLang = (lang: string): lang is Lang => {
  return ['en', 'zh'].includes(lang)
}

export const useLangStore = defineStore('lang', () => {
  const { locale } = useI18n()

  // 从 localStorage 读取
  const savedLang = localStorage.getItem('lang')

  // 安全地解析语言：如果不是 en/zh，使用默认 'en'
  const currentLang = ref<Lang>('en')

  if (savedLang && isValidLang(savedLang)) {
    locale.value = savedLang
    currentLang.value = savedLang
  } else {
    // 如果没有保存的语言或非法值，使用默认
    locale.value = 'en'
    currentLang.value = 'en'
  }

  // 切换语言
  const changeLang = (lang: Lang) => {
    locale.value = lang
    currentLang.value = lang
    localStorage.setItem('lang', lang)
  }

  const isEnglish = computed(() => currentLang.value === 'en')
  const isChinese = computed(() => currentLang.value === 'zh')

  return {
    currentLang,
    isEnglish,
    isChinese,
    changeLang
  }
})