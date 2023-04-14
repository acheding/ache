<script setup>
import { onMounted, reactive, ref, nextTick, onBeforeMount } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from "element-plus";
import md5 from "js-md5";

const store = useStore()
const route = useRoute()

const props = defineProps({
  smallScreen: Boolean,
});

const state = reactive({
  activeName: "1",
  activeId: null,
  showDialog: false,
  loading: false
});


onBeforeMount(() => {
  if (route.params.word) {
    formInfo.value.zhcn = route.params.word
    showDialog()
    translate()
  }
})

onMounted(() => {
  getWords()
})

const words = ref([])
const getWords = async () => {
  let res = await axios.get('ache/words/get-words')
  words.value = res.data
  state.activeId = res.data[0].id
}

const deleteWord = async (id) => {
  ElMessageBox.confirm("确定要删除这句话吗？", "删除提示", {
    distinguishCancelAndClose: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(async () => {
    await axios.delete("/ache/words/delete-word", { params: { id: parseInt(id) } });
    getWords()
  });
}

const formInfo = ref({
  zhcn: "",
  enus: "",
  lang: 'en'
});
const options = ref([{
  label: '中文',
  value: 'zh',
}, {
  label: '繁体中文',
  value: 'cht',
}, {
  label: '英文',
  value: 'en',
}, {
  label: '粤语',
  value: 'yue',
}, {
  label: '文言文',
  value: 'wyw',
}, {
  label: '日语',
  value: 'jp',
}, {
  label: '韩语',
  value: 'kor',
}, {
  label: '法语',
  value: 'fra',
}, {
  label: '西班牙语',
  value: 'spa',
}, {
  label: '泰语',
  value: 'th',
}, {
  label: '俄语',
  value: 'ru',
}, {
  label: '葡萄牙语',
  value: 'pt',
}, {
  label: '德语',
  value: 'de',
}, {
  label: '意大利语',
  value: 'it',
}, {
  label: '希腊语',
  value: 'el',
}, {
  label: '荷兰语',
  value: 'nl',
}, {
  label: '波兰语',
  value: 'pl',
}, {
  label: '丹麦语',
  value: 'dan',
}, {
  label: '芬兰语',
  value: 'fin',
}, {
  label: '捷克语',
  value: 'cs',
}, {
  label: '匈牙利语',
  value: 'hu',
}, {
  label: '越南语',
  value: 'vie',
}, {
  label: '瑞典语',
  value: 'swe',
}])

const rules = reactive({
  zhcn: [
    { required: true, message: "请输入句子", trigger: ["blur", "change"] },
  ],
  enus: [{ required: true, message: "请输入外文", trigger: ["blur", "change"] }],
});

const form = ref(null)

const addWord = () => {
  form.value.validate(async (valid, fields) => {
    if (valid) {
      await axios.post("/ache/words/add-word", formInfo.value);
      ElMessage({
        type: "success",
        message: "句子添加成功！",
      });
      state.showDialog = false
    }
  });
}

const showDialog = () => {
  state.showDialog = true
  nextTick(() => {
    form.value.resetFields()
  })
}

const translate = async () => {
  let transData = {
    q: formInfo.value.zhcn,
    from: 'auto',
    to: formInfo.value.lang,
    appid: '20220807001297216',
    salt: Date.now(),
    sign: md5('20220807001297216' + formInfo.value.zhcn + Date.now() + 'RKyiNw8Sh2o831RiXv9E'),
  }
  state.loading = true
  let res = await axios.get('other/translate', { params: transData })
  state.loading = false
  formInfo.value.enus = res.data.trans_result[0].dst
}
</script>

<template>
  <el-collapse v-model="state.activeName" accordion v-for="(item, index) in words" :key="item"
    @change="state.activeId = item.id">
    <el-collapse-item :title="item.zhcn" :name="(index + 1).toString()">
      <div>{{ item.enus }}</div>
      <div class="minus" v-if="store.state.user.info.role === 'admin' && state.activeId === item.id"
        @click="deleteWord(item.id)">
        <ICON code="minus" />
      </div>
    </el-collapse-item>
  </el-collapse>
  <div class="plus gm" @click="showDialog()">
    <ICON code="plus" />
  </div>

  <el-dialog v-model="state.showDialog" :custom-class="`my-dialog ${smallScreen ? 'general' : 'icon'}`">
    <template #title>
      <ICON code="plus" />
      添加句子
    </template>
    <el-form :model="formInfo" ref="form" :rules="rules" :label-width="52">
      <el-form-item label="句子" prop="zhcn">
        <el-input type="textarea" :rows="3" placeholder="请输入句子" v-model="formInfo.zhcn" clearable
          v-on:keyup.enter="addWord"></el-input>
      </el-form-item>
      <el-form-item label="语言" prop="lang">
        <el-select v-model="formInfo.lang" placeholder="请选择翻译语言" filterable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button v-loading="state.loading" type="primary"
          :style="[smallScreen ? 'margin-top: 16px;display:block' : 'margin-left: 28px']" @click="translate">
          翻译
        </el-button>
      </el-form-item>
      <el-form-item label="外文" prop="enus">
        <el-input type="textarea" :rows="3" placeholder="请输入外文，可手动输入或者自动翻译" v-model="formInfo.enus" clearable
          v-on:keyup.enter="addWord"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="success" :disabled="store.state.user.info.role !== 'admin'" @click="addWord">添加</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-collapse {
  border: none;

  :deep(.el-collapse-item__header) {
    line-height: normal;
    text-align: left;
    border: none;
  }

  :deep(.el-collapse-item__wrap) {
    border: none;

    .el-collapse-item__content {
      color: #677383;
      font-family: "Times New Roman", Times, serif;
      font-style: italic;
    }
  }
}

:deep(.el-form-item__content) {
  display: block;
}

.minus,
.plus {
  margin-top: 8px;
}

.minus {
  i:hover {
    color: orangered;
    cursor: pointer;
  }
}
</style>
