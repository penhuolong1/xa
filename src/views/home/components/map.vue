<template>
  <div>
    <div
      id="mapChart"
      ref="mapChart"
      style=" width: 100%; height: 400px;z-index:0"
    />
    <div class="search-filter-box">
      <InputSearch placeholder="请输入地点" style="width: 200px" />
      <div class="screen">
        查看区域
        <span>|</span>
        <span>街级</span>
        <span>|</span>
        <span>街道级</span>
        <span>|</span>
        <span>社区级</span>
      </div>
    </div>
    <!-- 级联查看 -->
    <div class="choice-box">
      <div class="cascader">
        <ul>
          <li v-for="(item,index) in options" :key="index" v-bind="item" @click="open1(item)">{{ item.value }}
            <Icon type="right" :style="{ margin:'3px 0 0'}" /></li>
        </ul>
        <ul v-if="list || list !=''">
          <li v-for="(item1,index1) in list" :key="index1" v-bind="item1" @click="open2(item1)">{{ item1.value }}
            <Icon type="right" :style="{ margin:'3px 0 0'}" /></li>
        </ul>
        <ul v-if="Arr || Arr !=''">
          <li v-for="(item2,index2) in Arr" :key="index2" class="address">地址：{{ item2.value }}</li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
import { Input, Icon } from 'ant-design-vue'
export default {
  components: {
    'InputSearch': Input.Search,
    Icon
  },
  data() {
    return {
      list: [],
      Arr: [],
      options: [
        {
          value: '区政委法院',
          label: 'Zhejiang'
        },
        {
          value: '区法院',
          label: 'Jiangsu'
        },
        {
          value: '区司法局',
          label: 'Jiangsu'
        },
        {
          value: '区公安局',
          label: 'Jiangsu'
        }
      ]
    }
  },
  created() {
    var url =
      'https://webapi.amap.com/maps?v=1.4.15&key=自己申请的key值&callback=onLoad'
    var jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  },
  mounted() {
    this.mapFn()
    console.log('open', this.open)
  },
  methods: {
    mapFn() {
      var _this = this
      window.onLoad = function() {
        _this.map = new AMap.Map('mapChart', {
          resizeEnable: true,
          center: [118.082583, 24.480944],
          viewMode: '2D', // 使用2D视图
          zoom: 13,
          mapStyle: 'amap://styles/darkblue'
        })
        // 使用clearMap方法删除所有覆盖物
        _this.map.clearMap()
      }
    },
    open1(event) {
      console.log('444', event)
      if (event.label == 'Zhejiang') {
        this.list = [
          {
            value: '翔安区司法局',
            id: 211
          },
          {
            value: '翔安区司法局',
            id: 212
          },
          {
            value: '翔安区司法局',
            id: 213
          }
        ]
      } else {
        this.list = [
          {
            value: '221',
            id: 221
          },
          {
            value: '222',
            id: 222
          },
          {
            value: '223',
            id: 223
          }
        ]
      }
    },
    open2(event) {
      console.log('888', event)
      this.Arr = [
        {
          value: '厦门市翔安区新店路2...',
          id: 2
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.search-filter-box{
    margin:-380px 0 0 20px;
    z-index:1;
    position: absolute;
    width: 424px;
    height: 42px;
    padding: 0 5px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 0px 26px 0px rgba(51,51,51,0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.screen {
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #606266;

    span {
      color: #909399;
      margin: 0 2.5px;
      cursor: pointer;
    }
    span:active {
      color: #409eff;
      cursor: pointer;
    }
  }
// 级联查看
.choice-box{
    padding: 5px 5px;
    margin:-330px 0 0 20px;
    z-index:1;
    position: absolute;
    width: 422px;
    background: #ffffff;
    box-shadow: 0px 0px 4px 0px rgba(51,51,51,0.15);
    .cascader{
        width: 100%;
        display: grid;
        grid-template-columns:25% 25% 45%;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;/*超出部分文字以...显示*/
        li{
            display: flex;
            justify-content: space-between;
            padding: 9px 5px;
            font-size: 12px;
            font-family: Source Han Sans CN, Source Han Sans CN-Medium;
            font-weight: 500;
            text-align: LEFT;
            color: #909399;
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;/*超出部分文字以...显示*/
          }
      }
}

</style>
