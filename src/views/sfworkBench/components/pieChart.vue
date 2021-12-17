<template>
  <!-- 扇形图 -->
  <div v-if="list.length>0" ref="echart" class="echart" />
  <Empty v-else />
</template>
<script>
import * as echarts from 'echarts'
import { Empty } from 'ant-design-vue'
export default {
  components: {
    Empty
  },
  props: {
  },
  data() {
    return {
      list: []
    }
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init(data) {
      this.list = data
      let index = 0
      var colorList = ['#73DDFF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
      function fun() {
        var timer = setInterval(function() {
          myChart.dispatchAction({
            type: 'hideTip',
            seriesIndex: 0,
            dataIndex: index
          })
          // 显示提示框
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index
          })
          // 取消高亮指定的数据图形
          myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index == 0 ? 5 : index - 1
          })
          myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
          })
          index++
          if (index > data.length - 1) {
            index = 0
          }
        }, 3000)
      }
      this.$nextTick(() => {
        const myChart = echarts.init(this.$refs.echart)

        myChart.setOption(
          {
            tooltip: {
              trigger: 'item'
            },
            series: [{
              type: 'pie',
              center: ['50%', '25%'],
              radius: ['24%', '45%'],
              fontSize: '30px',
              clockwise: true,
              avoidLabelOverlap: true,
              hoverOffset: 30,
              emphasis: {
                itemStyle: {
                  borderColor: '#f3f3f3',
                  borderWidth: 15
                }
              },
              itemStyle: {
                normal: {
                  fontSize: 5,
                  color: function(params) {
                    return colorList[params.dataIndex]
                  }
                }
              },
              label: {
                show: true,
                position: 'outside',
                formatter: '{a|{b}：{d}%}\n{hr|}',
                rich: {
                  hr: {
                    backgroundColor: 't',
                    borderRadius: 3,
                    width: 4,
                    height: 3,
                    padding: [3, 3, 0, -12]
                  },
                  a: {
                    padding: [-30, 15, -20, 15]
                  }
                }
              },
              labelLine: {
                normal: {
                  length: 20,
                  length2: 30,
                  lineStyle: {
                    width: 1
                  }
                }
              },
              data: this.list
            }]
          }

        )
        myChart.resize({
          width: 500,
          height: 500
        })
      })

      // fun()
    }
  }
}
</script>

<style scoped lang="less">
.echart {
    padding:20px;
    // height: calc(100% - 55px);
    height: 300px;
    margin-top: 25px;
  }
</style>
