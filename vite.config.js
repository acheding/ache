import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// import externalGlobals from 'rollup-plugin-external-globals'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
    },
  },
  plugins: [vue()],
  server: {
    port: 3333, // 打开的端口号
    open: false, // 运行时打开浏览器
    proxy: {
      '/ache': {
        target: 'https://zhang.beer/',
        // target: "http://localhost:8080/",
        secure: false,
      },
      '/other': {
        target: 'https://zhang.beer/',
        secure: false,
      },
      // "/ip": "https://pv.sohu.com/cityjson?ie=utf-8",
      // "/ip": {
      //   target: "https://pv.sohu.com/cityjson?ie=utf-8",
      // rewrite: (path) => path.replace(/^\/ip/, ""),
      // },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
      // external: ['vue', 'vue-demi', 'element-plus', 'pinia', 'axios', 'vue-router', 'echarts'],
      // plugins: [
      //   externalGlobals({
      //     vue: 'Vue',
      //     'vue-demi': 'VueDemi',
      //     'element-plus': 'ElementPlus',
      //     pinia: 'Pinia',
      //     axios: 'axios',
      //     'vue-router': 'VueRouter',
      //     echarts: 'echarts',
      //   }),
      // ],
    },
  },
})
