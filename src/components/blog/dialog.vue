<script setup>
import { ref } from 'vue'
import useUserStore from '@/store/useUserStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import time from '@/utils/time'
import axios from 'axios'

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const props = defineProps({
  showDialog: Boolean,
  smallScreen: Boolean,
  blogType: Array,
})
const emit = defineEmits(['update'])
let formRef = ref(null)
let formData = ref({
  title: '',
  type: '',
  url: '',
  detail: '',
  pic: '',
  time: time.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
  color: '',
})

const rules = ref({
  type: { required: true, message: '博客类型不能为空', trigger: ['blur', 'change'] },
  title: { required: true, message: '博客标题不能为空', trigger: ['blur', 'change'] },
  url: { required: true, message: '博客地址不能为空', trigger: ['blur', 'change'] },
})

const save = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      await axios.post('/ache/blog/add-blog', formData.value)
      emit('update')
      ElMessage.success('添加成功')
      props.showDialog.show = false
    }
  })
}
</script>

<template>
  <el-dialog v-model="showDialog.show" :custom-class="`my-dialog ${smallScreen ? 'general' : 'noHeight'}`">
    <template #header>
      <ICON code="add" />
      <span>添加博客</span>
    </template>
    <el-form :model="formData" ref="formRef" :label-width="52" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入博客标题" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择博客类型" allow-create filterable>
          <el-option v-for="(item, index) in blogType.slice(1)" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="url">
        <el-input v-model="formData.url" placeholder="请输入博客地址" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="摘要" prop="detail">
        <el-input v-model="formData.detail" placeholder="请输入博客摘要" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pic">
        <el-input v-model="formData.pic" placeholder="请输入博客封面图片地址" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-input v-model="formData.time" disabled></el-input>
      </el-form-item>
      <el-form-item label="颜色" prop="color">
        <el-input v-model="formData.color" placeholder="请输入博客时间线颜色，例如 #FFF" maxlength="50"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="!isAdmin" plain @click="showDialog.show = false">取消 </el-button>
      <el-button :disabled="!isAdmin" type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-form {
  max-width: 400px;
  margin: auto;
}
</style>
