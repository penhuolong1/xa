<template>
  <div>
    <Modal
      v-model="ismap"
      :mask-closable="false"
      width="100%"
      wrap-class-name="modal"
    >
      <div class="wrapper" />
      <div id="heatMap" />
      <div id="panel" /></Modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
export default {

  components: {
    Modal
  },
  props: {
    litigantAddress: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ismap: false,
      map: '', // 保存地图实例
      longitude: 0, // 经度
      latitude: 0, // 纬度
      longitudeAddress: [], // 存放所有当事人地址经度
      latitudeAddress: [], // 存放所有当事人地址纬度

      address: []
      // firstAdd:

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 经纬度转换
    conversion() {
      AMap.plugin(['AMap.Geocoder'], () => {
        const geocoder = new AMap.Geocoder({
          city: '全国' // 默认：“全国”
        })
        this.litigantAddress.forEach(item => {
          geocoder.getLocation(item.litigantAddress, (status, result) => {
            if (status === 'complete' && result.geocodes.length) {
              const lnglat = result.geocodes[0].location
              console.log(lnglat)
              marker.setPosition(lnglat)
              this.longitudeAddress.push(lnglat.lng)
              this.latitudeAddress.push(lnglat.lat)
              console.log('longitudeAddress', this.longitudeAddress)
            } else {
              console.log('查询位置失败,请重新输入')
            }
          })
        })
      })
      const marker = new AMap.Marker()
      this.initMap()
    },
    initMap() {
      this.ismap = true
      var that = this
      console.log(this.longitudeAddress[0])
      // this.$nextTick(() => {
      setTimeout(() => {
        var map = new AMap.Map('heatMap', {
          zoom: 13,
          center: [118.246901, 24.617204],
          resizeEnable: true
        })

        that.litigantAddress.map((item, index) => {
          AMap.service(['AMap.Driving'], function() {
            // 驾车导航
            var driving = new AMap.Driving({
              map: map,
              panel: 'panel'
            })
            // 根据起终点坐标规划骑行路线
            driving.search([118.246901, 24.617204], [that.longitudeAddress[index], that.latitudeAddress[index]], (status, result) => {
              // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
              if (status != 'complete') {
                console.log('驾驶路线数据查询失败' + result)
              }
            })
          })
        })

        // 以 icon URL 的形式创建一个途经点
        var viaMarker = new AMap.Marker({
          position: new AMap.LngLat(this.latitude, this.latitude),

          // 将一张图片的地址设置为 icon
          // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-13, -30)
        })
        // 创建一个 Icon
        var icon1 = new AMap.Icon({
          size: new AMap.Size(150, 120)
        })
        // 将 icon 传入 marker
        var startMarker = new AMap.Marker({
          position: new AMap.LngLat(this.latitude, this.latitude),
          icon: icon1,
          offset: new AMap.Pixel(-13, -30)
        })
        // 创建一个 icon
        var endIcon = new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '@/assets/visualize/mapItemBlue.png',
          imageSize: new AMap.Size(135, 40),
          imageOffset: new AMap.Pixel(-95, -3)
        })

        // 将 icon 传入 marker
        var endMarker = new AMap.Marker({
          position: new AMap.LngLat(118.149687, 24.447124),
          icon: endIcon,
          offset: new AMap.Pixel(-13, -30)
        })
        // 将 markers 添加到地图
        map.add([viaMarker, startMarker, endMarker])
      }, 200)

      // })
      this.longitudeAddress = []
      this.latitudeAddress = []
    }

  }
}
</script>

<style scoped lang="less">
#heatMap {
  height: 100vh;
  width: 100vw;
}
   #panel {
            position: fixed;
            background-color: white;
            max-height: 90%;
            overflow-y: auto;
            top: 10px;
            right: 10px;
            width: 280px;
            .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
   	border-top-right-radius: 4px;
}
.amap-lib-walking {
	          border-bottom-left-radius: 4px;
   	        border-bottom-right-radius: 4px;
            overflow: hidden;
        }
        }

.wrapper{
  width: 20%;
  min-height: 30%;
  float: right;
  background-color: cadetblue;
}
</style>
