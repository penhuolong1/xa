<template>
  <div class="court-item-wrapper" @mouseleave="mouseLeave">
    <div>
      <div class="title">
        {{ item.streetName }}
        <div class="jiedao" @mouseover="mouseOver(item)">
          <img src="../../../assets/visualize/icon1.png" style="width:10px;height: 10px;margin-right: 3px;" alt="">
          9个街道级
        </div>

      </div>
      <div class="address">地址：{{ item.splace }}</div>
      <div class="phone">联系方式: {{ item.sphone }}</div>
      <div v-if="item.name" class="phone">联络人: {{ item.name }}</div>
    </div>
    <div style="display: flex;color:#fff;text-align: center;">
      <div style="flex:1;">
        <div class="bg4">40</div>
        <div>案件数量</div>
      </div>
      <div style="flex:1;">
        <div class="bg4">11.55%</div>
        <div>受理案件占比</div>
      </div>
    </div>
    <!-- <div class="relative">
      <div class="data">{{ item.caseNum }}件，{{ item.proportion }}%</div>
      <div ref="echart" class="echarts" />
    </div> -->

  </div>
</template>

<script>
import Title from './title.vue'
import * as echarts from 'echarts'
export default {
  components: {
    Title
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    // 移入
    mouseOver(item) {
      console.log(item.streetName)
      this.$emit('display', item.streetName)
    },
    // 移出
    mouseLeave() {
      this.$emit('displayNone')
    },
    init() {
      var getxb1 = Number(this.item.caseNum) // 案件总数
      var getxb2 = (Number(this.item.caseNum) * this.item.proportion) / 100 // 化解数
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        series: [
          {
            name: '性别分布',
            type: 'pie',
            radius: ['55%', '115%'],
            startAngle: 180,
            center: ['45%', '83%'],
            roseType: 'radius',
            labelLine: {
              show: false
            },
            label: {
              normal: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: '14px',
                  color: '#fff',
                  padding: [-20, 0, 0, 0]
                },
                formatter: function (params) {
                  var proportion = ''
                  console.log('-----')
                  console.log(params)
                  return ((getxb2 / getxb1) * 100).toFixed(2) + '%'
                }
              },
              position: 'center',
              show: true
            },
            data: [
              {
                value: getxb1,
                // name: "男生",
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: '#4C8DFA'
                        },
                        {
                          offset: 1,
                          color: '#5CCFFF'
                        }
                      ],
                      false
                    )
                  }
                }
              },
              {
                value: getxb2,
                // name: "女生",
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: '#FFD18B'
                        },
                        {
                          offset: 1,
                          color: '#FDAD59'
                        }
                      ],
                      false
                    )
                  }
                }
              },
              {
                value: getxb1 + getxb2,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  normal: {
                    color: 'transparent',
                    borderWidth: 0,
                    shadowBlur: 0,
                    borderColor: 'transparent',
                    shadowColor: 'transparent'
                  }
                }
              }
            ]
          },
          {
            type: 'pie',
            radius: ['55%', '130%'],
            startAngle: 180,
            hoverAnimation: false,
            center: ['45%', '83%'],
            roseType: 'radius',
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: getxb1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(76,141,250,.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(92,207,255,.3)'
                        }
                      ],
                      false
                    )
                  }
                }
              },
              {
                value: getxb2,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(255,209,139,.3)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(253,173,89,.3)'
                        }
                      ],
                      false
                    )
                  }
                }
              },
              {
                value: getxb1 + getxb2,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  normal: {
                    color: 'transparent',
                    borderWidth: 0,
                    shadowBlur: 0,
                    borderColor: 'transparent',
                    shadowColor: 'transparent'
                  }
                }
              }
            ],
            z: -1
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="less">
.court-item-wrapper {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-left: 20px;
  background: url('../../../assets/visualize/bg3.png');
  background-size: 482px 116px;
  height: 116px;
  .title {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #1cfeff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .jiedao {
      padding: 2px 5px;
      font-size: 10px;
      background: #0e6e96;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
  }
  & > div {
    flex: 1;
  }
  .echarts {
    width: 100%;
    height: 100%;
  }
  .data {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 14px;
    color: rgba(125, 237, 255, 1);
    border-top: 2px solid rgba(0, 174, 255, 1);
    padding-top: 3px;
    text-shadow: 0 0 10px #fff;
  }
  .txt-content {
    margin-top: 10px;
    padding-left: 20px;
    color: #fff;
  }
  .address {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 10px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
    margin-bottom: 10px;
  }
  .phone {
    margin-top: 5px;
    font-size: 10px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.5;
  }
  .bg4 {
    width: 60px;
    height: 60px;
    line-height: 60px;
    background: url('../../../assets/visualize/bg4.png') no-repeat;
    background-size: 60px 60px;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #3efff4;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
.num {
  color: #00affb;
}
</style>
