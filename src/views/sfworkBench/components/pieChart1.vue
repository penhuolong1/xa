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
      var ydata = [{
        name: '财务管理决策实训',
        value: 18
      },
      {
        name: '商品流通业实训',
        value: 16
      },
      {
        name: '暖心陪伴（津乐园20cm定制蛋糕）',
        value: 10
      },
      {
        name: '嘉果荟萃（津乐园20cm定制蛋糕）',
        value: 14
      },
      {
        name: '优雅圆舞曲（津乐园20cm）',
        value: 10
      },
      {
        name: '巧克力之夏（津乐园20cm定制蛋糕）',
        value: 7.9
      },
      {
        name: '财税宝4G',
        value: 6.7
      },
      {
        name: '成本会计',
        value: 6
      },
      {
        name: '纳税会计与筹划',
        value: 4.5
      },
      {
        name: '金融担保业实训',
        value: 3
      }
      ]
      var color = ['#1E90FF', '#007ffb', '#005db7', '#0054a6', '#62b2ff', '#2f98ff', '#f59a8f', '#fdb301', '#57e7ec', '#cf9ef1']
      var xdata = ['财务管理决策实训', '商品流通业实训', '暖心陪伴（津乐园20cm定制蛋糕）', '嘉果荟萃（津乐园20cm定制蛋糕）', '优雅圆舞曲（津乐园20cm）', '巧克力之夏（津乐园20cm定制蛋糕）', '财税宝4G', '成本会计', '纳税会计与筹划', '金融担保业实训']

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
            color: color,
            legend: {
              orient: 'vartical',
              x: 'left',
              top: 'center',
              left: '60%',
              bottom: '0%',
              data: xdata,
              itemWidth: 8,
              itemHeight: 8,
              itemGap: 16,
	    /* formatter:function(name){
	      var oa = option.series[0].data;
	      var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value+oa[4].value + oa[5].value + oa[6].value + oa[7].value+oa[8].value + oa[9].value ;
	      for(var i = 0; i < option.series[0].data.length; i++){
              if(name==oa[i].name){
              	return ' '+name + '    |    ' + oa[i].value + '    |    ' + (oa[i].value/num * 100).toFixed(2) + '%';
              }
	      }
	    }*/

              formatter: function(name) {
                return '' + name
              }
            },
            series: [{
              type: 'pie',
              clockwise: false, // 饼图的扇区是否是顺时针排布
              minAngle: 2, // 最小的扇区角度（0 ~ 360）
              radius: ['40%', '70%'],
              center: ['30%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: { // 图形样式
                normal: {
                  borderColor: '#ffffff',
                  borderWidth: 6
                }
              },
              label: {
                normal: {
                  show: false,
                  position: 'center',
                  formatter: '{text|{b}}\n{c} ({d}%)',
                  rich: {
                    text: {
                      color: '#666',
                      fontSize: 14,
                      align: 'center',
                      verticalAlign: 'middle',
                      padding: 8
                    },
                    value: {
                      color: '#8693F3',
                      fontSize: 24,
                      align: 'center',
                      verticalAlign: 'middle'
                    }
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: 24
                  }
                }
              },
              data: ydata
            }]
          }

        )
        myChart.resize({
          width: 450,
          height: 450
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
    margin-top: -100px;
    margin-left: 120px;
  }
</style>
