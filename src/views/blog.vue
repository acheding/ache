<script setup>
import { ref, onBeforeMount, watch, reactive, nextTick } from 'vue'
import axios from 'axios'
import MyDialog from '@/components/blog/dialog.vue'

const props = defineProps({
  smallScreen: Boolean,
})

const state = reactive({
  active: 0,
  reverseActive: false,
})
const blogType = ref(['全部'])
const blogs = ref([])
const filter = ref({
  sort: '',
  type: '',
  search: '',
})
let showDialog = ref({
  show: false,
  key: 0
})

onBeforeMount(() => init())

watch(
  () => filter.value.search,
  () => {
    getBlog()
  }
)

const init = async () => {
  await getBlog()
  blogType.value = [...['全部'], ...new Set(blogs.value.map(x => x.type))]
}

const jump = (type, url) => {
  let suffix = url ? '/' + url + '.html' : ''
  window.open('https://zhang.beer/vuepress/blog/' + type + suffix)
}

const getBlog = async (index, type, sort) => {
  if (type) {
    if (type === '全部') filter.value.type = ''
    else filter.value.type = type
    state.active = index
  }
  if (sort) {
    if (filter.value.sort === 'reverse') {
      filter.value.sort = ''
      state.reverseActive = false
    } else {
      filter.value.sort = 'reverse'
      state.reverseActive = true
    }
  }
  let res = await axios.get('/ache/blog/get-blogs', { params: filter.value })
  blogs.value = res.data
}

const highLight = (allText, keyword) => {
  // let specialCharacter = ["\\", "(", ")", "_", "*", "+", ".", "[", "]", "?"];
  // specialCharacter.map((v) => {
  //   let qwq = new RegExp("\\" + v, "gim");
  //   keyword = keyword.replace(qwq, "\\" + v);
  // });
  // console.log(keyword);

  let Reg = new RegExp(keyword, 'ig')
  if (allText) {
    let execRes = Reg.exec(allText.toString()) //得到一个匹配结果的集合，包含关键字出现的索引
    if (execRes) {
      let realword = allText.substr(execRes.index, keyword.length) //根据索引和关键字长度获取原本的真实大小写关键词
      let res = allText.replace(Reg, `<span style="color: red;">${realword}</span>`)
      return res
    } else return allText
  } else return allText
}

const getColor = (color) => {
  if (color) return color
  else
    return (
      '#' +
      Math.floor(Math.random() * 255).toString(16) +
      Math.floor(Math.random() * 255).toString(16) +
      Math.floor(Math.random() * 255).toString(16)
    )
}

const addBlog = () => {
  showDialog.value.show = true
  showDialog.value.key++
}
</script>

<template>
  <div :class="{ smallScreen: smallScreen }">
    <div class="search">
      <div class="search-add">
        <el-input v-model="filter.search" placeholder="搜一搜" clearable show-word-limit maxlength="50"></el-input>
        <el-button type="primary" plain @click="addBlog">
          <ICON code="add" />
        </el-button>
      </div>
      <div>
        <span v-for="(item, index) in blogType" @click="getBlog(index, item)"
          :class="{ isactive: state.active === index }">
          {{ item }}
        </span>
        <span :class="{ isactive: state.reverseActive }" @click="getBlog(7, '', 'reverse')"> 倒序 </span>
      </div>
    </div>
    <el-timeline v-if="blogs.length">
      <el-timeline-item v-for="item in blogs" :timestamp="item.time" :color="getColor(item.color)" placement="top">
        <el-card>
          <h3 v-html="highLight(item.title, filter.search)" @click="jump(item.type, item.url)"></h3>
          <p v-html="highLight(item.detail ? item.detail : item.title, filter.search)"></p>
          <!-- <img v-if="item.pic" :src="`/blog/${item.pic}.png`" /> -->
          <!-- <img v-if="item.pic" :src="item.pic" /> -->
          <el-image v-if="item.pic" :src="item.pic" lazy :preview-src-list="[item.pic]"></el-image>
          <p style="cursor: pointer">
            收录于 <strong @click="jump(item.type)">{{ item.type }}</strong>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div v-else>
      <el-empty image="https://zhang.beer/static/images/noData.png" description="空空如也~" :image-size="320"></el-empty>
    </div>
  </div>
  <MyDialog :key="showDialog.key" :showDialog="showDialog" :smallScreen="smallScreen" :blogType="blogType" @update="init">
  </MyDialog>
</template>

<style scoped lang="scss">
.search {
  height: 100px;

  width: 720px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;

  .search-add {
    display: flex;
    gap: 8px;

    .el-input {
      --el-input-focus-border: grey;
      --el-input-focus-border-color: grey;
    }

    .el-button {
      padding: 8px;
    }

    .el-button--primary.is-plain {
      background: transparent;
      border-color: #dcdfe6;
      color: grey;
    }

    .el-button--primary.is-plain:hover {
      color: grey;
      border-color: #c0c4cc;
    }

    .el-button--primary.is-plain:focus {
      color: grey;
      border-color: grey;
    }
  }



  span {
    margin-right: 8px;
    font-size: 15px;
    color: #999;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: #000;
      cursor: pointer;
    }
  }
}

.isactive {
  color: #000 !important;
}

.el-timeline {
  text-align: left;

  .el-card {
    display: inline-block;

    img {
      max-width: 100%;
      // max-height: 240px;
    }

    &:hover {
      box-shadow: 8px 8px 12px 0px rgba(0, 0, 0, 0.08);
    }

    p {
      color: #677383;
    }

    h3 {
      display: inline-block;
      margin-bottom: 0;
      cursor: pointer;

      &:hover {
        color: #409eff;
      }
    }
  }
}

.smallScreen {
  padding: 16px;

  .search {
    width: 100%;
    height: 80px;
    justify-content: flex-start;

    span {
      font-size: 12px !important;
    }
  }

  .el-timeline {
    margin-left: -40px;

    .el-card {
      display: block;

      h3 {
        display: inline;
      }
    }
  }
}
</style>
