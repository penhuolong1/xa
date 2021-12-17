<template>
  <div class="dataStatistics-wrapper">
    <!-- <Title :label="data1.courtCenter" label1="七街道两镇" /> -->
    <div class="privilege-title">
      翔安区诉非联动中心
    </div>
    <div v-if="needContent" class="content">
      <div class="label">地址：{{ data1.courtCenterPlace }}</div>
      <div class="label" style="display: flex;">
        <div>联系方式: {{ data1.centerPhone }}</div>
        <div style=" margin-left: auto;display: flex;align-items: center;color:#0BB2E9">
          <img src="../../../assets/visualize/bg6.png" style="width:20px;height:20px;margin-right: 10px;" alt="">
          开启视频通话
        </div>
      </div>

      <!-- <div class="horizontal-strip">
        <label>受理</label>
        <div class="strip-box">
          <div class="strip type1" :style="{'width':data1.sl + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>登记</label>
        <div class="strip-box">
          <div class="strip type2" :style="{'width':data1.dj + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>分流</label>
        <div class="strip-box">
          <div class="strip type3" :style="{'width':data1.fl + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>化解</label>
        <div class="strip-box">
          <div class="strip type4" :style="{'width':data1.hj + '%'}" />
        </div>
      </div> -->
    </div>
    <div ref="echart" class="echart-box" />
    <!-- <GraphicData class="graphic-data" :info="{msuccess: data1.msuccess, inNum: data1.inNum}" /> -->
    <div style="display: flex;padding: 10px 20px;justify-content: space-between;">
      <div class="dv1">
        <div class="txt1">
          <div /> 调解成功率(%)
        </div>
        <div class="txt2">{{ data1.msuccess }}%</div>
      </div>
      <div class="dv2">
        <div class="txt1">
          <div /> 在线调解率(%)
        </div>
        <div class="txt2">{{ data1.inNum }}%</div>
      </div>
    </div>
    <!-- <div ref="echart" class="echart-box" /> -->
  </div>
</template>

<script>
import Title from './title.vue'
import GraphicData from './graphicData.vue'
import { getCentgerCourt } from '@/api/visualize/index.js'
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  components: {
    // Title,
    // GraphicData
  },
  props: {
    needContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data1: {},
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
    this.getData()
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getData()
      const list = this.list
      const yName = list.map((item) => item.name)
      const xData = list.map((item) => item.value)
      console.log(yName, '1111111111111')
      //   console.log(echarts, '111111111111122222')
      const barWidth = 18
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        // backgroundColor: '#0e1c47',
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
          left: 30,
          top: -10,
          right: 100,
          bottom: -10
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
              margin: 10,
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
            type: 'bar',
            barWidth,
            legendHoverLink: false,
            symbolRepeat: true,
            silent: true,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: '#462619' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#EE8532' // 100% 处的颜色
                        }
                      ]
                    },
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: '#196956' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#28F3BF' // 100% 处的颜色
                        }
                      ]
                    },
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: '#003254' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#0097fe' // 100% 处的颜色
                        }
                      ]
                    },
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: '#002e33' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#00e4ff' // 100% 处的颜色
                        }
                      ]
                    }
                    // '#00E4FF',
                    // '#00C453',
                    // '#FEAB52',
                    // '#F96522',
                    // '#F5E224'
                  ]
                  return colorList[params.dataIndex]
                }
              }
              // color: {
              //   type: 'linear',
              //   x: 0,
              //   y: 0,
              //   x2: 1,
              //   y2: 0,
              //   colorStops: [
              //     {
              //       offset: 0,
              //       color: '#00abee' // 0% 处的颜色
              //     },
              //     {
              //       offset: 1,
              //       color: '#62E6F6' // 100% 处的颜色
              //     }
              //   ]
              // }
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
            symbolMargin: '50%',
            symbol: 'roundRect',
            symbolSize: [6, barWidth],
            itemStyle: {
              normal: {
                color: '#103451'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'right',
                offset: [0, 2],
                distance: 30,
                textStyle: {
                  color: '#7AF8FF',
                  fontSize: 14
                },
                formatter: function(a, b) {
                  return `${a.value}%`
                }
              }
            },
            data: xData,
            z: 0,
            animationEasing: 'elasticOut'
          },
          {
            // 分隔
            type: 'pictorialBar',
            itemStyle: {
              color: '#103451'
            },
            symbolRepeat: 'fixed',
            symbolMargin: 4,
            symbol: 'roundRect',
            symbolClip: true,
            symbolSize: [2, barWidth],
            symbolPosition: 'start',
            symbolOffset: [0, 0],
            data: list,
            z: 2,
            animationEasing: 'elasticOut'
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
      await getCentgerCourt(params).then(({ code, data }) => {
        if (code === 200) {
          this.data1 = data[0]
          const list = [
            {
              name: '受理',
              value: data[0].sl
            },
            {
              name: '登记',
              value: data[0].dj
            },
            {
              name: '分流',
              value: data[0].fl
            },
            {
              name: '化解',
              value: data[0].hj
            }
          ]
          this.list = list
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.dataStatistics-wrapper {
  position: relative;
  background: url('../../../assets/visualize/bg1.png') no-repeat;
  background-size: 100% 100%;
  // height: 421px;
  //   height: calc((100vh - 90px) / 2);
  height: 471px;
  // width: 480px;
  padding: 15px 0 10px ;
  .privilege-title {
    font-weight:bold;
    text-align: center;
    color: #fff;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: url('../../../assets/visualize/titles.png') no-repeat;
    background-size: 100% 100%;
    height: 42px;
    line-height: 42px;
    // margin-left: 30px;
  }
  .echart-box {
    width: 100%;
    height: 160px;
    margin-top: 10px;
    // padding-left: 10px;
  }
  .dv1,
  .dv2 {
    width: 150px;
    height: 50px;
    align-items: center;
    left: 20px;

    .txt1 {
      color: #fff;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      div {
        width: 12px;
        height: 17px;
        margin-right: 7px;
        background: #0bb2e9;
      }
    }
    .txt2 {
      height: 30px;
      font-size: 18px;
      margin-left: 5px;
      text-align: center;
      background-image: url('../../../assets/images/visualization/linkageUnit/unitBox.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      //   background-size: 140px 30px;
      color: #0bb2e9;
    }
  }
}
.graphic-data {
  margin-top: 10px;
}
.content {
  //   padding-left: 20px;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
  .label {
    width: 100%;
    color: #ccdcde !important;
    background: rgba(11, 178, 233, 0.15);
    // opacity: 0.15;
    line-height: 35px;
    margin-bottom: 10px;
    padding: 0 20px;
  }
  .horizontal-strip {
    display: flex;
    height: 35px;
    align-items: center;
    label {
      width: 50px;
    }
    .strip-box {
      flex: 1;
      height: 20px;
      .strip {
        width: 100%;
        height: 100%;
        &.type1 {
          background: linear-gradient(
            to right,
            rgba(0, 172, 233, 0.2) 0%,
            #01fef6 100%
          );
        }
        &.type2 {
          background: linear-gradient(
            to right,
            rgba(253, 161, 1, 0.2) 0%,
            #fda101 100%
          );
        }
        &.type3 {
          background: linear-gradient(
            to right,
            rgba(0, 172, 233, 0.2) 0%,
            #01ffd2 100%
          );
        }
        &.type4 {
          background: linear-gradient(
            to right,
            rgba(0, 172, 233, 0.2) 0%,
            #0178ff 100%
          );
        }
      }
    }
  }
}
</style>
