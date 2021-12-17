<template>
  <div ref="echarts" class="content" />
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
        [118.24476, 24.668132, 50]
        // [117.587792, 24.48745, 30],
        // [117.46967, 24.35938, 30]
      ]
      for (let i = 1; i < 50; i++) {
        const lng = `118.2${parseInt(Math.random(0, 1) * 100000)}` - 0
        const lat = `24.6${parseInt(Math.random(0, 1) * 100000)}` - 0
        const num = parseInt(Math.random(0, 1) * 50)
        data.push([lng, lat, num])
      }
      for (let i = 1; i < 30; i++) {
        const lng = `118.28${parseInt(Math.random(0, 1) * 100000)}` - 0
        const lat = `24.7${parseInt(Math.random(0, 1) * 100000)}` - 0
        const num = parseInt(Math.random(0, 1) * 50)
        data.push([lng, lat, num])
      }
      myChart.hideLoading()
      echarts.registerMap('XA', geoJson)
      myChart.setOption({
        visualMap: {
          show: true,
          color: ['#ff4601', '#fffc00', '#87cffa'],
          min: 0,
          max: 50,
          silent: true,
          calculable: true,
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        geo: {
          map: 'XA',
          roam: true,
          layoutCenter: ['50%', '40%'],
          layoutSize: 500,
          aspectScale: 1.75,
          top: 0,
          // zlevel: 1,
          zoom: 1.5,
          silent: true,
          itemStyle: {
            borderColor: 'rgba(102, 144, 173, 0.7)',
            areaColor: 'rgba(13, 76, 124, 0.7)',
            borderWidth: 5
          },
          tooltip: {
            show: false
          }
        },
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'geo',
            data: data
          }
        ]
      })
      // myChart.on('click', (params) => {
      //   const name = params.data.name
      //   console.log(name)
      //   this.$store.commit('SET_CITY', name)
      // })
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
</style>
