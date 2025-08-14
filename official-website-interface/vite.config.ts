import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 根据当前环境加载对应的 .env 文件
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
    open: true,
    proxy: {
      '/api': {
        target: env.VITE_APP_API_BASE_URL, // 后端地址
        changeOrigin: true, // 修改 Origin 头为 target 的 origin
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去掉 /api 前缀
      },
    },
  },

  preview: {
    port: 4173
  }
}})
