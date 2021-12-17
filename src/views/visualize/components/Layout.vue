<template>
  <div class="wrapper">
    <div v-if="isXaMapHeader" class="xa-map-header">
      <span class="label">当前定位</span>
      <span v-for="(item, index) in areaList" :key="index">
        <span class="name" @click="clickAreaTitle(item)">{{ item }}</span>
        <span v-show="areaList.length-1 !== index" class="icon">></span>
      </span>
    </div>
    <div v-show="isNeedMap" id="heatMap" />
    <div class="header">
      <div class="left-menu">
        <li v-for="(item, index) in menuList" :key="index" :class="{'active': selectActive === index}" @click="selectMenu(index)"><span>{{ item.label }}</span></li>
      </div>
      <div class="right-menu">
        <li class="right-menu-item">
          <img src="@/assets/visualize/menuRight3.png" alt="">
          <span>翔安区</span>
          <img class="arrow" src="@/assets/visualize/menuRight5.png" alt="">
        </li>
        <li class="right-menu-line"> <img src="@/assets/visualize/menuRight4.png" alt=""></li>
        <li class="right-menu-item">
          <img src="@/assets/visualize/menuRight1.png" alt="">
          <span>2021</span>
          <img class="arrow" src="@/assets/visualize/menuRight5.png" alt="">
        </li>
        <li class="right-menu-line"> <img src="@/assets/visualize/menuRight4.png" alt=""></li>
        <li class="right-menu-item" @click="back">
          <img src="@/assets/visualize/menuRight2.png" alt="">
          <span>退出</span>
        </li>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import { formatDate } from '@/utils/format.js'
