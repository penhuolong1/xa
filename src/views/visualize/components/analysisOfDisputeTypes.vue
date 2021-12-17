<template>
  <div class="box-img">
    <Titles class="title" label="纠纷类型分析" />
    <div class="tip-tap">
      <div class="item">
        <div class="color-block type1" />
        <div class="color-label">民间借贷解纷 <span class="fenbi">13.6%</span> </div>
      </div>
      <div class="item">
        <div class="color-block type2" />
        <div class="color-label">买卖合同纠纷<span class="fenbi">30.5%</span></div>
      </div>
      <div class="item">
        <div class="color-block type3" />
        <div class="color-label">离婚纠纷<span class="fenbi">20.6%</span></div>
      </div>
      <div class="item">
        <div class="color-block type4" />
        <div class="color-label">机动车交通事故责任纠纷<span class="fenbi">24.2%</span></div>
      </div>
      <div class="item">
        <div class="color-block type5" />
        <div class="color-label">侵害集体经济组织成员<br> 权益纠纷<span class="fenbi">21.9%</span></div>
      </div>
      <div class="item">
        <div class="color-block type6" />
        <div class="color-label">其他<span class="fenbi">41.9%</span></div>
      </div>

    </div>
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import Titles from './titles.vue'
import * as echarts from 'echarts'
export default {
  components: {
    Titles
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs.echart)
      var color = [
        '#488CF7',
        '#38CAFB',
        '#4CAFF9',
        '#4ADFCB',
        '#2AADF9',
        '#046EEB',
        '#00BDFC'
      ]

      var legend = [
        '民间借贷解纷',
        '买卖合同纠纷',
        '离婚纠纷',
        '机动车交通事故责任纠纷',
        '侵害集体经济组织成员权益纠纷',
        '其他'
      ]

      var seriesData = [
        { name: '民间借贷解纷', value: 13.6 },
        { name: '买卖合同纠纷', value: 30.5 },
        { name: '离婚纠纷', value: 23.6 },
        { name: '机动车交通事故责任纠纷', value: 24.2 },
        { name: '侵害集体经济组织成员权益纠纷', value: 21.9 },
        { name: '其他', value: 41.9 }
      ]

      var option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: color,
        grid: {
          left: '10%',
          containLabel: true
        },
        // legend: {
        //   orient: 'vertical',
        //   top: 'center',
        //   left: '40%',
        //   textStyle: {
        //     align: 'left',
        //     verticalAlign: 'middle',
        //     rich: {
        //       name: {
        //         color: 'rgba(255,255,255,.8)',
        //         fontSize: 14
        //       },
        //       value: {
        //         color: 'rgba(255,255,255,.8)',
        //         fontSize: 14
        //       },
        //       rate: {
        //         color: 'rgba(0, 189, 252, .8)',
        //         fontSize: 14
        //       }
        //     }
        //   },
        //   data: legend,
        //   formatter: (name) => {
        //     if (seriesData.length) {
        //       const item = seriesData.filter((item) => item.name === name)[0]
        //       return `{name|${name}：} {rate| ${item.value}%}`
        //     }
        //     // if (name.indexOf('\n') == -1) {
        //     //   return name
        //     // } else {
        //     //   return `{value|${name.split('\n')[0]}\n${name.split('\n')[1]}}`
        //     // }
        //   }
        // },
        series: [
          {
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['25%', '45%'],
            hoverAnimation: true,

            label: {
              show: false
            },

            data: seriesData
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.box-img {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/images/visualization/disputeTrend1/frame.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 15px 0 10px;
}
.tip-tap {
  position: absolute;
  top: 115px;
  right: 20px;
  align-items: center;
  color: #fff;
  font-size: 12px;
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .color-block {
    width: 10px;
    height: 10px;
    margin-right: 5px;
    &.type1 {
      background-color: #488cf7;
    }
    &.type2 {
      background-color: #37cafb;
    }
    &.type3 {
      background-color: #4caff9;
    }
    &.type4 {
      background-color: #4adfcb;
    }
    &.type5 {
      background-color: #2aadf9;
    }
    &.type6 {
      background-color: #046eeb;
    }
  }
  .color-label {
    width: 180px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    .fenbi {
      color: #fec752;
    }
  }
}
.echart {
  width: 100%;
  height: calc(100% - 77px);
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

