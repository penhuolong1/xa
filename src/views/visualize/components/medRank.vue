<template>
  <div>
    <Title title="调解员排行榜" />
    <div class="echart-box">
      <BarChart class="echart" :echarts-data="echartsData" />
    </div>
  </div>
</template>

<script>
import Title from './title2.vue'
import BarChart from './barChart.vue'
export default {
  components: {
    Title,
    BarChart
  },
  props: {

  },
  data() {
    return {
      echartsData: {
        yAxis: ['调解员', '调解员', '调解员', '调解员', '调解员'],
        rate: ['80%', '80%', '80%', '80%', '80%'],
        data1: [500, 500, 500, 500, 500],
        data2: [300, 300, 300, 300, 300]
      }
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
.wrapper {
  width: 100%;
  .echart-box {
    padding-top: 10px;
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
