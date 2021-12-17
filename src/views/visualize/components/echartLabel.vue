<template>
  <div class="echart-label">
    <li v-for="(item, index) in list" :key="index" class="echart-label-item">
      <div :style="'background-color:'+item.color" class="block" />
      <div class="label">{{ item.name }}</div>
    </li>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.echart-label {
  display: inline-block;
  .echart-label-item {
    display: inline-block;
    margin-left: 10px;
  }
  .block {
    display: inline-block;
    width: 16px;
    height: 8px;
    margin-right: 5px;
  }
  .label {
    display: inline-block;
    font-size: 12px;
  }
  color: #ACB6B9;
}
</style>
