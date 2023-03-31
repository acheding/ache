import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src"),
    },
  },
  plugins: [vue()],
  server: {
    port: 3333, // 打开的端口号
    open: true, // 运行时打开浏览器
    proxy: {
      "/api": {
        target: "https://api.lovelive.tools/", //接口的前缀
      },
      "/ache": {
        target: "http://101.42.230.165:8080/",
        // target: "http://localhost:8080/",
      },
      "/chp": {
        target: "https://api.shadiao.pro/",
      },
      "/pyq": {
        target: "https://api.shadiao.pro/",
      },
      "/du": {
        target: "https://api.shadiao.pro/",
      },
      "/translate": {
        target: "https://api.fanyi.baidu.com/api/trans/vip",
      },
      // "/ip": "https://pv.sohu.com/cityjson?ie=utf-8",
      // "/ip": {
      //   target: "https://pv.sohu.com/cityjson?ie=utf-8",
      // rewrite: (path) => path.replace(/^\/ip/, ""),
      // },
    },
  },
});
