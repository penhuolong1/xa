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
    this.init()
  },
  methods: {
    init() {
      var data = [{
        name: '湖北',
        value: 1
      },
      {
        name: '河南',
        value: 2
      },
      {
        name: '山西',
        value: 3
      },
      {
        name: '陕西',
        value: 4
      },
      {
        name: '广西',
        value: 5
      },
      {
        name: '吉林',
        value: 6
      }
      ]
      const myChart = echarts.init(this.$refs.echart)
      myChart.setOption({
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [40, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 40, name: '民间借贷' },
              { value: 38, name: '婚姻家庭' },
              { value: 32, name: '物业纠纷' },
              { value: 30, name: '合同纠纷' },
              { value: 28, name: '其他' }
            ]
          }
        ]
      })
      myChart.resize({
        width: 800,
        height: 400
      })
    }
  }
}
</script>

<style scoped lang="less">
.echart {
    width: 80%;
    // height: calc(100% - 55px);
    height: 500px;
    margin-top: 25px;
  }
</style>
