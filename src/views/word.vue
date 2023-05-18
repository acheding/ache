<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useWordStore from '../store/useWordStore'

const router = useRouter()
const { setWord } = useWordStore()

const props = defineProps({
  smallScreen: Boolean,
})

const state = reactive({
  loading: false,
  showDialog: false,
  dialogData: {},
  result: '',
  radio: '1920',
})

const apis = ref([
  {
    icon: 'trash',
    name: 'trash words generator',
    api: 'other/trash',
    abstract: '学学土味烧话。',
  },
  {
    icon: 'green',
    name: 'green tea words generator',
    api: 'other/green',
    abstract: '原来这就是绿茶。',
  },
  {
    icon: 'rainbow',
    name: '彩虹屁',
    api: 'other/chp',
    abstract: '快速生成彩虹屁，快去夸夸ta。',
  },
  {
    icon: 'one',
    name: '一言',
    api: 'other/one',
    abstract:
      '动漫也好、小说也好、网络也好，不论在哪里，总有那么一两个句子能穿透你的心。一言指的就是一句话，可以是动漫中的台词，也可以是网络上的各种小段子。 或是感动，或是开心，亦或是单纯的回忆。',
  },
  {
    icon: 'pyq',
    name: '朋友圈文案',
    api: 'other/pyq',
    abstract: '朋友圈文案（反正我不会发）。',
  },
  {
    icon: 'soup',
    name: '毒鸡汤',
    api: 'other/du',
    abstract: '没得一句好听的话。',
  },
  {
    icon: 'hdpic',
    name: '每日壁纸',
    api: 'https://api.dujin.org/bing/1920.php',
    abstract: '自动生成一张高清壁纸。',
  },
  {
    icon: 'dog',
    name: '狗屁不通文章生成器',
    api: 'https://suulnnka.github.io/BullshitGenerator/index.html',
    abstract: '根据关键词一键生成一篇魔幻形式主义大作。',
  },
  {
    icon: 'letter',
    name: '时光邮局',
    api: 'https://www.hi2future.com/',
    abstract: '给未来写一封信吧',
  },
])

const getWords = async (item) => {
  state.dialogData = item
  state.result = ''
  if (item.icon !== 'hdpic') {
    detail(item)
  }
  if (item.icon !== 'dog' && item.icon !== 'letter') {
    state.showDialog = true
  }
}
const detail = async (item, evt) => {
  if (evt) {
    let target = evt.target // 取消聚焦
    if (target.nodeName == 'SPAN') {
      target = evt.target.parentNode
    }
    target.blur()
  }

  if (item.icon === 'trash') {
    let res = await axios.get(item.api)
    state.result = res.data.returnObj[0]
  } else if (item.icon === 'green') {
    let res = await axios.get(item.api)
    state.result = res.data.returnObj.content
  } else if (item.icon === 'rainbow' || item.icon === 'pyq' || item.icon === 'soup') {
    let res = await axios.get(item.api)
    state.result = res.data.data.text
  } else if (item.icon === 'one') {
    let res = await axios.get(item.api)
    state.result = res.data.hitokoto + (res.data.from_who ? '——' + res.data.from_who : '')
  } else if (item.icon === 'hdpic') {
    if (state.radio === '1920' || state.radio === '1366' || state.radio === 'm') {
      window.open('https://api.dujin.org/bing/' + state.radio + '.php')
    } else {
      window.open('https://api.ixiaowai.cn/' + state.radio + '.php')
    }
  } else if (item.icon === 'dog' || item.icon === 'letter') {
    window.open(item.api)
  }
}

const copy = () => {
  let content = state.result
  const input = document.createElement('input')
  input.value = content
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage({
    type: 'success',
    message: '已复制到剪切板',
    'show-close': true,
    grouping: true,
  })
}
const jump = () => {
  setWord(state.result)
  router.push({ name: 'main' })
}
</script>

<template>
  <div class="cards" :class="{ smallScreen: smallScreen }">
    <div v-for="item in apis" :key="item.api" class="card" @click="getWords(item)">
      <div class="portrait">
        <img :src="`https://zhang.beer:9999/ache/beer/word/${item.icon}.svg`" />
      </div>
      <div class="content">
        <div>
          <strong>{{ item.name }}</strong>
        </div>
        <div :title="item.abstract">{{ item.abstract }}</div>
      </div>
    </div>
  </div>

  <el-dialog v-model="state.showDialog" v-if="state.showDialog"
    :class="`my-dialog ${smallScreen ? 'smallNormal' : state.dialogData.icon === 'hdpic' ? 'normal' : 'small'}`">
    <template #header>
      <div class="title">
        <img :src="`https://zhang.beer:9999/ache/beer/word/${state.dialogData.icon}.svg`" />
        <span>{{ state.dialogData.name }}</span>
        <el-tooltip v-if="state.dialogData.icon !== 'hdpic'" content="点击句子可复制到剪切板，点击添加可跳转到首页添加此句子。" placement="top-start"
          effect="light">
          <ICON code="about" />
        </el-tooltip>
      </div>
    </template>
    <div v-if="state.dialogData.icon === 'hdpic'">
      <h3>每日壁纸</h3>
      <el-radio v-model="state.radio" label="1920">1920*1080</el-radio>
      <el-radio v-model="state.radio" label="1366">1366*768</el-radio>
      <el-radio v-model="state.radio" label="m">1080*1920</el-radio>
      <h3>高清壁纸</h3>
      <el-radio v-model="state.radio" label="api/api">二次元</el-radio>
      <el-radio v-model="state.radio" label="gqapi/gqapi">风景壁纸 </el-radio>
    </div>
    <div v-else>
      <div class="word" @click="copy()">
        {{ state.result }}
      </div>
    </div>
    <template #footer>
      <el-button @click="jump" v-if="state.dialogData.icon !== 'hdpic'">添加</el-button>
      <el-button @click="detail(state.dialogData, $event)" v-if="state.dialogData.icon !== 'hdpic'">再来一条</el-button>
      <el-button v-else @click="detail(state.dialogData, $event)">let's go</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.cards {
  // margin-top: 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 54px;

  .card {
    box-sizing: border-box;
    width: 400px;
    height: 100px;
    border: 1px solid #dddddd;
    border-radius: 3px;
    transition: 0.3s ease-out;
    display: flex;

    &:hover {
      box-shadow: 8px 8px 12px 0px rgba(0, 0, 0, 0.08);
      transform: translateY(-10px);
      transition: 0.1s ease-in;
      cursor: pointer;
    }

    .portrait {
      width: calc(98px - 16px);
      padding: 8px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .content {
      width: calc(100% - 98px - 32px);
      text-align: left;
      padding: 16px;

      div {
        &:first-child {
          color: #373e4a;
        }

        &:last-child {
          margin-top: 4px;
          color: #979898;
          font-size: 15px;
          overflow: hidden; // 超过两行显示省略号
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
  }
}

.title {
  text-align: left;
  line-height: 20px;

  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: -20%;
  }

  i {
    margin-left: 5px;
    margin-top: 2px;
    cursor: pointer;

    &:hover {
      color: orangered;
    }
  }
}

.word {
  margin-bottom: 16px;

  &:hover {
    cursor: pointer;
  }
}

.smallScreen {
  margin-top: 0px; // 720/6=120 120-100-6=14
  padding: 16px;
  gap: 24px;
  height: 1092px; // 不写高度的话有些机型会粘在一起 720+100*3+24*3

  .card {
    &:hover {
      transform: translateY(0);
    }
  }
}
</style>
