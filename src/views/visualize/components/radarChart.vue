<template>
  <div class="radar-chart">
    <Title :label="title" class="title" />
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import Title from './title.vue'
import { getStreetNum } from '@/api/visualize/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Title
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1 // 1街道/镇化解案件数量/件 2街道/镇化解成功率/%
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
      // const data1 = [
      //   { 'name': '民安街道', 'max': '100' },
      //   { 'name': '马港街道', 'max': '100' },
      //   { 'name': '香山街道', 'max': '100' },
      //   { 'name': '金海街道', 'max': '100' },
      //   { 'name': '凤翔街道', 'max': '100' },
      //   { 'name': '新店街道', 'max': '100' }
      // ]
      const data1 = this.list.map(item => {
        return {
          name: item.streetName,
          max: 100
        }
      })
      let value = []
      if (this.type === 1) {
        value = this.list.map(item => {
          return Number(item.hj)
        })
      } else {
        value = this.list.map(item => {
          return Number(item.hjNum)
        })
      }
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        tooltip: {
        },
        radar: {
          radius: '80%', // 大小
          nameGap: 1, // 图中工艺等字距离图的距离
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
            show: false,
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
              color: 'rgb(25, 93, 170)' // 设置网格的颜色
            }
          }
        },

        series: [
          {
            name: '',
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
                symbolSize: 10,
                value: value,
                areaStyle: { color: 'rgba(23, 53, 119,0.8)' },
                itemStyle: {
                  normal: {
                    borderWidth: 0.5,
                    color: '#fff',
                    borderColor: 'rgba(103, 149, 254,1)'
                  }
                },
                lineStyle: {
                  show: false,
                  color: 'rgba(23, 53, 119,0.8)',
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
      await getStreetNum(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.radar-chart {
  margin-top: 30px;
  width: 100%;
  height: 100%;
}
.echart {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
