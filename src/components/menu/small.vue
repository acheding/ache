<script setup>
import { onMounted, onBeforeUnmount, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import menu from "../../../menu.json";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import visit from "../../js/visit";
import axios from "axios";
import md5 from "js-md5";

const change = ref(false); //滚动92之后改变功能键的背景色等
const sunFixed = ref(false); //滚动24之后固定小太阳
const hideWord = ref(false); //滚动52之后隐藏文字
const hideFunc = ref(false); //滚动148之后向下滚动隐藏功能键，向上滚动显示功能键
const store = useStore();
const route = useRoute();
const activeIndex = ref();
const showDialog = ref(false);
const formInfo = ref({
  user: "",
  pwd: "",
});
const params = ref({
  time: "",
  os: "",
  screen: "",
  agent: "",
  timestamp: "",
});
const form = ref(null);
const formKey = ref(0);
const rules = reactive({
  user: [
    { required: true, message: "请输入用户", trigger: ["blur", "change"] },
  ],
  pwd: [{ required: true, message: "请输入密码", trigger: ["blur", "change"] }],
});
const drawer = ref(false);
const scrollTop = ref(0);

watch(
  () => route.matched,
  (newValue, oldValue) =>
  {
    activeIndex.value = newValue[newValue.length - 1].path;
    document.title = "Ache | " + newValue[newValue.length - 1].name;
  }
);
watch(
  () => scrollTop.value,
  (newValue, oldValue) =>
  {
    if (newValue > 24) {
      sunFixed.value = true;
    } else {
      sunFixed.value = false;
    }
    if (newValue > 52) {
      hideWord.value = true;
    } else {
      hideWord.value = false;
    }
    if (newValue > 92) {
      change.value = true;
    } else {
      change.value = false;
    }
    if (newValue > 148) {
      if (newValue > oldValue) {
        hideFunc.value = true;
      } else {
        hideFunc.value = false;
      }
    }
  }
);

onMounted(() =>
{
  window.addEventListener("scroll", watchScroll, true);
  insertVisit();
});
onBeforeUnmount(() =>
{
  window.removeEventListener("scroll", watchScroll, true);
});
const insertVisit = async () =>
{
  const info = await visit.getVisitInfo();
  params.value.time = info[0];
  params.value.os = info[1];
  params.value.screen = info[2];
  params.value.agent = info[3];
  params.value.timestamp = info[4];
  await axios.post("/ache/visit/insert-visitor", params.value);
};
const watchScroll = () =>
{
  scrollTop.value =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
};

const resetForm = () =>
{
  form.value.resetFields();
  formKey.value++;
};
const submitForm = () =>
{
  form.value.validate((valid, fields) =>
  {
    if (valid) {
      store.dispatch("user/login", formInfo.value).then((rst) =>
      {
        if (rst) {
          ElMessage({
            type: "success",
            message: "登录成功！",
            "show-close": true,
            grouping: true,
          });
          showDialog.value = false;
        } else {
          ElMessage({
            type: "error",
            message: "登录失败！请重新登录！",
            "show-close": true,
            grouping: true,
          });
        }
      });
    }
  });
};
const exit = () =>
{
  store.dispatch("user/exit", store.state.user.info).then((rst) =>
  {
    ElMessage({
      type: "info",
      message: rst,
      "show-close": true,
      grouping: true,
    });
    resetForm();
  });
  showDialog.value = false;
};
const register = () =>
{
  form.value.validate(async (valid, fields) =>
  {
    if (valid) {
      let info = formInfo.value.user.split("?");
      ElMessageBox.confirm("确定要注册<" + info[0] + ">用户吗？", "注册提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(async () =>
      {
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
    <div class="function" :style="[
      change ? 'color:#555;background:#fff;border-bottom:1px solid #eee' : '',
      hideFunc ? 'opacity: 0' : '',
    ]">
      <div @click="showDialog = true">
        <ICON code="login" />
      </div>
      <div v-show="sunFixed">
        <ICON :class="{ logined: store.state.user.info }" class="unLogin" code="sun" :size="24" />
      </div>
      <div @click="drawer = true">
        <ICON code="menu" />
      </div>
    </div>
    <div class="sun">
      <ICON v-show="!sunFixed" :class="{ logined: store.state.user.info }" class="unLogin" code="sun" :size="24" />
    </div>
    <span :style="[
      hideWord ? 'opacity: 0;transition: all 0.5s;' : 'transition: all 0.5s;',
    ]">轻松点，这一生，就当来旅游</span>
  </div>
  <el-drawer title="菜单" :with-header="false" :show-close="true" v-model="drawer" direction="ttb" size="328px">
    <div class="nav">
      <el-menu :default-active="activeIndex" router>
        <template v-for="item in menu">
          <template v-if="item.children?.length">
            <el-sub-menu :key="item.name" :index="item.router">
              <template #header>
                <ICON :code="item.icon" />
                <span class="title">{{ item.title }}</span>
              </template>
              <el-menu-item class="el-menu-item" v-for="sub in item.children" :key="sub.name"
                :index="item.router + sub.router" @click="drawer = false">
                <ICON :code="item.icon" />
                <span class="title">{{ sub.title }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item class="el-menu-item" :key="item.name" :index="item.router" @click="drawer = false">
              <ICON :code="item.icon" />
              {{ item.title }}
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </el-drawer>

  <el-dialog v-model="showDialog" class="my-dialog smallLogin">
    <template #header>
      <img src="https://zhang.beer:9999/ache/beer/menu/login.svg"
        style="height: 20px; width: 40px; vertical-align: -16%" />
    </template>
    <el-form :model="formInfo" ref="form" :rules="rules" :key="formKey">
      <el-form-item label="用户" prop="user">
        <el-input v-model="formInfo.user" clearable v-on:keyup.enter="submitForm"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input type="password" v-model="formInfo.pwd" autocomplete="off" show-password clearable
          v-on:keyup.enter="submitForm"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="success" v-if="store.state.user.info.role === 'admin'" @click="register">注册</el-button>
      <el-button type="success" v-if="!store.state.user.info" @click="submitForm">登录</el-button>
      <el-button type="primary" v-if="!store.state.user.info" @click="resetForm">重置</el-button>
      <el-button type="danger" v-if="store.state.user.info" @click="exit">退出登录</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.brand {
  position: relative;
  height: 100px;
  padding: 24px 0;
  background-color: #222;
  color: #fff;

  .sun {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    color: #ddd;
  }

  .function {
    z-index: 1999;
    position: fixed;
    height: 56px;
    width: 100%;
    top: 0;
    display: flex;
    justify-content: space-between;
    transition: all 0.5s;

    div {
      width: 56px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-child:hover,
      &:last-child:hover {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}

.nav {
  height: 288px;
  overflow: auto;
  text-align: left;

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
</style>
