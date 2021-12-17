<template>
  <div class="high-risk">
    <!-- <Title label="纠纷高发地预警" /> -->
    <Titles class="title" label="纠纷高发地预警" />
    <div class="high-menu">
      <div class="high-menu-item" :class="type === 1 ? 'active':''" @click="selectMenu(1)">街道</div>
      <div class="high-menu-item" :class="type === 2 ? 'active':''" @click="selectMenu(2)">社区</div>
    </div>
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import Title from './title.vue'
import Titles from './titles.vue'
import * as echarts from 'echarts'
import { Icon } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import {
  getDisputeSCommunity,
  getDisputeStreet
} from '@/api/visualize/index.js'
export default {
  components: {
    Title,
    Titles,
    Icon
  },
  props: {},
  data() {
    return {
      list: [],
      type: 1, // 1街道 2社区
      color: ['#005b56', '#008e86', '#00c1b5', '#00f4e5', '#28fff2', '#8efff8']
    }
  },
  computed: {
    ...mapGetters(['getCourtName'])
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getData()
      const list = [
        {
          name: '莲前街道',
          value: 500
        },
        {
          name: '蔡塘街道',
          value: 200
        },
        {
          name: '江头街道',
          value: 180
        },
        {
          name: '江头街道',
          value: 100
        },
        {
          name: '江头街道',
          value: 30
        }
      ]
      const yName = list.map((item) => item.name)
      const xData = list.map((item) => item.value)
      const barWidth = 18
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        xAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        grid: {
          containLabel: true,
          left: 20,
          top: 10,
          right: 120,
          bottom: 0
        },
        yAxis: [
          {
            inverse: true,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                fontSize: 14,
                color: '#fff'
              }
            },
            data: yName
          }
        ],
        series: [
          {
            // 内
            name: '莲前街道',
            type: 'bar',
            barWidth,
            legendHoverLink: false,
            symbolRepeat: true,
            silent: true,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    'rgba(0,228,255)',
                    '#0097fe',
                    '#FEAB52',
                    '#F96522',
                    'rgba(30, 187, 162)'
                  ]
                  return colorList[params.dataIndex]
                }
              }
              //   color: {
              //     type: 'linear',
              //     colorStops: [//渐变
              //       //   {
              //       //     offset: 0,
              //       //     color: '#00abee' // 0% 处的颜色
              //       //   },
              //       {
              //         offset: 1,
              //         color: '#62E6F6' // 100% 处的颜色
              //       }
              //     ]
              //   }
            },
            data: list,
            z: 1,
            animationEasing: 'elasticOut'
          },
          {
            // 背景
            type: 'pictorialBar',
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '0%',
            symbol: 'roundRect',
            symbolSize: [0.1, barWidth],
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    'rgba(0,228,255,0.1)',
                    'rgba(0, 151, 254, 0.1)',
                    'rgba(254,171,82, 0.1)',
                    'rgba(249,101,34, 0.1)',
                    'rgba(30, 187, 162, 0.1)'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                offset: [0, 2],
                distance: 20,
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                },
                formatter: function(a, b) {
                  return `${a.value}/500件`
                }
              }
            },
            data: xData,
            z: 0,
            animationEasing: 'elasticOut'
          }
        ]
      })
    },
    selectMenu(index) {
      this.type = index
    },
    async getData() {
      const params = {
        courtName: '翔安区人民法院',
        year: 2021
      }
      if (this.type === 1) {
        await getDisputeStreet(params).then(({ code, data }) => {
          if (code === 200) {
            this.list = data[0]
          }
        })
      } else {
        await getDisputeSCommunity(params).then(({ code, data }) => {
          if (code === 200) {
            this.list = data[0]
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin-top: 15px;
}
.high-risk {
  position: relative;
  background: url('../../../assets/visualize/bg9.png') no-repeat;
  background-size: 100% 100%;
  .high-menu {
    margin-top: 10px;
    display: flex;
    padding-left: 20px;

    .high-menu-item {
      padding: 3px 10px;
      color: rgba(31, 158, 204, 1);
      //   background: rgba(0, 174, 255, 0.06);
      //   border: 1px solid rgba(0, 174, 255, 0.3);
      cursor: pointer;
      &:first-child {
        margin-right: 5px;
      }
      &.active {
        color: #e2ebf1;
        // background: rgba(0, 174, 255, 0.2);
        border-bottom: 1px solid #00aeff;
      }
    }
  }

  .echart {
    width: 100%;
    height: calc(100% - 100px);
  }
}
</style>
