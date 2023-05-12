<script setup>
import Calendar from '../calendar/index.vue'
import Collapse from '../collapse/index.vue'

const props = defineProps({
  smallScreen: Boolean,
})
</script>

<template>
  <div style="padding: 16px">
    <Calendar></Calendar>
    <Collapse :smallScreen="smallScreen"></Collapse>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-calendar) {
  margin-bottom: 16px;
}
</style>
