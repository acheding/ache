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
        secure: false,
      },
      "/ache": {
        target: "http://101.42.230.165:8080/",
        // target: "http://localhost:8080/",
        secure: false,
      },
      "/chp": {
        target: "https://api.shadiao.pro/",
        secure: false,
      },
      "/pyq": {
        target: "https://api.shadiao.pro/",
        secure: false,
      },
      "/du": {
        target: "https://api.shadiao.pro/",
        secure: false,
      },
      "/translate": {
        target: "https://fanyi-api.baidu.com/api/trans/vip",
        secure: false,
      },
      // "/ip": "https://pv.sohu.com/cityjson?ie=utf-8",
      // "/ip": {
      //   target: "https://pv.sohu.com/cityjson?ie=utf-8",
      // rewrite: (path) => path.replace(/^\/ip/, ""),
      // },
    },
  },
});
