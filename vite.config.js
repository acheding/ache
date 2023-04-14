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
      "/trash": {
        target: "https://zhang.beer/other/",
        secure: false,
      },
      "/green": {
        target: "https://zhang.beer/other/",
        secure: false,
      },
      "/one": {
        target: "https://zhang.beer/other/", //接口的前缀
        secure: false,
      },
      "/ache": {
        target: "https://zhang.beer/",
        // target: "http://localhost:8080/",
        secure: false,
      },
      "/chp": {
        target: "https:/zhang.beer/other/",
        secure: false,
      },
      "/pyq": {
        target: "https:/zhang.beer/other/",
        secure: false,
      },
      "/du": {
        target: "https:/zhang.beer/other/",
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
