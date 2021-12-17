<template>
  <div class="privilege-wrapper">
    <Title label="纠纷趋势" />
    <div ref="echart" class="echart-box" />
  </div>
</template>

<script>
import Title from './title.vue'
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getDisputeNum } from '@/api/visualize/index.js'

export default {
  components: {
    Title
  },
  props: {

  },
  data() {
    return {
      type: 0 // 0下降 1上升
    }
  },
  computed: {
    ...mapGetters(['getCourtName'])
  },
  watch: {
    getCourtName() {
      this.init()
    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getData()
      const zxCount = this.list.map(item => item.sl)
      const month = this.list.map(item => item.month)
      const jfCount = this.list.map(item => item.hj)
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        color: ['#2a80f1', '#ffffff', '#ff00ff', '#00ff00'],
        textStyle: {
          color: '#7efafc'
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          textStyle: {
            fontSize: this.rm * 1.3
          }
        },
        xAxis: {
          data: month,
          // 坐标轴
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#3eb2e8'
            }
          },
          // 坐标值标注
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#fff',
              fontSize: 14
            }
          }
        },
        yAxis: {
        // 坐标轴
          axisLine: {
            show: false
          },
          // 坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 14
            }
          },
          // 分格线
          splitLine: {
            lineStyle: {
              color: 'rgba(101,198,231,0.2)'
            }
          }
        },
        legend: {
          data: ['咨询', '纠纷'],
          textStyle: {
            color: '#7efafc'
          }
        },
        series: [
          {
            name: '受理',
            type: 'line',
            data: zxCount,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(107,150,255,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(0,179,244,0)'
                }
                ], false),
                shadowColor: 'rgba(0,179,244, 0.9)',
                shadowBlur: 20
              }
            }
          },
          {
            name: '化解',
            type: 'line',
            data: jfCount,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(107,150,255,0.7)'
                },
                {
                  offset: 1,
                  color: 'rgba(107,150,255,0)'
                }
                ], false),
                shadowColor: 'rgba(107,150,255,0.7)',
                shadowBlur: 20
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(107,150,255,1)'
              }
            }
          }
        ]
      })
    },
    async getData() {
      const params = {
        courtCenter: this.getCourtName,
        year: 2021
      }
      await getDisputeNum(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.privilege-wrapper {
  height: 100%;
  .echart-box {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>
