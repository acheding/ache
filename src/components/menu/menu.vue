<script setup>
import { onBeforeUnmount, onMounted, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import menu from "../../../menu.json";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import visit from "../../js/visit";
import axios from "axios";
import md5 from "js-md5";

const store = useStore();
const route = useRoute();
const activeIndex = ref();
const isFixed = ref(false);
const showDialog = ref(false);
const params = ref({
  time: "",
  os: "",
  screen: "",
  agent: "",
  timestamp: "",
});
const formInfo = ref({
  user: "",
  pwd: "",
});
const form = ref(null);
const formKey = ref(0);
const rules = reactive({
  user: [
    { required: true, message: "请输入用户", trigger: ["blur", "change"] },
  ],
  pwd: [{ required: true, message: "请输入密码", trigger: ["blur", "change"] }],
});

watch(
  () => route.matched,
  (newValue, oldValue) => {
    activeIndex.value = newValue[newValue.length - 1].path;
    document.title = "Ache | " + newValue[newValue.length - 1].name;
  }
);
onMounted(() => {
  window.addEventListener("scroll", watchScroll, true);
  insertVisit();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", watchScroll, true);
});
const insertVisit = async () => {
  const info = await visit.getVisitInfo();
  params.value.time = info[0];
  params.value.os = info[1];
  params.value.screen = info[2];
  params.value.agent = info[3];
  params.value.timestamp = info[4];
  await axios.post("/ache/visit/insert-visitor", params.value);
};
const watchScroll = () => {
  let scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  let offsetTop = document.querySelector(".nav").offsetTop + 272;
  if (scrollTop >= offsetTop) {
    isFixed.value = true;
  } else {
    isFixed.value = false;
  }
};
const jump = (address) => {
  if (address === "gitee") {
    window.open("https://gitee.com/fadeache");
  } else {
    window.open("https://blog.csdn.net/bDreamer");
  }
};

const resetForm = () => {
  form.value.resetFields();
  formKey.value++;
};
const submitForm = () => {
  form.value.validate((valid, fields) => {
    if (valid) {
      store.dispatch("user/login", formInfo.value).then((rst) => {
        if (rst) {
          ElMessage({
            type: "success",
            message: "登录成功！",
            showClose: true,
            grouping: true,
          });
          showDialog.value = false;
        } else {
          ElMessage({
            type: "error",
            message: "登录失败！请重新登录！",
            showClose: true,
            grouping: true,
          });
        }
      });
    }
  });
};
const exit = () => {
  store.dispatch("user/exit", store.state.user.info).then((rst) => {
    ElMessage({
      type: "info",
      message: rst,
      showClose: true,
      grouping: true,
    });
    resetForm();
  });
  showDialog.value = false;
};
const register = () => {
  form.value.validate(async (valid, fields) => {
    if (valid) {
      let info = formInfo.value.user.split("?");
      ElMessageBox.confirm("确定要注册<" + info[0] + ">用户吗？", "注册提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () => {
        let res = await axios.post("/ache/user/add-user", {
          user: info[0],
          pwd: md5(md5(formInfo.value.pwd) + md5(md5("1424834523"))),
          role: info[1],
          name: info[2],
        });
        if (res) {
          ElMessage({
            type: "success",
            message: "注册成功！",
            showClose: true,
            grouping: true,
          });
        }
      });
    }
  });
};
</script>

<template>
  <div class="brand">
    <div @click="showDialog = true">
      <ICON
        :class="{ logined: store.state.user.info }"
        class="unLogin"
        code="sun"
        :size="32"
      />
    </div>
    <span>轻松点，这一生，就当来旅游</span>
  </div>
  <div class="nav">
    <el-menu :default-active="activeIndex" router>
      <template v-for="item in menu">
        <template v-if="item.children?.length">
          <el-sub-menu :key="item.name" :index="item.router">
            <template #title>
              <ICON :code="item.icon" />
              <span class="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              class="el-menu-item"
              v-for="sub in item.children"
              :key="sub.name"
              :index="item.router + sub.router"
            >
              <ICON :code="item.icon" />
              <span class="title">{{ sub.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            class="el-menu-item"
            :key="item.name"
            :index="item.router"
          >
            <ICON :code="item.icon" />
            {{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
  <div class="info" :class="{ infoFixed: isFixed }">
    <div class="author-vx">
      <img src="https://zhang.beer:9999/ache/beer/menu/vx.png" />
    </div>
    <div class="author-name">
      <strong>zhang</strong>
    </div>
    <div class="links">
      <div @click="jump('gitee')">
        <img src="https://zhang.beer:9999/ache/beer/menu/gitee.png" />
        <span>Gitee</span>
      </div>
      <div @click="jump('csdn')">
        <img src="https://zhang.beer:9999/ache/beer/menu/csdn.png" />
        <span>CSDN</span>
      </div>
    </div>
  </div>
  <el-dialog v-model="showDialog" custom-class="my-dialog login">
    <template #title>
      <img
        src="https://zhang.beer:9999/ache/beer/menu/login.png"
        style="height: 20px; width: 40px; vertical-align: -16%"
      />
    </template>
    <el-form :model="formInfo" ref="form" :rules="rules" :key="formKey">
      <el-form-item label="用户" prop="user">
        <el-input
          v-model="formInfo.user"
          clearable
          v-on:keyup.enter="submitForm"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input
          type="password"
          v-model="formInfo.pwd"
          autocomplete="off"
          show-password
          clearable
          v-on:keyup.enter="submitForm"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="success"
        v-if="store.state.user.info.role === 'admin'"
        @click="register"
        >注册</el-button
      >
      <el-button
        type="success"
        v-if="!store.state.user.info"
        @click="submitForm"
        >登录</el-button
      >
      <el-button type="primary" v-if="!store.state.user.info" @click="resetForm"
        >重置</el-button
      >
      <el-button type="danger" v-if="store.state.user.info" @click="exit"
        >退出登录</el-button
      >
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.brand {
  height: 100px;
  padding: 24px 0;
  background-color: #222;
  color: #fff;

  span {
    color: #ddd;
  }

  div {
    cursor: pointer;
    margin: 16px auto;
  }
}

.nav {
  background-color: #fff;
  // height: 240px;
  height: 288px;
  padding: 24px 0;
  text-align: left;
  overflow: auto;

  :deep(.el-menu) {
    border: none;

    .el-menu-item,
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      color: #888;

      &:hover {
        color: #000;
        background-color: #f1f1f1;
      }

      i {
        margin-right: 6px;
      }
    }

    .el-sub-menu__title * {
      vertical-align: baseline;
    }

    .is-active:not(.el-sub-menu) {
      background-color: #f1f1f1;
      color: #000;
    }
  }
}

.info {
  padding: 24px 16px;
  background-color: #fff;
  margin-top: 8px;

  .author-vx {
    img {
      width: 160px;
      height: 160px;
      border: 1px #f1f1f1 solid;
    }
  }

  .links {
    margin-top: 24px;
    display: flex;
    justify-content: space-evenly;

    div {
      height: 32px;
      width: 32%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      text-align: left;
      border: 1px transparent solid;
      border-radius: 4px;

      &:hover {
        border: 1px #ddd solid;
        cursor: pointer;
      }

      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      span {
        font-size: 12px;
        vertical-align: top;
      }
    }
  }
}

.infoFixed {
  width: 300px;
  position: fixed;
  z-index: 2021;
  top: 0;
  box-sizing: border-box;
}
</style>
