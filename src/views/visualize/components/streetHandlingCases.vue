<template>
  <div class="box-img">
    <div class="title">
      <div class="title-img">
        <div class="work-effectiveness">街道办理案件</div>
      </div>
    </div>
    <EchartLabel class="label-box" style="float: right;" :list="labelList" />
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import EchartLabel from './echartLabel.vue'
import * as echarts from 'echarts'
export default {
  components: {
    EchartLabel
  },
  data() {
    return {
      labelList: [
        {
          color: '#2285FF',
          name: '受理'
        },
        {
          color: '#2CFFFD',
          name: '化解'
        },
        {
          color: '#FEC752',
          name: '调解率'
        }
      ]
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs.echart)
      const option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '40px',
          left: '20px',
          right: '65px',
          bottom: '20px',
          containLabel: true
        },
        legend: {
          show: false,
          align: 'left',
          right: '10%',
          type: 'plain',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          // icon:'rect',
          itemGap: 20,
          itemWidth: 15,
          itemHeight: 10,
          icon: 'path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z'
        },
        xAxis: {
          show: true,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(48, 98, 105, 0.2)'
            }
          },
          axisLabel: {
            color: '#ACB6B9',
            margin: 20,
            rich: {
              value: {
                lineHeight: 0,
                align: 'center'
              }
            }
          }
        },
        yAxis: [
          {
            type: 'category',
            axisLine: {
              show: false
            },
            data: ['莲前街道', '莲前街道', '莲前街道', '莲前街道', '莲前街道', '莲前街道', '莲前街道', '莲前街道'],
            axisLabel: {
              color: '#CCCCCC',
              margin: 20,
              rich: {
                value: {
                  lineHeight: 0,
                  align: 'center'
                }
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            offset: 40,
            axisLabel: {
              fontFamily: 'Source Han Sans CN',
              textStyle: {
                color: '#FFBF52',
                fontFamily: 'Source Han Sans CN',
                fontSize: '16'
              }
            },
            data: ['30%', '30%', '30%', '30%', '30%', '30%', '30%', '30%']
          }
        ],
        series: [
          {
            name: '受理',
            type: 'bar',
            barWidth: 8,
            label: {
              position: 'right',
              show: true,
              color: '#3EFFE8',
              formatter: '{c}'
            },
            barGap: '60%', // 多个并排柱子设置柱子之间的间距
            itemStyle: {
              color: '#0097FE',
              borderColor: '#0097FE ',
              borderWidth: 2
            },
            data: [500, 500, 500, 500, 500, 500, 500, 500]
          },
          {
            name: '化解',
            type: 'bar',
            barGap: '60%',
            barWidth: 8,

            label: {
              position: 'right',
              show: true,
              formatter: '{c}',
              color: '#3EFFE8'
            },
            itemStyle: {
              color: '#00E4FF',
              borderColor: '#00E4FF ',
              borderWidth: 2
            },
            data: [300, 300, 300, 300, 300, 300, 300, 300]
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
  width: 100%;
  height: 100%;
  background-image: url("../../../assets/images/visualization/streethandlinghases/frame.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  //   background-position: 0 -20px;
}
.title {
  padding: 15px;
  padding-bottom: 20px;
  .title-img {
    width: 100%;
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
  width: 100%;
  height: calc(100% - 77px);
}
.label-box {
  float: right;
  padding: 0 20px;
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
  align-items: center;
}
</style>
