<template>
  <div class="high-risk">
    <!-- <Title label="纠纷高发地预警" /> -->
    <Titles class="title" label="重点领域纠纷预警" />
    <Select v-model="val" class="high-menu" placeholder="请选择">
      <SelectOption v-for="(item, index) in list" :key="index" :value="item.value">{{ item.name }}</SelectOption>
    </Select>
    <div class="tip-tap">
      <div class="color-block type1" />
      <div class="color-label">同比去年</div>
      <div class="color-block type2" />
      <div class="color-label">案件数</div>
    </div>
    <div ref="echart" class="echart" />
  </div>
</template>

<script>
import Title from './title.vue'
import Titles from './titles.vue'
import * as echarts from 'echarts'
import { Select } from 'ant-design-vue'
export default {
  components: {
    Title,
    Titles,
    Select,
    SelectOption: Select.Option
  },
  props: {},
  data() {
    return {
      type: 0, // 0下降 1上升
      symbol1: 'image://' + require('@/assets/visualize/areaLineTop.png'),
      symbol2: 'image://' + require('@/assets/visualize/areaLineContent.png'),
      list: [
        {
          value: '建设工程合同纠纷',
          name: '建设工程合同纠纷'
        },
        {
          value: '2',
          name: '1'
        }
      ],
      val: '建设工程合同纠纷'
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const zxCount = [9, 12, 34, 25, 16, 7]
      const month = ['1月', '2月', '3月', '4月', '5月', '6月']
      const jfCount = [46, 11, 14, 35, 36, 17]
      console.log(echarts)
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        color: ['#2a80f1', '#ffffff', '#ff00ff', '#00ff00'],
        textStyle: {
          color: 'rgba(80,146,193,1)'
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '5%',
          bottom: '0',
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
            fontSize: 14
          }
        },
        xAxis: {
          data: month,
          // 坐标轴
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
        yAxis: [
          {
            // 坐标轴
            name: '案件/件',
            color: 'rgba(80,146,193,1)',
            type: 'value',
            axisLine: {
              show: false
            },
            // 坐标值标注
            axisLabel: {
              show: true,
              textStyle: {
                // color: 'rgba(80,146,193,1)',
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
          {
            // 坐标轴
            name: '同比去年%',
            type: 'value',
            min: -50,
            max: 50,
            interval: 20,
            axisLine: {
              show: false
            },
            // 坐标值标注
            axisLabel: {
              show: true,
              textStyle: {
                // color: 'rgba(80,146,193,1)',
                fontSize: 14
              }
            },
            // 分格线
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(101,198,231,0.2)'
              }
            }
          }
        ],
        series: [
          {
            name: '同比去年',
            type: 'line',
            data: zxCount,
            symbol: 'circle',
            symbolSize: 0,
            smooth: true, // 线变曲线
            showAllSymbol: true,
            areaStyle: {
              // 区域填充样式
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(25,163,223,.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(25,163,223, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(30,187,162, 0.5)', // 阴影颜色
                shadowBlur: 50 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            lineStyle: {
              normal: {
                width: 3,
                color: 'rgba(30,187,162,1)' // 线条颜色
              },
              borderColor: 'rgba(0,0,0,.4)'
            },
            itemStyle: {
              color: 'rgba(30,187,162,1)',
              borderColor: '#646ace',
              borderWidth: 2
            }
          },
          {
            name: '案件数',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#0097fe',
              borderColor: '#0097fe',
              borderWidth: 2
            },
            data: jfCount
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin-top: 15px;
}
.tip-tap {
  position: absolute;
  top: 65px;
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
      background-color: #1ebba2;
    }
    &.type2 {
      background-color: #0097fe;
    }
  }
  .color-label {
    margin-right: 20px;
  }
}
.high-risk {
  background: url('../../../assets/visualize/bg9.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .high-menu {
    padding-left: 4px;
    // position: absolute;
    display: flex;
    // right: 0px;
    top: 5px;
  }
  .echart {
    width: 100%;
    height: calc(100% - 100px);
  }
}
/deep/.ant-select-selection--single {
  width: 150px;
  background-color: #0f2541;
  color: rgba(226, 235, 241, 1);
  border: none;
  border-radius: 0px;
}
/deep/.ant-select-arrow {
  color: #00aeff;
}
</style>
