import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 自动注入 $t 等
  locale: 'en',
  messages: { en, zh }
})
