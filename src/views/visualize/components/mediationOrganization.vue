<template>
  <div class="box-img">
    <div class="title">
      <div class="title-img">
        <div class="work-effectiveness">{{ title }}</div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs.echart)
      const option = {

      }

      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.box-img {
  width: 100%;
  height: 100%;
  background-image: url("../../../assets/images/visualization/mediationOrganization/frame.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //   background-position: 0 -20px;
}
.title {
  padding: 15px;
  display: flex;
  justify-content: center;
  .title-img {
    width: 432px;
    height: 42px;
    background-image: url("../../../assets/images/visualization/workeffectiveness/title.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .work-effectiveness {
    display: flex;
    justify-content: center;
    align-items: center;
      margin: auto;
      padding: 5px 0;
      color: #fff;
      font-weight: Bold;
      font-size: 20px;
    }
  }
}

.echart {
  width:461px;
  height: 350px;
}

// 布局
// 横-左右
.flex-center-around {
  display: flex;
  justify-content: space-around;
}
// 竖
.flex-column {
  display: flex;
  flex-direction: column;
}
</style>
