<template>
  <div class="wrapper">
    <div class="label-wrapper">
      <div class="title">预警等级</div>
      <div class="item item1">预警纠纷>30</div>
      <div class="item item2">预警纠纷>20</div>
      <div class="item item3">预警纠纷>10</div>
      <div class="item item4">预警纠纷<5</div>
    </div>
    <div ref="echarts" class="content" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'CourtMapCharts',
  components: {
  },
  props: {
    rm: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      symbol: 'image://' + require('@/assets/visualize/mapItem1.png')
    }
  },
  computed: {
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const myChart = echarts.init(this.$refs.echarts)
      let geoJson = null
      await axios.get('/xiangan.json').then(res => {
        geoJson = res.data
      })
      const data = [
        {
          name: '新店街道',
          value: [118.249621, 24.614974, 35],
          groupCase: [1, 7],
          focusCase: 5,
          unresolved: 2
        },
        {
          name: '新圩街道',
          value: [118.290597, 24.780588, 25],
          groupCase: [2, 12],
          focusCase: 3,
          unresolved: 6
        },
        {
          name: '民安街道',
          value: [118.21076, 24.668132, 11],
          groupCase: [1, 5],
          focusCase: 2,
          unresolved: 1
        },
        {
          name: '马港街道',
          value: [118.24476, 24.668132, 25],
          groupCase: [1, 5],
          focusCase: 0,
          unresolved: 0
        },
        {
          name: '内厝街道',
          value: [118.29876, 24.678132, 32],
          groupCase: [1, 3],
          focusCase: 3,
          unresolved: 2
        },
        {
          name: '凤翔街道',
          value: [118.21076, 24.598132, 3],
          groupCase: [1, 6],
          focusCase: 12,
          unresolved: 5
        },
        {
          name: '香山街道',
          value: [118.29876, 24.618132, 2],
          groupCase: [1, 1],
          focusCase: 4,
          unresolved: 10
        },
        {
          name: '金海街道',
          value: [118.249621, 24.574974, 24],
          groupCase: [1, 5],
          focusCase: 6,
          unresolved: 12
        },
        {
          name: '大嶝街道',
          value: [118.329621, 24.564974, 18],
          groupCase: [2, 13],
          focusCase: 8,
          unresolved: 14
        }
      ]
      const levelColorMap = {
        '1': 'rgba(251, 78, 72, .8)',
        '2': 'rgba(253, 154, 34, .7)',
        '3': 'rgba(240, 189, 69, 1)',
        '4': 'rgba(31, 202, 232, 1)'
      }
      myChart.hideLoading()
      echarts.registerMap('XA', geoJson)
      myChart.setOption({
        tooltip: {
          show: true
        },
        geo: {
          map: 'XA',
          roam: true,
          layoutCenter: ['55%', '50%'],
          layoutSize: 500,
          aspectScale: 1.25,
          label: {
            emphasis: { // 高亮模式下的配置
              show: false
            }
          },
          data: data,
          zoom: 1.5,
          tooltip: { // geo设置tooltip全局需要配置一个 geo下面也要配置一个不然没有效果
            show: true,
            padding: 0,
            borderWidth: 0,
            position: function(point, params, dom, rect, size) {
              var x = point[0] - 100
              var y = point[1] - 120
              return [x, y]
            },
            backgroundColor: 'transparent',
            formatter: function(params) {
              const name = params.name
              let info = null
              info = data.find(item => {
                return item.name.indexOf(name) !== -1
              })
              console.log(info)
              const totleNum = info.focusCase + info.unresolved + info.groupCase[1]
              let type = 1
              if (totleNum >= 30) {
                type = 1
              } else if (totleNum >= 20 && totleNum < 30) {
                type = 2
              } else if (totleNum >= 10 && totleNum < 20) {
                type = 3
              } else {
                type = 4
              }
              console.log('type=' + type)
              var html = `<div class="tooltip-wrapper type${type}">
                <div class="item">
                  <div class="label">群体性案件:</div>
                  <div class="number">${info.groupCase[0]}起(${info.groupCase[1]}件)</div>
                </div>
                <div class="item">
                  <div class="label">重点解纷:</div>
                  <div class="number">${info.focusCase}件</div>
                </div>
                <div class="item">
                  <div class="label">长时间未化解:</div>
                  <div class="number">${info.unresolved}件</div>
                </div>
              </div>`
              return html
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(33, 194, 224, 1)',
              borderWidth: 2,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(33, 194, 224, .0)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(33, 194, 224, .4)' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              },
              shadowColor: 'rgba(33, 194, 224, 0.4)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10
            },
            emphasis: { // 高亮模式下的配置
              borderColor: 'rgba(33, 194, 224, 1)',
              borderWidth: 2,
              areaColor: 'rgba(33, 194, 224, .6)'
            }
            // emphasis: function(params) {
            //   console.log(params)
            //   debugger
            //   return ''
            // }
          }
        },
        series: [
          { // 工作站散点图
            type: 'effectScatter',
            coordinateSystem: 'geo',
            showEffectOn: 'render',
            rippleEffect: {
              period: 15,
              scale: 4,
              brushType: 'fill'
            },
            hoverAnimation: true,
            tooltip: {
              show: false
            },
            label: {
              show: true,
              color: '#fff',
              offset: [0, 30],
              formatter: (e) => {
                return e.name
              },
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  const info = data.find(item => {
                    return item.name === params.name
                  })
                  const num = info.focusCase + info.unresolved + info.groupCase[1]
                  let type = 4
                  if (num >= 30) {
                    type = 1
                  } else if (num >= 20 && num < 30) {
                    type = 2
                  } else if (num >= 10 && num < 20) {
                    type = 3
                  } else {
                    type = 4
                  }
                  return levelColorMap[type]
                },
                shadowBlur: 5,
                shadowColor: '#333'
              }
            },
            data: data
          }
        ]
      })
      myChart.on('click', (params) => {
        if (params.seriesType === 'effectScatter') {
          this.$emit('clickStreen', params)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.content {
  width: 100%;
  height: 100%;
  padding: 10px;
}
/deep/.tooltip-wrapper {
  background-position: 0 0;
  background-size: 100% 100%;
  padding: 10px 30px;
  width: 190px;
  height: 85px;
  padding-bottom: 30px;
  display: inline-block;
  position: relative;
  z-index: 1;
  .tooltip-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }
  &::before {
    content: "";
    width:100%;
    height:100%;
    position: absolute;
    left:0;
    top:0;
    filter: blur(20px);
    z-index: 2;
  }
  &.type4 {
    background-image: url('../../../assets/visualize/tooltip1.png');
    background-color: rgba(53, 206, 233, 0.1);
    .number {
      color: #89e1f1;
    }
  }
  &.type3 {
    background-image: url('../../../assets/visualize/tooltip2.png');
    background-color: rgba(255, 163, 20, 0.4);
    .number {
      color: rgba(240, 189, 69);
    }
  }
  &.type2 {
    background-image: url('../../../assets/visualize/tooltip3.png');
    background-color: rgba(255, 163, 19, 0.4);
    .number {
      color: rgba(253, 154, 34);
    }
  }
  &.type1 {
    background-image: url('../../../assets/visualize/tooltip4.png');
    background-color: rgba(255, 13, 13, 0.3);
    .number {
      color: rgba(251, 78, 72);
    }
  }
  .item {
    display: flex;
    color: #fff;
  }
  .number {
    color: #1FC6E4;
    margin-left: 10px;
    font-weight: bolder;
  }
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .label-wrapper {
    position: absolute;
    top: 30px;
    left: 40px;
    background-image: url('../../../assets/visualize/xaLabelWrapper.png');
    background-size: 100% 100%;
    background-position: 0 0;
    color: #fff;
    padding: 15px 20px;
    z-index: 100;
    .item {
      padding-left: 15px;
      position: relative;
      margin-top: 10px;
      &::before {
        content: '';
        position: absolute;
        top: 7px;
        left: 0px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      &.item1 {
        &::before {
          background-color: rgba(251, 78, 72);
        }
      }
      &.item2 {
        &::before {
          background-color: rgba(253, 154, 34);
        }
      }
      &.item3 {
        &::before {
          background-color: rgba(240, 189, 69);
        }
      }
      &.item4 {
        &::before {
          background-color: rgba(31, 202, 232);
        }
      }
    }
  }
}
</style>
