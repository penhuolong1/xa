<template>
  <div class="info-wrapper">
    <ul class="btn-wrapper">
      <li :class="active === 1 ? 'active':''" @click="getMenu(1)">案件信息</li>
      <!-- <li :class="active === 2 ? 'active':''" @click="getMenu(2)">工作区域</li> -->
    </ul>
    <Info v-show="active === 1" />
    <!-- <Work v-show="active === 2" /> -->
  </div>
</template>

<script>
import Info from './info.vue'
import Work from './work1.vue'
export default {
  components: {
    Info,
    Work
  },
  props: {},
  data() {
    return {
      active: 1
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getMenu(index) {
      this.active = index
    }
  }
}
</script>
<style lang="less" scoped>
.info-wrapper {
  padding: 10px 20px;
  width: 100%;
  height: 100%;
  background: #f9f9fa;
  .btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      flex: 1;
      height: 45px;
      cursor: pointer;
      border-radius: 5px;
      color: #9597A6;
      font-size: 16px;
      &.active {
        background-color: @theme-color;
        color: #fff;
      }
      #center()
    }
  }
}
</style>
