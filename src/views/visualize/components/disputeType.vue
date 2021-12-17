<template>
  <div class="privilege-wrapper">
    <Title label="纠纷类型分析" />
    <div ref="echart" class="echart-box" />
  </div>
</template>

<script>
import Title from './title.vue'
import * as echarts from 'echarts'
import { getDispute } from '@/api/visualize/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Title
  },
  props: {

  },
  data() {
    return {
      type: 0, // 0下降 1上升
      list: []
    }
  },
  computed: {
    ...mapGetters(['getCourtName'])
  },
  getCourtName: {
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
      const colorList = [
        {
          itemStyle: {
            'color': new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(11,112,123,1)'
            },
            {
              offset: 1,
              color: 'rgba(55,232,252,1)'
            }
            ], false)
          }
        },
        {
          itemStyle: {
            'color': new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0,89,114,1)'
            },
            {
              offset: 1,
              color: 'rgba(0,201,255,1)'
            }
            ], false)
          }
        },
        {
          itemStyle: {
            'color': new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(29,95,158,1)'
            },
            {
              offset: 1,
              color: 'rgba(45,153,255,1)'
            }
            ], false)
          }
        },
        {
          itemStyle: {
            'color': new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0,79,151,1)'
            },
            {
              offset: 1,
              color: 'rgba(1,134,255,1)'
            }
            ], false)
          }
        },
        {
          itemStyle: {
            'color': 'rgba(0,101,255,1)'
          }
        },
        {
          itemStyle: {
            'color': 'rgba(0, 62, 163,1)'
          }
        },
        {
          itemStyle: {
            'color': 'rgba(0, 62, 163,1)'
          }
        }
      ]
      const data = this.list.map((item, index) => {
        console.log(colorList[index])
        return {
          value: item.disNum,
          name: item.disType,
          itemStyle: colorList[index].itemStyle
        }
      }).sort(function(a, b) { return a.value - b.value })
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({

        tooltip: {
          trigger: 'item'
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '纠纷类型分析',
            type: 'pie',
            roseType: 'radius',
            radius: '90%',
            center: ['50%', '50%'],
            data: data,
            label: {
              color: '#eaeaf0'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          }
        ]
      })
    },
    async getData() {
      const params = {
        courtCenter: this.getCourtName,
        // year: 2021
        startDate: '2021-01-01',
        endDate: '2021-09-01'
      }
      await getDispute(params).then(({ code, data }) => {
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
