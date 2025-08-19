<script lang="ts" setup>
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

// 🔄 替换为 Element Plus 组件
import { ElScrollbar, ElTree } from 'element-plus';

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

// 🔄 Element Plus 的 Tree 节点格式
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
        formApi.setValues(data);
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
    // 🔁 转换数据结构以适配 ElTree
    permissions.value = res.map((item: any) => ({
      id: item.id,
      label: $t(item.meta?.title || ''),
      icon: item.meta?.icon,
      children: item.children ? convertChildren(item.children) : undefined,
      meta: item.meta,
    }));
  } finally {
    loadingPermissions.value = false;
  }
}

// 递归转换子节点
function convertChildren(children: any[]): ElTreeNode[] {
  return children.map((item) => ({
    id: item.id,
    label: $t(item.meta?.title || ''),
    icon: item.meta?.icon,
    children: item.children ? convertChildren(item.children) : undefined,
    meta: item.meta,
  }));
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', [$t('system.role.name')])
    : $t('common.create', [$t('system.role.name')]);
});

// 自定义节点类（Element Plus 用 class-name）
function getNodeClass(node: { data: ElTreeNode }) {
  const classes: string[] = [];
  if (node.data.meta?.type === 'button') {
    classes.push('inline-flex');
    // 示例逻辑，可按需调整
    // Element Plus 不支持 index，需在数据中添加索引字段
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
          <ElScrollbar max-height="500px">
            <ElTree
              node-key="id"
              :data="permissions"
              :props="{
                label: 'label',
                children: 'children',
                icon: 'icon',
              }"
              :default-expanded-keys="[]"
              :default-expanded-level="2"
              :class-name="getNodeClass"
              v-bind="slotProps"
              highlight-current
              show-checkbox
              :expand-on-click-node="false"
            >
              <!-- 自定义节点内容 -->
              <template #default="{ data }">
                <div class="flex items-center gap-1">
                  <IconifyIcon v-if="data.meta?.icon" :icon="data.meta.icon" />
                  <span>{{ $t(data.meta?.title) }}</span>
                </div>
              </template>
            </ElTree>
          </ElScrollbar>
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
