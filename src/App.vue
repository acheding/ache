<script setup>
import Menu from "./components/menu/menu.vue";
import Small from "./components/menu/small.vue";
import Page404 from '@/views/404.vue'
import { defineAsyncComponent, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { onBeforeUnmount, ref, onBeforeMount } from "vue";

const route = useRoute();
const store = useStore();

onBeforeMount(() => {
  store.dispatch("user/login"); // 在整个页面加载之前加上headers
  renderResize();
  window.addEventListener("resize", renderResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", renderResize);
});

const smallScreen = ref(false);
let Component = shallowRef('')
let modules = import.meta.glob('/src/views/*.vue')
const getViews = (path) => {
  return modules['/src/views/' + path + '.vue']
}

watch(
  () => route.matched,
  (newValue, oldValue) => {
    if (newValue?.[0]?.meta?.view) {
      if (newValue?.[0]?.meta?.view !== oldValue?.[0]?.meta?.view) {
        if (getViews(newValue[0].meta.view)) {
          Component.value = defineAsyncComponent({
            loader: getViews(newValue[0].meta.view),
          })
        } else {
          Component.value = Page404
        }
      }
    }
    else {
      Component.value = Page404
    }
  },
  {
    immediate: true,
  }
)

const renderResize = () => {
  let width = document.documentElement.clientWidth;
  if (width < 1229) {
    smallScreen.value = true;
    document.getElementsByTagName("body")[0].style.backgroundColor = "#fff";
  } else {
    smallScreen.value = false;
    document.getElementsByTagName("body")[0].style.backgroundColor = "#f5f7f9";
  }
};
const jump = () => window.open('https://beian.miit.gov.cn/')
</script>

<template>
  <el-container :class="[smallScreen ? 'smallContainer' : 'bigContainer']">
    <el-aside v-if="!smallScreen">
      <Menu></Menu>
    </el-aside>
    <el-main>
      <Small v-if="smallScreen"></Small>
      <!-- <router-view :smallScreen="smallScreen"></router-view> -->
      <component v-if="Component" :is="Component" :smallScreen="smallScreen"></component>
    </el-main>
  </el-container>
  <div v-if="!smallScreen" class="record" @click="jump">
    Copyright ©2021 浙ICP备2021040041号</div>
</template>

<style lang="scss">
@import "./style/general.scss";

#app {
  margin-top: 16px;
}

.bigContainer {
  width: 1280px;
  margin: auto;

  .el-aside {
    margin-right: 16px;
  }

  .el-main {
    background: #fff;
    padding: 48px !important;
    min-height: 735px;
  }
}

.smallContainer {
  .el-main {
    margin-top: -16px;
    background: #fff;
    padding: 0;
  }
}

.record {
  color: #aaa;
  font-size: 12px;
  bottom: 0;
  padding: 8px;
  cursor: pointer;
}
</style>
