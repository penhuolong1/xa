<template>
  <div class="wrapper">
    <Title label="调解组织" num="120" unit="个" />
    <div class="echart-box">
      <RadarChart />
    </div>
  </div>
</template>

<script>
import Title from './title1.vue'
import RadarChart from './radarChart1.vue'

export default {
  components: {
    Title,
    RadarChart
  },
  props: {

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
.wrapper {
  width: 100%;
  .echart-box {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
