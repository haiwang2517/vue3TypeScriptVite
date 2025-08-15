import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 * !!! 全局配置 -> preferences\src\config.ts
 */
export const overridesPreferences = defineOverridesPreferences({
  app: {
    // 应用名称
    name: import.meta.env.VITE_APP_TITLE,
    // 水印
    watermark: true,
    // 隐藏设置按钮
    preferencesButtonPosition: 'hide',
  },
  footer: {
    enable: true,
  },
  copyright: {
    companyName: 'MeCompanyName',
    companySiteLink: '#',
    date: '2026',
    enable: true,
    icp: '',
    icpLink: '',
    settingShow: true,
  },
  theme: {
    mode: 'light',
  },
});
