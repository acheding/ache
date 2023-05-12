<script setup>
import Main from '../components/main/view/main.vue'
import Small from '../components/main/view/small.vue'

const props = defineProps({
  smallScreen: Boolean,
})
</script>

<template>
  <!-- smallScreen给添加句子的button用 -->
  <Main v-if="!smallScreen" :smallScreen="smallScreen"></Main>
  <Small v-else :smallScreen="smallScreen"></Small>
</template>

<style scoped lang="scss"></style>
