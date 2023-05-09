<script setup>
import { onBeforeMount, ref, watch } from "vue";
import axios from "axios";
const props = defineProps({
  code: String,
  size: Number,
  tooltip: {
    type: Boolean,
    default: true,
  },
  color: String,
});
const viewBox = ref("0 0 24 24");
const color = ref("");
const name = ref("");
const contentSvg = ref("");
onBeforeMount(() =>
{
  getUrl();
});
watch(
  () => props.code,
  () => getUrl()
);
const getUrl = () =>
{
  axios
    .get("/ache/icon/get-icon", { params: { code: props.code } })
    .then((rst) =>
    {
      const content = rst.data[0].xml;
      viewBox.value = getString(content, 'viewBox="', '"') || "0 0 24 24";
      color.value = props.color
        ? props.color
        : getString(content, 'fill="', '"');
      name.value = rst.data[0].name;
      contentSvg.value = getString(
        content,
        "<svg" + getString(content, "<svg", ">") + ">",
        "</svg>"
      );
    });
};
const getString = (str, start, end) =>
{
  if (str.split(start)[1]) return str.split(start)[1].split(end)[0];
  else return "";
};
</script>

<template>
  <i>
    <svg :viewBox="viewBox" :fill="color" v-html="contentSvg" :style="{ width: `${props.size ? props.size : '16px'}` }" />
  </i>
</template>
<style lang="scss" scoped>
svg {
  vertical-align: -6%;
}
</style>
