<template>
  <div style="width: 100%; height: 100%;">
    <EchartLabel class="label-box" style="float: right;" :list="labelList" />
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import EchartLabel from './echartLabel.vue'

export default {
  components: {
    EchartLabel
  },
  props: {
    echartsData: {
      type: Object,
      default: () => {}
    }
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
          right: '10%',
          bottom: '0px',
          containLabel: true
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
            data: this.echartsData.yAxis,
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
            data: this.echartsData.rate
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
            data: this.echartsData.data1
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
            data: this.echartsData.data2
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }

}
</script>

<style lang="less" scoped>
.echart {
  width: 100%;
  height: 100%;
}
.label-box {
  position: relative;
  top: 5px;
}
</style>