const streenList1 = [ // 街道的数据
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
    value: [118.25476, 24.678132],
    active: true
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
const streenList2 = [ // 街道的数据
  {
    name: '民安社区1',
    value: [118.206513, 24.690278]
  },
  {
    name: '民安社区2',
    value: [118.21025, 24.689097]
  },
  {
    name: '民安社区3',
    value: [118.256531, 24.699865]
  },
  {
    name: '民安社区4',
    value: [118.251357, 24.684237]
  },
  {
    name: '民安社区5',
    value: [118.256818, 24.696582]
  },
  {
    name: '民安社区6',
    value: [118.251357, 24.684237]
  },
  {
    name: '民安社区7',
    value: [118.251357, 24.684237]
  }
]
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
      isNeedMap: true, // 是否显示地图
      time: formatDate(new Date(), 'YYYY-MM-DD H:m'),
      courtName: '翔安区',
      district: null,
      isChangeZoom: true,
      isXaMapHeader: false, // 是否显示头部的翔安地图的头部导航
      polygons: [],
      areaList: ['翔安区'],
      isShowBc: false, // 是否显示背景
      menuList: [
        {
          label: '组织建设',
          url: '/visualize/index'
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
      ],
      streenList: [ // 街道的数据
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
          value: [118.25476, 24.678132],
          active: true
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
    if (this.$route.name === 'strength' || this.$route.name === 'help' || this.$route.name === 'warning') {
      // 组织建设和纠纷分析需要翔安地图轮廓提
      this.isNeedMap = false
    } else {
      this.isNeedMap = true
    }
    if (this.$route.name === 'warning' || this.$route.name === 'visualizeIndex') {
      this.isXaMapHeader = true
    } else {
      this.isXaMapHeader = false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    // 方法 - 创建地图
    initMap() {
      this.map = new AMap.Map('heatMap', {
        resizeEnable: true,
        zoom: 20.5,
        viewMode: '3D', // 3d模式下zoom才能为小数
        center: [this.centerLng, this.centerLat]
      })
      this.map.setMapStyle('amap://styles/c8525df584e2f477715a0e4e07d73673')
      this.map.on('zoomend', this.mapZoom)
      if (this.$route.name === 'warning') {
        this.addCasePoint()
        this.map.setZoom(14)
        this.map.setCenter(['118.237864', '24.578373'])
      } else if (this.$route.name === 'help') {
        this.isShowBc = true
      } else {
        this.map.setZoom(12.5)
        this.map.setCenter([118.25476, 24.678132])
      }
      if (this.$route.name === 'visualizeIndex' || this.$route.name === 'dispute') {
        // 组织建设和纠纷分析需要翔安地图轮廓提
        // this.mapContour()
        if (this.$route.name === 'visualizeIndex') {
          // 组织建设添加街道办事处坐标
          this.streetPoint()
        }
        if (this.$route.name === 'dispute') {
          // 纠纷分析
          this.heatMap()
        }
      }
    },
    selectMenu(index) {
      this.selectActive = index
      this.$router.push(this.menuList[index].url)
    },
    back() {
      this.$router.push('/workBench/index')
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
      const data = []
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
        image: require('@/assets/visualize/streenIcon.png'),
        size: new AMap.Size(20, 30)
      })
      var icon1 = new AMap.Icon({
        image: require('@/assets/visualize/activeStreenIco.png'),
        size: new AMap.Size(150, 150)
      })
      const markList = this.streenList.map((item) => {
        return {
          position: new AMap.LngLat(item.value[0], item.value[1]),
          icon: item.active ? icon1 : icon, // 添加 Icon 图标 URL
          isLable: true,
          active: item.active,
          title: item.name
        }
      })
      const markers = []
      markList.forEach((item) => {
        const marker = new AMap.Marker(item)
        marker.setLabel({
          // content: '<span class="street-name">' + item.title + '</span>', // 设置文本标注内容
          content: `<div class="street-wrapper ${item.active ? 'active' : ''}">
              <div class="street-info">
                调解组织1个 调解员5个 
              </div>
              <span class="street-name">${item.title}</span>
            </div>`, // 设置文本标注内容
          direction: 'right' // 设置文本标注方位
        })
        marker.on('click', (e) => { this.markerClick(item, e) })
        markers.push(marker)
      })
      // this.map.remove(markers)
      this.map.clearMap()
      this.map.add(markers)
    },
    // 预警研判 案件坐标地点
    addCasePoint() {
      var icon1 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemBlue.png'),
        size: new AMap.Size(80, 80)
      })
      var icon2 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemYellow.png'),
        size: new AMap.Size(80, 80)
      })
      var icon3 = new AMap.Icon({
        image: require('@/assets/visualize/mapItemRed.png'),
        size: new AMap.Size(80, 80)
      })
      const markList = [
        {
          // content: '<div class=`name`>名字</div>',
          position: new AMap.LngLat(118.225252, 24.561744),
          offset: new AMap.Pixel(-100, 100),
          icon: icon1, // 添加 Icon 图标 URL
          type: 1,
          img: require('@/assets/visualize/warn2.png'),
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
          img: require('@/assets/visualize/warn1.png'),
          // isLable: true,
          title: '长时间未化解纠纷预警',
          text: '已超期：67天'
        },
        {
          position: new AMap.LngLat(118.237864, 24.578373),
          offset: new AMap.Pixel(0, 0),
          icon: icon3,
          type: 3,
          isLable: true,
          img: require('@/assets/visualize/warn3.png'),
          // isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.250225, 24.576467),
          offset: new AMap.Pixel(0, 0),
          img: require('@/assets/visualize/warn3.png'),
          icon: icon3,
          type: 3,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.249003, 24.575087),
          offset: new AMap.Pixel(0, 0),
          img: require('@/assets/visualize/warn1.png'),
          icon: icon3,
          type: 3,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.249794, 24.582283),
          offset: new AMap.Pixel(0, 0),
          img: require('@/assets/visualize/warn2.png'),
          icon: icon1,
          type: 1,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.251231, 24.600289),
          offset: new AMap.Pixel(0, 0),
          img: require('@/assets/visualize/warn1.png'),
          icon: icon2,
          type: 2,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        },
        {
          position: new AMap.LngLat(118.236714, 24.602523),
          offset: new AMap.Pixel(0, 0),
          img: require('@/assets/visualize/warn1.png'),
          icon: icon2,
          type: 2,
          isLable: true,
          title: '重点纠纷预警',
          text: '有信访趋势' // 添加 Icon 图标 URL
        }
      ]
      const markers = []
      markList.forEach((item) => {
        const marker = new AMap.Marker(item)
        if (item.isLable) {
          marker.setLabel({
            content: ` <div class="info-wrapper info${item.type}">
              <img src="${item.img}">
              <div class="info-content">
                <h1>${item.title}</h1>
                <div class="label">${item.text}</div>
              </div>
            </div>`,
            direction: 'top' // 设置文本标注方位
          })
        }
        markers.push(marker)
      })
      this.map.clearMap()
      this.map.add(markers)
    },
    // 点击街道触发
    markerClick(item, e) {
      // this.initMap()
      const lng = e.lnglat.lng
      const lat = e.lnglat.lat
      this.areaList[1] = item.title
      this.map.setCenter([lng, lat])
      this.streenList = streenList2
      this.map.setZoom(14)
      this.streetPoint()
    },
    // 设置地图的坐标
    setMapPoint(params) {
      this.areaList[1] = params.name
      this.isNeedMap = true
      this.$nextTick(() => {
        this.initMap()
        this.map.setCenter([params.value[0], params.value[1]])
      })
    },
    // 点击翔安区切换到首页
    clickAreaTitle(title) {
      if (title === '翔安区') {
        this.isNeedMap = false
        this.$emit('showXaMap')
      }
    }
  }
}
</script>

<style scoped lang="less" src="./layout.less">

</style>
