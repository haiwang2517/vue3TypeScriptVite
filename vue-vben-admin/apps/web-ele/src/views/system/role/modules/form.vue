<script lang="ts" setup>
// import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenDrawer, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

// // 🔄 替换为 Element Plus 组件
// import { Node } from 'element-plus';
import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { createRole, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.SystemRole>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

// // 🔄 Element Plus 的 Tree 节点格式
type MetaType = 'button' | 'menu' | 'route';
interface ElTreeNode {
  id: number | string;
  label: string;
  icon?: string;
  children?: ElTreeNode[];
  meta?: {
    icon?: string;
    title: string;
    type?: MetaType;
  };
}

const permissions = ref<ElTreeNode[]>([]);
const loadingPermissions = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateRole(id.value, values) : createRole(values))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        setTimeout(() => {
          formApi.setValues(data);
        }, 300);
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        loadPermissions();
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as ElTreeNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', [$t('system.role.name')])
    : $t('common.create', [$t('system.role.name')]);
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <!-- 🔄 使用 v-loading 替代 Spin -->
        <div
          v-loading="loadingPermissions"
          class="w-full"
          style="min-height: 200px"
        >
          <!-- 🔄 使用 ElTree -->
          <VbenTree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </VbenTree>
        </div>
      </template>
    </Form>
  </Drawer>
</template>

<style lang="css" scoped>
/* 自定义 Tree 节点样式 */
:deep(.el-tree-node__content) {
  padding: 4px 0;
}

:deep(.el-tree-node__content:hover .tree-actions) {
  display: flex;
}

/* 按钮类节点样式 */
:deep(.inline-flex) {
  display: inline-flex !important;
}

:deep(.pl-0) {
  padding-left: 0 !important;
}
</style>
