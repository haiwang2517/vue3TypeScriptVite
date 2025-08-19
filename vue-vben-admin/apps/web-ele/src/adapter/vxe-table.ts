import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { Recordable } from '@vben/types';

import type { ComponentType } from './component';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import {
  setupVbenVxeTable,
  useVbenVxeGrid as useGrid,
} from '@vben/plugins/vxe-table';
import { get, isFunction, isString } from '@vben/utils';

import { ElButton, ElImage, ElPopconfirm, ElSwitch, ElTag } from 'element-plus';

import { $t } from '#/locales';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        formConfig: {
          enabled: false, // 禁用内置表单
        },
        minHeight: 180,
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: '',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 清理热更新时残留的 Cell 渲染器
    vxeUI.renderer.forEach((_item, key) => {
      if (key.startsWith('Cell')) {
        vxeUI.renderer.delete(key);
      }
    });

    // === CellImage 渲染器 ===
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        const src = get(row, column.field);
        return h(ElImage, {
          src,
          fit: 'cover',
          style: { width: '40px', height: '40px', borderRadius: '4px' },
          previewSrcList: [src],
        });
      },
    });

    // === CellLink 渲染器 ===
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const content = renderOpts.props?.content || ''; // ✅ 改为 content
        return h(
          ElButton,
          {
            size: 'small',
            type: 'primary',
            link: true,
          },
          { default: () => content },
        );
      },
    });

    // === CellTag 渲染器 ===
    vxeUI.renderer.add('CellTag', {
      renderTableDefault({ options, props }, { column, row }) {
        const value = get(row, column.field);
        const tagOptions = options ?? [
          { type: 'success', label: $t('common.enabled'), value: 1 },
          { type: 'danger', label: $t('common.disabled'), value: 0 },
        ];
        const tagItem = tagOptions.find((item) => item.value === value);
        const { label, ...tagProps } = tagItem || {};

        return h(
          ElTag,
          {
            ...props,
            ...tagProps,
            disableTransitions: true,
          },
          { default: () => label ?? String(value) },
        );
      },
    });

    // === CellSwitch 渲染器 ===
    vxeUI.renderer.add('CellSwitch', {
      renderTableDefault({ attrs }, { column, row }) {
        const loadingKey = `__loading_${column.field}`;
        const currentValue = get(row, column.field);
        const finalProps = {
          activeText: $t('common.enabled'),
          activeValue: 1,
          inactiveText: $t('common.disabled'),
          inactiveValue: 0,
          inlinePrompt: true,
          modelValue: currentValue,
          loading: row[loadingKey] ?? false,
          'onUpdate:modelValue': async (newVal: boolean | number) => {
            const beforeChange = attrs?.beforeChange;
            if (beforeChange && typeof beforeChange === 'function') {
              const result = await beforeChange(newVal, row);
              if (result === false) return;
            }
            row[loadingKey] = true;
            try {
              row[column.field] = newVal;
            } finally {
              row[loadingKey] = false;
            }
          },
        };
        return h(ElSwitch, finalProps as Record<string, any>);
      },
    });

    // === CellOperation 渲染器 ===
    vxeUI.renderer.add('CellOperation', {
      renderTableDefault({ attrs, options, props }, { column, row }) {
        const alignMap = {
          left: 'start',
          center: 'center',
          right: 'end',
          default: 'end',
        } as const;

        type AlignKey = keyof typeof alignMap;

        function getAlign(align?: null | string): string {
          const key = align as AlignKey;
          return alignMap[key] ?? alignMap.default;
        }

        // 使用
        const justifyContent = getAlign(column.align);

        const defaultBtnProps = {
          size: 'small',
          type: 'primary',
          link: true,
          ...props,
        };

        const presets: Recordable<Recordable<any>> = {
          edit: {
            content: $t('common.edit'),
            icon: 'ep:edit',
          },
          delete: {
            content: $t('common.delete'),
            type: 'danger',
            icon: 'ep:delete',
          },
        };

        const operations: Array<Recordable<any>> = (
          options || ['edit', 'delete']
        )
          .map((opt) => {
            return isString(opt)
              ? {
                  code: opt,
                  ...presets[opt],
                  ...defaultBtnProps,
                }
              : {
                  ...defaultBtnProps,
                  ...presets[opt.code],
                  ...opt,
                };
          })
          .map((opt) => {
            const processed: Recordable<any> = {};
            Object.keys(opt).forEach((key) => {
              processed[key] = isFunction(opt[key]) ? opt[key](row) : opt[key];
            });
            return processed;
          })
          .filter((opt) => opt.show !== false);

        function renderButton(opt: Recordable<any>, listen = true) {
          const { content, text, icon, ...buttonProps } = opt; // ✅ 剔除 text

          return h(
            ElButton,
            {
              ...buttonProps,
              onClick: listen
                ? () => attrs?.onClick?.({ code: opt.code, row })
                : undefined,
            },
            {
              default: () => [
                icon ? h(IconifyIcon, { icon, class: 'mr-1' }) : null,
                content || text || '', // ✅ 兼容
              ],
            },
          );
        }

        function renderConfirm(opt: Recordable<any>) {
          return h(
            ElPopconfirm,
            {
              confirmButtonText: $t('common.confirm'),
              cancelButtonText: $t('common.cancel'),
              icon: h(IconifyIcon, {
                icon: 'ep:warning',
                class: 'text-orange-500',
              }),
              title: $t('ui.actionTitle.delete', [attrs?.nameTitle || '']),
              onConfirm: () => {
                attrs?.onClick?.({
                  code: opt.code,
                  row,
                });
              },
              getPopupContainer: (
                trigger: HTMLElement,
              ): HTMLElement | ShadowRoot => {
                const wrapper = trigger.closest<HTMLElement>(
                  '.vxe-table--viewport-wrapper',
                );
                return wrapper || document.body;
              },
            },
            {
              reference: () => renderButton({ ...opt }, false),
              default: () =>
                h(
                  'span',
                  { class: 'truncate text-sm' },
                  $t('ui.actionMessage.deleteConfirm', [
                    get(row, attrs?.nameField || 'name'),
                  ]),
                ),
            },
          );
        }

        const buttons = operations.map((opt) =>
          opt.code === 'delete' ? renderConfirm(opt) : renderButton(opt),
        );

        return h(
          'div',
          {
            class: 'flex gap-2',
            style: { justifyContent },
          },
          buttons,
        );
      },
    });
  },
  useVbenForm,
});

// 导出类型和工具
export const useVbenVxeGrid = <T extends Record<string, any>>(
  ...rest: Parameters<typeof useGrid<T, ComponentType>>
) => useGrid<T, ComponentType>(...rest);

export type OnActionClickParams<T = Recordable<any>> = {
  code: string;
  row: T;
};

export type OnActionClickFn<T = Recordable<any>> = (
  params: OnActionClickParams<T>,
) => void;

// 重新导出 vxe-table 相关类型
export * from '@vben/plugins/vxe-table';
