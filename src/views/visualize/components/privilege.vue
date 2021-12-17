<template>
  <div class="privilege-wrapper">
    <Title class="privilege-title" label="万人成诉率" />
    <div class="tip">
      <label>同比去年</label>
      <Icon class="icon" :class="type === 0 ? 'down':'up'" :type="type === 0 ? 'caret-down':'caret-up'" />
      <label>2%</label>
    </div>
    <div ref="echart" class="echart-box" />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Title from './title.vue'
import { getCenterChar } from '@/api/visualize/index.js'
import * as echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  components: {
    Title,
    Icon
  },
  props: {

  },
  data() {
    return {
      list: [],
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
      const zxCount = this.list.map(item => item.caseNum)
      const month = this.list.map(item => item.month)
      const jfCount = [46, 11, 14, 35, 36, 17]
      console.log(echarts)
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        color: ['#2a80f1', '#ffffff', '#ff00ff', '#00ff00'],
        textStyle: {
          color: '#7efafc'
        },
        grid: {
          top: '5%',
          left: '3%',
          right: '4%',
          bottom: '3%',
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
              color: 'rgba(80,146,193,1)',
              fontSize: this.rm * 1.6
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
              color: 'rgba(80,146,193,1)',
              fontSize: this.rm * 1.6
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
            name: '',
            type: 'line',
            data: zxCount,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0,179,244,0.3)'
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
          }
        ]
      })
    },
    async getData() {
      const params = {
        courtCenter: this.getCourtName,
        year: '2021'
      }
      await getCenterChar(params).then(({ code, data }) => {
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
  .privilege-title {
    margin-left: 30px;
  }
  .tip {
    float: right;
    color: #fff;
    display: flex;
    align-items: center;
    overflow: hidden;
    font-size: 12px;
    height: 30px;
    .icon {
      margin: 0 10px;
      &.down {
        color: rgba(39,246,104,1);
      }
      &.up {
        color: red;
      }
    }
  }
  .echart-box {
    width: 100%;
    height: calc(100% - 70px);
    margin-top: 30px;
  }
}
</style>
