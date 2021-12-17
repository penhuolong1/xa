<template>
  <div class="flex-between">
    <div ref="echart" class="echart" />
    <div class="flex-column">
      <div v-for="(item, index) in data" :key="index" class="flex-row label">
        <img
          src="../../../assets/images/visualization/mediationOrganization/label.png"
          height="10px"
          width="16px"
        >
        <div class="name">{{ item.name }}<span>{{ item.value }}个</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      data: [
        { name: '司法调解', value: 21 },
        { name: '行业调解', value: 21 },
        { name: '人民调解', value: 21 },
        { name: '行政调解', value: 11 },
        { name: '律师调解', value: 10 },
        { name: '其他', value: 8 }
      ]
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      const myChart = echarts.init(this.$refs.echart)
      const option = {
        tooltip: {
          trigger: 'item'
        },

        radar: [
          {
            indicator: [
              { text: '司法调解', max: 30 },
              { text: '行业调解', max: 30 },
              { text: '人民调解', max: 30 },
              { text: '行政调解', max: 30 },
              { text: '律师调解', max: 30 },
              { text: '其他', max: 30 }
            ],
            center: ['35%', '50%'],
            radius: 80,
            splitNumber: 5,
            name: {
              color: '#CCDCDE',
              fontSize: 12
            },
            // 雷达图圆圈色
            splitArea: {
              areaStyle: {
                color: []
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                opacity: 1,
                color: '#0B5F78', // 环线颜色
                width: 3
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            lineStyle: {
              width: 1,
              color: '#00F0FF'
            },
            areaStyle: {},
            itemStyle: {
              color: '#fff '
            },
            data: [
              {
                value: [21, 21, 21, 11, 10, 8],
                name: '124',
                areaStyle: {
                  opacity: 0.5,
                  color: '#00F0FF'
                }
              }
            ]
          }
        ]
      }
      option && myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.echart {
  width: calc(100% - 150px);
  height: 100%;
  display: inline-block;
}
.flex-between {
  width: 100%;
  height: 100%;
}
.label{
  margin-top: 10px;
  img{
    margin-top: 3px;
  }
  .name{
    color: #CCDCDE;
    font-size: 12px;
    margin-left: 10px;
    span{
        margin-left: 20px;
    }
  }
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.flex-column {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  padding-top: 20px;
}
.flex-row{
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
}
</style>
