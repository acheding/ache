<script setup>
import { reactive, ref, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { useStore } from 'vuex'

const props = defineProps({
  smallScreen: Boolean,
})

const store = useStore()

const state = reactive({
  chartNumbers: [0, 0, 0, 0, 0, 0, 0],
  chartTimePeriod: ['0-5', '5-8', '8-11', '11-13', '13-16', '16-19', '19-0'],
  chartDevice: [
    {
      value: 0,
      name: 'PC',
    },
    {
      value: 0,
      name: 'Tablet',
    },
    {
      value: 0,
      name: 'Mobile',
    },
    {
      value: 0,
      name: 'Unknown',
    },
  ],
})

const tableData = ref([])

onBeforeMount(() => {
  getTable()
})

watch(
  () => store.state.user.info,
  () => getTable()
)

const getTable = async () => {
  let res =
    store.state.user.info.role === 'admin' ? await axios.get('/ache/visit/get-visitors-all') : await axios.get('/ache/visit/get-visitors')
  tableData.value = res.data
  getLineChart()
  getCakeChart()
}

const getLineChart = () => {
  state.chartNumbers = [0, 0, 0, 0, 0, 0, 0]
  for (let item in tableData.value) {
    // let temp0 = res.data[item].time;
    // let temp1 = temp0.substr(temp0.indexOf(" "));
    // let temp2 = temp1.substr(0, temp1.indexOf(":"))
    let temp1 = tableData.value[item].time.substr(11, 2) // start,length
    if (temp1 >= 0 && temp1 < 5) {
      state.chartNumbers[0]++
    } else if (temp1 >= 5 && temp1 < 8) {
      state.chartNumbers[1]++
    } else if (temp1 >= 8 && temp1 < 11) {
      state.chartNumbers[2]++
    } else if (temp1 >= 11 && temp1 < 13) {
      state.chartNumbers[3]++
    } else if (temp1 >= 13 && temp1 < 16) {
      state.chartNumbers[4]++
    } else if (temp1 >= 16 && temp1 < 19) {
      state.chartNumbers[5]++
    } else {
      state.chartNumbers[6]++
    }
  }
  let instance = document.getElementById('line')
  echarts.dispose(instance)
  let myChart = echarts.init(instance)
  myChart.setOption({
    color: ['#4EADFB', '#FFAC59'],
    tooltip: {
      trigger: 'axis',
      textStyle: {
        align: 'left',
      },
      formatter: function (param) {
        let time = param[0].seriesName + '：' + param[0].axisValue + '点'
        let num = param[0].marker + '访问次数：' + param[0].value + '次'
        return '<div>' + time + '</br>' + num + '</div>'
      },
    },
    grid: {
      top: 30,
    },
    xAxis: {
      type: 'category',
      data: state.chartTimePeriod,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '时间段',
        data: state.chartNumbers,
        type: 'line',
      },
    ],
  })
}

const getCakeChart = () => {
  for (let i in state.chartDevice) {
    state.chartDevice[i].value = 0
  }
  for (let item in tableData.value) {
    if (tableData.value[item].os.match('PC')) {
      state.chartDevice[0].value++
    } else if (tableData.value[item].os.match('Tablet')) {
      state.chartDevice[1].value++
    } else if (tableData.value[item].os.match('Mobile')) {
      state.chartDevice[2].value++
    } else {
      state.chartDevice[3].value++
    }
  }
  let instance = document.getElementById('cake')
  echarts.dispose(instance)
  let myChart = echarts.init(instance)
  myChart.setOption({
    color: ['#FF7070', '#FFDC60', '#7ED3F4', '#9FE080'],
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: '设备类型',
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: state.chartDevice,
      },
    ],
  })
}

const deleteVisit = async (id, evt) => {
  if (evt) {
    let target = evt.target // 取消聚焦
    if (target.nodeName == 'SPAN') {
      target = evt.target.parentNode
    }
    target.blur()
  }
  await axios.delete('/ache/visit/delete-visitor', {
    params: { id: parseInt(id) },
  })
  getTable()
}

const openChaipip = (ip) => {
  let content = ip
  const input = document.createElement('input')
  input.value = content
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  window.open('https://www.chaipip.com/aiwen.html')
}
</script>

<template>
  <h1>近期访客</h1>

  <el-table
    :data="tableData"
    stripe
    style="width: 100%"
    max-height="480"
    :default-sort="{ prop: 'id', order: 'descending' }"
    v-if="!props.smallScreen"
  >
    <el-table-column type="index" label="#" width="50" align="center"> </el-table-column>
    <el-table-column prop="time" label="时间" min-width="200" sortable> </el-table-column>
    <el-table-column prop="ipAddress" label="IP属地" min-width="150"> </el-table-column>
    <el-table-column prop="os" label="操作系统" show-overflow-tooltip min-width="250"> </el-table-column>
    <el-table-column label="IP" show-overflow-tooltip min-width="180" v-if="store.state.user.info.role === 'admin'">
      <template v-slot="scope">
        <span class="gm" @click="openChaipip(scope.row.ip)">{{ scope.row.ip }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="screen" label="屏幕分辨率" show-overflow-tooltip min-width="150"> </el-table-column>
    <el-table-column label="操作" min-width="100" v-if="store.state.user.info.role === 'admin'">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteVisit(scope.row.id, $event)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-table
    :data="tableData"
    stripe
    style="width: 100%; font-size: 10px"
    max-height="480"
    :default-sort="{ prop: 'id', order: 'descending' }"
    v-else
  >
    <el-table-column type="index" label="#" width="20" align="center"> </el-table-column>
    <el-table-column prop="time" label="时间" sortable min-width="90"> </el-table-column>
    <el-table-column prop="ipAddress" label="IP属地" min-width="60"> </el-table-column>
    <el-table-column prop="os" label="操作系统" v-if="store.state.user.info.role !== 'admin'" show-overflow-tooltip></el-table-column>
    <el-table-column prop="screen" label="分辨率" v-if="store.state.user.info.role !== 'admin'"> </el-table-column>
    <el-table-column label="IP" v-if="store.state.user.info.role === 'admin'">
      <template v-slot="scope">
        <span class="gm" @click="openChaipip(scope.row.ip)">{{ scope.row.ip }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="store.state.user.info.role === 'admin'">
      <template #default="scope">
        <el-button size="small" type="danger" @click="deleteVisit(scope.row.id, $event)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div :class="[smallScreen ? 'smallScreen' : 'chart']">
    <div id="line"></div>
    <div id="cake"></div>
  </div>

  <div class="test" style="transform: translateY(96px); display: none"></div>
</template>

<style scoped lang="scss">
.test {
  position: absolute;
  top: 18px;
  left: 38px;
  width: 2px;
  height: 14px;
  border-radius: 2px;
  background: #3053ea;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.chart {
  margin-top: 32px;

  #line,
  #cake {
    width: 50%;
    height: 400px;
    float: left;
  }
}

.smallScreen {
  margin-top: 32px;

  #line,
  #cake {
    width: 100%;
    height: 400px;
  }
}
</style>
