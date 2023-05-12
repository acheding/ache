<script setup>
const props = defineProps({
  smallScreen: Boolean,
})
</script>
<template>
  <div class="container" :class="{ smallScreen: smallScreen }">
    <div id="switch" class="switched">
      <div class="circle"></div>
    </div>
    <div class="main">
      <div class="sun">
        <span style="--i: 1"></span>
        <span style="--i: 2"></span>
        <span style="--i: 3"></span>
        <span style="--i: 4"></span>
        <span style="--i: 5"></span>
        <span style="--i: 6"></span>
        <span style="--i: 7"></span>
        <span style="--i: 8"></span>
      </div>

      <div class="mountain a"></div>
      <div class="mountain b"></div>
      <div class="mountain c"></div>
      <div class="mountain d"></div>
      <div class="mountain e"></div>

      <div class="cloud_wind_wrap_slow">
        <div class="cloud_wind_wrap_fast">
          <div class="cloud_wind_group" style="--i: 1">
            <div class="cloud a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud c">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind_small">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="cloud_wind_group" style="--i: 2">
            <div class="cloud a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud c">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind_small">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="cloud_wind_group" style="--i: 3">
            <div class="cloud a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="cloud c">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind a">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind b">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="wind_small">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="tree_wrap">
        <div class="tree">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="windmill_wrap">
        <div class="windmill">
          <div class="pole"></div>
          <div class="head">
            <div class="fan">
              <span style="--i: 1"></span>
              <span style="--i: 2"></span>
              <span style="--i: 3"></span>
            </div>
          </div>
        </div>
        <div class="windmill left">
          <div class="pole"></div>
          <div class="head">
            <div class="fan">
              <span style="--i: 1"></span>
              <span style="--i: 2"></span>
              <span style="--i: 3"></span>
            </div>
          </div>
        </div>
        <div class="windmill right">
          <div class="pole"></div>
          <div class="head">
            <div class="fan">
              <span style="--i: 1"></span>
              <span style="--i: 2"></span>
              <span style="--i: 3"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import animation from '../js/animation'

export default {
  mounted() {
    animation.exchange()
  },
}
</script>

<style scoped>
@import '../style/animation.css';
</style>
