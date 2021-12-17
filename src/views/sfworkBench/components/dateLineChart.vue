<template>
  <div ref="echart" class="echart" />
</template>
<script>
import * as echarts from 'echarts'

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    init(name, value) {
      var lineitemStyle = {
        normal: {
          color: 'rgba(0, 0, 0, 0)',
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0, 0, 0, .6)',
          shadowBlur: 0,
          shadowOffsetY: 2,
          shadowOffsetX: 2
        }
      }
      this.$nextTick(() => {
        const myChart = echarts.init(this.$refs.echart)

        myChart.setOption({
          title: {
	        text: '',
	        textStyle: {
	        	 align: 'center',
	            color: '#333333',
	            fontSize: 18
	        },
	        top: '2%',
	        left: '2%'
	    },
          grid: {
            top: '25%',
            bottom: '19%'
          // left: '6%',
          // right: '4%'
          },
          tooltip: {
            trigger: 'axis',
            label: {
              show: true
            }
          },
          xAxis: {
            boundaryGap: true, // 默认，坐标轴留白策略
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            data: name
          },
          yAxis: {
            max: 100,
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#177DDC'
              }
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: '#fff'
              }
            }
          },
          series: [
            {
              name: '案件数：',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 7,
              lineStyle: {
                color: '#177DDC ',
                shadowBlur: 12,
                shadowColor: '#177DDC',
                shadowOffsetX: 1,
                shadowOffsetY: 1
              },
              itemStyle: {
                color: 'rgba(95, 87, 245, 1) ',
                borderWidth: 1,
                borderColor: '#FFF'
              },
              data: value
            }
          ] }
        )
        myChart.resize({
          width: 300,
          height: 200
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.echart {
    width: 600px;
    // height: calc(100% - 55px);
    height: 400px;
    // margin-top: -65px;
  }
</style>
