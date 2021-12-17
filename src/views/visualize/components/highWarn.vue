<template>
  <div class="high-risk">
    <!-- <Title label="高发纠纷预警" /> -->
    <Titles class="title" label="高发纠纷地预警" />
    <div class="high-menu">
      <div class="high-menu-item" :class="type === 1 ? 'active':''" @click="selectMenu(1)">总量数据</div>
      <div class="high-menu-item" :class="type === 2 ? 'active':''" @click="selectMenu(2)">上升数据</div>
    </div>
    <div class="tip-tap">
      <div class="color-block type1" />
      <div class="color-label">10月</div>
      <div class="color-block type2" />
      <div class="color-label">11月</div>
      <div class="color-block type3" />
      <div class="color-label">12月</div>
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
      type: 1, // 1 总量数据 2上升数据
      symbol1: 'image://' + require('@/assets/visualize/highWarn1.png'),
      symbol2: 'image://' + require('@/assets/visualize/highWarn2.png'),
      symbol3: 'image://' + require('@/assets/visualize/highWarn3.png')
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
    init() {
      const myChart = echarts.init(this.$refs.echart)
      const court1 = [10, 20, 30]
      const court2 = [10, 20, 30]
      const court3 = [10, 20, 30]
      myChart.setOption({
        textStyle: {
          color: 'rgba(80,146,193,1)'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '18%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['xx街道', 'xx街道', 'xx街道'],
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
          name: '案件/件',
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
        series: [
          {
            name: '10月',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#37dee0',
              borderColor: '#37dee0 ',
              borderWidth: 2
            },
            data: court1
          },
          {
            name: '11月',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#22b2df',
              borderColor: '#22b2df ',
              borderWidth: 2
            },
            data: court2
          },
          {
            name: '12月',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#e08838',
              borderColor: '#e08838 ',
              borderWidth: 2
            },
            data: court3
          }
        ]
      })
    },
    selectMenu(index) {
      this.type = index
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
  // padding: 0 20px;
  .high-menu {
    margin-top: 10px;
    padding-left: 20px;
    display: flex;
    .high-menu-item {
      padding: 3px 10px;
      color: rgba(31, 158, 204, 1);
      cursor: pointer;
      &:first-child {
        margin-right: 5px;
      }
      &.active {
        color: #e2ebf1;
        border-bottom: 1px solid #00aeff;
      }
    }
  }
  .tip-tap {
    padding-right: 20px;
    position: absolute;
    top: 75px;
    right: 0px;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 12px;
    .color-block {
      width: 10px;
      height: 10px;
      margin-right: 5px;
      &.type1 {
        background-color: #37dee0;
      }
      &.type2 {
        background-color: #22b2df;
      }
      &.type3 {
        background-color: #e08838;
      }
    }
    .color-label {
      margin-right: 10px;
    }
  }
  .echart {
    width: 100%;
    margin-top: 15px;
    height: calc(100% - 110px);
  }
}
</style>
