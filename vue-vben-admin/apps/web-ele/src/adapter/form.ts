import type {
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

async function initSetupVbenForm() {
  setupVbenForm<ComponentType>({
    config: {
      // ✅ Element Plus 的 v-model 默认绑定的是 modelValue
      baseModelPropName: 'modelValue',

      // ✅ 映射特殊组件的 v-model 绑定属性
      modelPropNameMap: {
        // Checkbox, Radio, Switch 在 Element Plus 中也是 v-model 绑定 modelValue
        // 但某些封装可能用 checked，建议统一为 modelValue
        Checkbox: 'modelValue',
        Radio: 'modelValue',
        Switch: 'modelValue',
        // Upload 组件：v-model 绑定 file-list，但通常使用 modelValue
        Upload: 'modelValue',
        // 其他常见组件
        Input: 'modelValue',
        InputNumber: 'modelValue',
        Select: 'modelValue',
        DatePicker: 'modelValue',
        TimePicker: 'modelValue',
        Cascader: 'modelValue',
      },
    },
    defineRules: {
      required: (value, _params, ctx) => {
        if (value === undefined || value === null || value === '') {
          return $t('ui.formRules.required', [ctx.label]);
        }
        if (Array.isArray(value) && value.length === 0) {
          return $t('ui.formRules.required', [ctx.label]);
        }
        if (typeof value === 'string' && value.trim() === '') {
          return $t('ui.formRules.required', [ctx.label]);
        }
        return true;
      },
      selectRequired: (value, _params, ctx) => {
        if (value === undefined || value === null) {
          return $t('ui.formRules.selectRequired', [ctx.label]);
        }
        if (Array.isArray(value) && value.length === 0) {
          return $t('ui.formRules.selectRequired', [ctx.label]);
        }
        return true;
      },
    },
  });
}

const useVbenForm = useForm<ComponentType>;

export { initSetupVbenForm, useVbenForm, z };
export type VbenFormSchema = FormSchema<ComponentType>;
export type { VbenFormProps };
