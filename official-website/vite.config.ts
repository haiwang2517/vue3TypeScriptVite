import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('micro-') // 可选：支持微前端
        }
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭 sourcemap
    minify: 'terser', // 使用 terser 进行更深度压缩
    terserOptions: {
      compress: {
        drop_console: true, // 删除所有 console.log
        drop_debugger: true
      },
      // 可选：格式化
      format: {
        comments: false // 去除注释
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'vue-i18n'],
          tailwind: ['tailwindcss']
        }
      }
    }
  },

  server: {
    port: 5173,
    open: true
  },

  preview: {
    port: 4173
  }
})