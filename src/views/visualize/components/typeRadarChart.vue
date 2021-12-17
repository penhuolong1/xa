<template>
  <div class="radar-chart">
    <Title :label="title" />
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import Title from './title.vue'
import { mapGetters } from 'vuex'
import { getMediaterType } from '@/api/visualize/index.js'
export default {
  components: {
    Title
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
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
      const data1 = this.list
      const value = this.list.map(item => item.value)
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        tooltip: {
          show: false
        },
        radar: {
          radius: '80%', // 大小
          nameGap: 1, // 图中工艺等字距离图的距离
          shape: 'circle',
          center: ['50%', '50%'], // 图的位置
          name: {
            textStyle: {
              color: '#fff',
              fontSize: 12
            },
            formatter: function(name) {
              return name
            }
          },
          indicator: data1,
          axisLine: {
            lineStyle: {
              color: 'rgba(153, 209, 246, 0.2)'
            }
          },
          splitArea: {
            show: false,
            areaStyle: {
              color: 'rgba(255,0,0,0)' // 图表背景的颜色
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'rgba(153, 209, 246, 0.2)' // 设置网格的颜色
            }
          }
        },

        series: [
          {
            name: '报警类型分析',
            type: 'radar',
            symbol: 'angle',
            itemStyle: {
              normal: {
                areaStyle: { type: 'default' }
              }
            },
            data: [
              {
                symbol: 'circle',
                symbolSize: 1,
                value: value,
                areaStyle: { color: 'rgba(71,234,248,0.4)' },
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    color: 'rgba(71,234,248,1)',
                    borderColor: 'rgba(71,234,248,1)'
                  }
                },
                lineStyle: {
                  color: 'rgba(146, 225, 255, 1)',
                  width: 1
                }
              }
            ]
          }
        ]
      })
    },
    async getData() {
      const params = {
        courtCenter: this.getCourtName,
        startDate: '2021-01-01 00:00:00',
        endDate: '2021-08-01 00:00:00'
      }
      await getMediaterType(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              name: `${item.mtype}(${item.mtyepeNum})`,
              value: item.mtyepeNum,
              max: 500
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.radar-chart {
  margin-top: 30px;
}
.echart {
  width: 100%;
  height: 170px;
}
</style>
