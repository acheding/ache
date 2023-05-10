<script setup>
import axios from "axios";
import { computed, onMounted, reactive, ref, nextTick, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const store = useStore()

const state = reactive({
  schedules: [],
  showDialog: false,
  dialogTitle: "",
  dialogMode: "",
  showOperation: true,
  exchangeArr: [],
});

const form = ref(null);
const formKey = ref(0);

onMounted(() =>
{
  updateSchedules();
});

watch(
  () => store.state.user.info,
  () =>
  {
    updateSchedules();
    state.exchangeArr = [];
  }
);

const updateSchedules = async () =>
{
  let res = await axios.get("/ache/calendar/get-calendar");
  state.schedules = res.data;
};

const getSchedules = computed(() =>
{
  return function (data)
  {
    let theDay = [];
    state.schedules.find((item) =>
    {
      if (item.date === data.day) {
        theDay.push(item);
      }
    });
    return theDay;
  };
});

const operateSchedule = (mode) =>
{
  form.value.validate(async (valid, fields) =>
  {
    if (valid) {
      mode === "add"
        ? await axios.post("/ache/calendar/add-calendar", aSchedule.value)
        : await axios.put("/ache/calendar/edit-calendar", aSchedule.value);
      updateSchedules();
      state.showDialog = false;
    }
  });
};
const aSchedule = ref({
  date: "",
  event: "",
  completed: 0,
});
const deleteSchedule = async (id) =>
{
  await axios.delete("/ache/calendar/delete-calendar", { params: { id: parseInt(id) } });
  updateSchedules();
};

const displayDialog = (title, mode, data) =>
{
  state.dialogTitle = title;
  state.dialogMode = mode;
  if (mode === "add") {
    aSchedule.value = {
      date: "",
      event: "",
      completed: 0,
    };
    nextTick(() =>
    {
      if (form.value) {
        form.value.resetFields();
      }
    });
    formKey.value++;
  } else {
    aSchedule.value = data;
  }
  state.showDialog = true;
};

const rules = reactive({
  date: [{ required: true, message: "请选择日期", trigger: ["blur"] }],
  event: [
    { required: true, message: "请输入待办事件", trigger: ["blur", "change"] },
  ],
});

const exchange = async (item) =>
{
  state.exchangeArr.push(item.id);
  if (state.exchangeArr.length === 1) {
    ElMessage({
      message: "当前选择事件：" + item.event,
    });
  } else if (state.exchangeArr.length === 2) {
    ElMessage({
      message: "与之交换的事件" + item.event,
    });
    await axios.put("/ache/calendar/exchange-calendar", {
      id1: state.exchangeArr[0],
      id2: state.exchangeArr[1],
    });
    ElMessage({
      type: "success",
      message: "位置交换成功！",
    });
    updateSchedules();
    state.exchangeArr = [];
  }
};

const tip = ref('①未登录只能创建公共访客事件，登录之后才可创建账号的单独日程。②点击两个事件可交换顺序，但只可交换当天事件。③点击隐藏按钮可隐藏操作按钮，再次点击此位置可重新显示。');
</script>

<template>
  <div class="addBtn">
    <div class="gm" v-if="state.showOperation" @click="displayDialog('添加日程', 'add')">
      添加日程
    </div>
    <el-tooltip :content="tip" placement="top-start" effect="light">
      <ICON code="about" />
    </el-tooltip>
  </div>

  <div class="switch gm" :style="[state.showOperation ? 'opacity:1' : '']"
    @click="state.showOperation = !state.showOperation">
    隐藏操作
  </div>
  <el-calendar v-model="state.value"><template #date-cell="{ data }">
      <el-popover placement="top-start" trigger="click" v-if="getSchedules(data).length" width="auto">
        <li v-for="item in getSchedules(data)">
          <span style="cursor: pointer" :style="[
            item.completed === 200
              ? 'color:red'
              : item.completed === 100
                ? 'color:#5cb87a'
                : item.completed >= 60
                  ? 'color:#6f7ad3'
                  : item.completed >= 40
                    ? 'color:#e6a23c'
                    : item.completed >= 20
                      ? 'color:#f56c6c'
                      : 'color:#909399',
          ]" @click="exchange(item)">{{ item.event }}</span><span class="gm" style="float: right"
            v-show="state.showOperation" @click="deleteSchedule(item.id)">delete</span><span class="gm"
            style="margin: 0 8px; float: right" v-show="state.showOperation"
            @click="displayDialog('编辑日程', 'edit', item)">edit</span><span v-if="item.completed" style="margin-left: 8px">
            —{{ item.completed }}%</span>
        </li>
        <template #reference>
          <div class="hasSchedules">
            {{ data.day.split("-").slice(2).join("") }}
          </div>
        </template>
      </el-popover>
      <div v-else>
        {{ data.day.split("-").slice(2).join("") }}
      </div>
    </template></el-calendar>

  <el-dialog v-model="state.showDialog" class="my-dialog general">
    <template #header>
      <span>{{ state.dialogTitle }}</span>
    </template>
    <el-form :model="aSchedule" ref="form" :rules="rules" :key="formKey" :label-width="52">
      <el-form-item label="日期" prop="date">
        <el-date-picker :editable="false" v-model="aSchedule.date" type="date" placeholder="选择日期" format="YYYY/MM/DD"
          value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="事件" prop="event">
        <el-input type="textarea" :rows="2" v-model="aSchedule.event" maxlength="222" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="进度" prop="completed">
        <el-slider style="margin: 1px 0 1px 5px" v-model="aSchedule.completed" :step="10" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="operateSchedule(state.dialogMode)">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.el-calendar {
  --el-calendar-header-border-bottom: transparent;

  :deep(.el-calendar__header) {
    flex-direction: column;
    height: 56px;
    padding: 0;
  }

  :deep(.el-calendar__body) {
    padding: 0;

    .el-calendar-day {
      height: 56px;

      div {
        height: 100%;
        width: 100%;
        line-height: 40px; // 或者通过行高来使元素垂直居中避免使用flex
        // display: flex; // 加个span就可以避免父元素flex导致的伪元素不同机型不统一问题
        // justify-content: center;
        // align-items: center;
      }

      .hasSchedules::before {
        content: "";
        position: absolute;
        width: 18px;
        height: 2px;
        background: #409eff;
        margin-top: 36px;
        // margin-top: 28px;
        margin-left: 0;
      }
    }
  }
}

.addBtn {
  position: absolute;
  display: flex;

  i {
    margin-left: 5px;
    margin-top: 2px;
    cursor: pointer;

    &:hover {
      color: orangered;
    }
  }
}

.switch {
  position: absolute;
  right: 16px;
  opacity: 0;
}
</style>
