<script setup>
import { reactive, defineAsyncComponent } from 'vue'
const Calendar = defineAsyncComponent(() => import('../calendar/index.vue'))
const Collapse = defineAsyncComponent(() => import('../collapse/index.vue'))

const props = defineProps({
  smallScreen: Boolean,
})

const state = reactive({
  value: new Date(),
  activeName: '1',
  wallpapers: [
    {
      title: '网站简介（2021）',
      content: [
        '网站由vite+Vue3+element-plus+pinia+SpringBoot构建。test，123456。',
        '微信小程序：MahjongScorer',
        'https://zhang.beer/static/images/MahjongScorer.jpg',
        '另外几个网站：',
        '博客，一个由VuePress搭建的文档网站，分享自己一段时间的收获、经验，也是一段时间的总结。',
        'https://zhang.beer/vuepress（https://blog.zhang.beer）',
        '日记本，一个可以记录日常的网站，有上传图片，评论，回复等功能。与此网站的账号、数据互通。',
        'https://zhang.beer/diary（https://diary.zhang.beer）',
        '今天中午吃什么，搬运自github上的一个开源项目，解决吃什么的世纪难题。',
        'https://zhang.beer/eat（https://eat.zhang.beer）',
        'ChatGPT，github上的一个开源项目，结合Vercel部署实现国内可访问。',
        'https://chat.zhang.beer',
      ],
    },
    {
      title: '功能简介',
      content: [
        '首页折叠句子分为上下不同语言的两行，每次刷新自动随机返回8条，点击添加按钮可添加句子，其中外文可通过翻译功能自动翻译为多国语言，也可以通过手动输入。',
        '点击添加日程可选择日期，记录日程和进度，有日程的日期下会有横线显示，不同进度的日程颜色不一。未登录只能创建公共访客事件，登录之后才可创建账号的单独日程。点击两个事件可交换顺序，但只可交换当天事件。',
        '博客可根据不同分类显示对应博文摘要，支持模糊搜索并高亮，点击可跳转至博客详情页。',
        '动画采用纯css编写，通过大量span标签和伪元素实现各种物体，如太阳、云朵、风、树、风车的塑造。句子的接口为开源接口转发而来，点击句子可复制到剪切板，点击添加可跳转到首页添加此句子。',
        '图标中心支持图标的增删改查和组件代码复制，图标采用后端接口调用图标，数据库存储图标，前端图标组件化复用等方式，统一管理，提升开发与维护效率。',
        '关于页显示近50条访客浏览记录，同一设备同一浏览器10分钟之内仅记录一次，并根据时间段和设备类型作出图表统计。',
      ],
    },
  ],
})
const jump = (section) => {
  window.open(section.split('（')[0])
}
</script>

<template>
  <el-row>
    <el-col>
      <el-carousel height="360px" direction="vertical" :interval="8000">
        <el-carousel-item v-for="(item, i) in state.wallpapers" :key="item.title">
          <div class="word">
            <div style="margin-left: 32px">
              <p>{{ item.title }}</p>
              <p v-for="(section, j) in item.content">
                <span v-if="i === 0 && [2, 5, 7, 9, 11].includes(j)" class="gm" @click="jump(section)">{{ section }}</span>
                <span v-else>{{ section }}</span>
              </p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-col>
  </el-row>
  <el-row :gutter="8">
    <el-col :span="14" :smallScreen="smallScreen">
      <Collapse></Collapse>
    </el-col>
    <el-col :span="10">
      <Calendar></Calendar>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.el-row {
  &:first-child {
    margin-bottom: 16px;
  }
}

:deep(.el-carousel) {
  ul {
    .el-carousel__button {
      background: lightblue;
    }
  }

  .word {
    position: absolute;
    left: 6%;
    top: 24px;
    text-align: left;
    color: #524c4c;
    width: 88%;
    height: calc(100% - 48px);
    overflow: auto;

    p {
      margin: 0;
    }

    p:first-child {
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }

    p:last-child {
      line-height: 24px;
    }
  }

  .word::before {
    position: absolute;
    content: '';
    width: 4px;
    height: 80%;
    background: #42b983;
    opacity: 0.44;
    top: 10%;
  }
}
</style>
