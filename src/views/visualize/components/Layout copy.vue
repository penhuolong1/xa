<template>
  <div class="wrapper">
    <div id="heatMap" />
    <div v-if="isShowBc" class="help-bc" />
    <div class="header">
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="{'active': selectActive === index}" @click="selectMenu(index)">
          <span>{{ item.label }}</span>
        </li>
      </ul>
      <div class="header-left flex">
        <div>
          <div class="time">
            {{ time }}
          </div>
          <div class="court">
            {{ courtName }}
            <Icon type="caret-down" class="icon" />
          </div>
        </div>
        <div class="back" @click="back">返回</div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import { formatDate } from '@/utils/format.js'
export default {
  components: {
    Icon
  },
  props: {
    menuNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      map: '', // 保存地图实例
      centerLng: '118.302237', // 经度
      centerLat: '24.700158', // 纬度
      heatmapOverlay: {}, // 热力图覆盖物
      selectActive: 0,
      time: formatDate(new Date(), 'YYYY-MM-DD H:m'),
      courtName: '翔安区',
      district: null,
      polygons: [],
      isShowBc: false, // 是否显示背景
      menuList: [
        {
          label: '组织建设',
          url: '/visualize'
        },
        {
          label: '纠纷分析',
          url: '/visualize/dispute'
        },
        {
          label: '解纷力量',
          url: '/visualize/strength'
        },
        {
          label: '预警研判',
          url: '/visualize/warning'
        }
      ]
    }
  },
  watch: {
    menuNum() {
      this.selectActive = this.menuNum
    },
    '$route.name': {
      handler() {
        this.initMap()
      }
    }
  },
  created() {
    this.selectActive = this.menuNum
    // this.getPoint()
    this.interval && clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.time = formatDate(new Date(), 'YYYY-MM-DD H:m')
    }, 30000)
  },
  mounted() {
    setTimeout(() => {
      this.initMap()
    }, 500)
  },
  methods: {
    // 方法 - 创建地图
    initMap() {
      this.map = new AMap.Map('heatMap', {
        resizeEnable: true,
        zoom: 11.5,
        viewMode: '3D', // 3d模式下zoom才能为小数
        center: [this.centerLng, this.centerLat]
      })
      this.map.setMapStyle('amap://styles/c8525df584e2f477715a0e4e07d73673')
      console.log(this.$route.name)
      if (this.$route.name === 'Visualize' || this.$route.name === 'dispute') { // 组织建设和纠纷分析需要翔安地图轮廓提
        this.mapContour()
        if (this.$route.name === 'Visualize') { // 组织建设添加街道办事处坐标
          this.streetPoint()
        }
        if (this.$route.name === 'dispute') { // 纠纷分析
          this.heatMap()
        }
      }
      if (this.$route.name === 'warning') {
        this.addCasePoint()
        this.map.setZoom(14)
        this.map.setCenter(['118.237864', '24.578373'])
      } else if (this.$route.name === 'help') {
        this.isShowBc = true
      } else {
        this.map.setZoom(11.5)
        this.map.setCenter([this.centerLng, this.centerLat])
      }
    },
    selectMenu(index) {
      this.selectActive = index
      this.$router.push(this.menuList[index].url)
    },
    back() {
      this.$router.push('/')
    },
    // 添加翔安地图轮廓
    mapContour() {
      const opts = {
        subdistrict: 1, // 返回下一级行政区
        showbiz: false // 最后一级返回街道信息
      }
      this.district = new AMap.DistrictSearch(opts)
      this.district.setLevel('district') // 行政区级别
      this.district.setExtensions('all')
      const that = this
      this.district.search('350213', function(status, result) {
        if (status === 'complete') {
          const bounds = result.districtList[0].boundaries
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              var polygon = new AMap.Polygon({
                map: that.map,
                strokeWeight: 1,
                strokeColor: '#0091ea',
                fillColor: '#80d8ff',
                fillOpacity: 0.2,
                path: bounds[i]
              })
              that.polygons.push(polygon)
            }
          }
        }
      })
    },
    // 生成热力图
    heatMap() {
      const data = [
      ]
      for (let i = 1; i < 50; i++) {
        const lng = `118.2${parseInt(Math.random(0, 1) * 100000)}` - 0
        const lat = `24.6${parseInt(Math.random(0, 1) * 100000)}` - 0
        const num = parseInt(Math.random(0, 1) * 50)
        data.push({
          lng,
          lat,
          count: num
        })
      }
      for (let i = 1; i < 30; i++) {
        const lng = `118.28${parseInt(Math.random(0, 1) * 100000)}` - 0
        const lat = `24.7${parseInt(Math.random(0, 1) * 100000)}` - 0
        const num = parseInt(Math.random(0, 1) * 50)
        data.push({
          lng,
          lat,
          count: num
        })
      }
      var heatmap
      const that = this
      this.map.plugin(['AMap.Heatmap'], function() {
        // 初始化heatmap对象
        heatmap = new AMap.Heatmap(that.map, {
          radius: 25, // 给定半径
          opacity: [0, 0.8]
        })
        // 设置数据集：该数据为北京部分“公园”数据
        console.log(data)
        heatmap.setDataSet({
          data: data,
          max: 50
        })
      })
    },
    // 组织建设 点合集
    streetPoint() {
      var icon = new AMap.Icon({
        image: require('@/assets/visualize/mapItem.png'),
        size: new AMap.Size(50, 50)
      })
      const data = [
        {
          name: '新店街道办事处',
          value: [118.25487, 24.630974]
        },
        {
          name: '新圩街道办事处',
          value: [118.280597, 24.750588]
        },
        {
          name: '民安街道办事处',
          value: [118.21076, 24.668132]
        },
        {
          name: '翔安诉非联动中心',
          value: [118.25476, 24.678132]
        },
        {
          name: '内厝街道办事处',
          value: [118.29876, 24.668132]
        },
        {
          name: '凤翔街道办事处',
          value: [118.21076, 24.598132]
        },
        {
          name: '香山街道办事处',
          value: [118.29876, 24.618132]
        },
        {
          name: '金海街道办事处',
          value: [118.249621, 24.574974]
        },
        {
          name: '大嶝街道办事处',
          value: [118.329621, 24.544974]
        }
      ]
      const markList = data.map(item => {
        return {
          position: new AMap.LngLat(item.value[0], item.value[1]),
          icon: icon, // 添加 Icon 图标 URL
          isLable: true,
          title: item.name
        }
      })
      const markers = []
      markList.forEach(item => {
        const marker = new AMap.Marker(item)
        marker.setLabel({
          content: '<span class="street-name">' + item.title + '</span>', // 设置文本标注内容
          direction: 'bottom' // 设置文本标注方位
        })
        markers.push(marker)
      })
      this.map.add(markers)
    },
    // 预警研判 案件坐标地点
    addCasePoint() {
      var icon1 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemBlue.png'),
        size: new AMap.Size(150, 120)
      })
      var icon2 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemYellow.png'),
        size: new AMap.Size(150, 120)
      })
      var icon3 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemRed.png'),
        size: new AMap.Size(150, 120)
      })
      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
      })
      const markList = [
        {
          // content: '<div class=`name`>名字</div>',
          position: new AMap.LngLat(118.225252, 24.561744),
          offset: new AMap.Pixel(-10, -10),
          icon: icon1, // 添加 Icon 图标 URL
          type: 1,
          isLable: true,
          title: '群体性纠纷预警',
          text: '案件量：15件'
        },
        {
          // content: '<div class=`name`>名字</div>',
          position: new AMap.LngLat(118.221407, 24.564538),
          offset: new AMap.Pixel(-10, -10),
          icon: icon2, // 添加 Icon 图标 URL
          type: 2,
          isLable: true,
          title: '长时间未化解纠纷预警',
          text: '已超期：67天'
        },
        {
          position: new AMap.LngLat(118.237864, 24.578373),
          offset: new AMap.Pixel(0, 0),
          icon: icon3,
          type: 3,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.250225, 24.576467),
          offset: new AMap.Pixel(0, 0),
          icon: icon3,
          type: 3,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.249003, 24.575087),
          offset: new AMap.Pixel(0, 0),
          icon: icon3,
          type: 3,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.249794, 24.582283),
          offset: new AMap.Pixel(0, 0),
          icon: icon1,
          type: 1,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.251231, 24.600289),
          offset: new AMap.Pixel(0, 0),
          icon: icon2,
          type: 2,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.236714, 24.602523),
          offset: new AMap.Pixel(0, 0),
          icon: icon2,
          type: 2,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        }
      ]
      const markers = []
      markList.forEach(item => {
        const marker = new AMap.Marker(item)
        // if (item.isLable) {
        //   marker.setLabel({
        //     content: "<div class='info" + item.type + "'><h1>" + item.title + '</h1><div>' + item.text + '</div></div>', // 设置文本标注内容
        //     direction: 'top' // 设置文本标注方位
        //   })
        // }
        markers.push(marker)
      })
      this.map.add(markers)
    }
  }
}
</script>

<style scoped lang="less">
// /deep/.amap-marker-label {
//   background-color: red;
// }
/deep/.amap-container img {
  width: 100%;
}
/deep/.street-name {
  position: relative;
  top: -10px;
}
.wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  .help-bc {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #03102f;
  }
  .header {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 150px;
    background-image: url('../../../assets/visualize/header.png');
    background-position: 0 0;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    ul {
      display: flex;
      position: absolute;
      left: 53rem;
      top:35px;
      li {
        color: #fff;
        padding: 10px 0px;
        margin-right: 6.25rem;
        position: relative;
        cursor: pointer;
        z-index: 1;
        &.active {
          &::before {
            content: '';
            width: 100%;
            height: 5px;
            background: linear-gradient(to right,#00d2ff 0%, #2968e8 100%);
            border-radius: 2px;
            position: absolute;
            top: 0px;
            left: 0px;
          }
        }
        span {
          display: inline-block;
          height: 40px;
          line-height: 40px;
          font-size: 20px;
          font-weight: bold;
          text-shadow: 0 0 10px #fff;
        }
      }
    }
    .header-left {
      position: absolute;
      top: 45px;
      right: 40px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      align-items: center;
      .back {
        cursor: pointer;
        margin-left: 10px;
        font-size: 16px;
      }
      .icon {
        color: #00aeff;
        position: relative;
        top: -2px;
      }
    }
  }
}
#heatMap {
  height: 100vh;
  width: 100vw;
}
/deep/.info1 {
  text-align: center;
  padding: 10px;
  background-color: rgba(0,174,255,0.2);
  div {
    color: #1CDCFF;
  }
  h1 {
    color: #fff;
  }
}
/deep/.info2 {
  text-align: center;
  padding: 10px;
  background-color: rgba(253,161,1,0.2);
  div {
    color: #FDA101;
  }
  h1 {
    color: #fff;
  }
}
/deep/.info3 {
  text-align: center;
  padding: 10px;
  background-color: rgba(251,74,69, 0.2);
  div {
    color: #FB4642;
  }
  h1 {
    color: #fff;
  }
}
/deep/.amap-marker-label {
  background-color: transparent;
  color: #fff;
  border: none;
}
</style>
