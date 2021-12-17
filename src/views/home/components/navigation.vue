<template>

  <div class="content-map-navigation">

    <div class="left">
      <Map />
    </div>
    <div class="right">
      <div class="top">
        <div class="top-left">
          单位网点
          <span>（3455）</span>
        </div>
        <div class="top-right">查看更多<a-icon type="right" /></div>
      </div>
      <div class="center" />
      <div v-for="(item,index) in addressArr" :key="index">
        <div v-if="index < 3" class="bottom">
          <div class="bottom-top">
            <a-icon
              class="icon"
              type="environment"
              theme="filled"
              :style="{ fontSize: '18px', color: 'red' }"
            />{{ item.name }}
          </div>
          <div class="bottom-address-time">地址：{{ item.address }}</div>
          <div class="bottom-address-time">
            {{ item.time }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { Icon } from 'ant-design-vue'
import Map from './map.vue'
export default {
  components: {
    'a-icon': Icon,
    Map
  },
  data() {
    return {
      addressArr: [
        {
          name: '厦门市翔安区新店街道分中心',
          address: '顶曾路360号4-6层',
          time: '夏季：上午9:00-12:00 下午14.00-17.00 其他：9.00-12.00'
        },
        {
          name: '厦门市翔安区新店街道分中心',
          address: '顶曾路360号4-6层',
          time: '夏季：上午9:00-12:00 下午14.00-17.00 其他：9.00-12.00'
        },
        {
          name: '厦门市翔安区新店街道分中心',
          address: '顶曾路360号4-6层',
          time: '夏季：上午9:00-12:00 下午14.00-17.00 其他：9.00-12.00'
        },
        {
          name: '厦门市翔安区新店街道分中心',
          address: '顶曾路360号4-6层',
          time: '夏季：上午9:00-12:00 下午14.00-17.00 其他：9.00-12.00'
        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
//解纷单位导航
.content-map-navigation {
  min-height: 360px;
  width: 80%;
  margin: 0 auto 40px;
  background: #fbfbfb;
  box-shadow: 0px 0px 10px 0px rgba(29, 49, 117, 0.1);
  display: flex;
  flex-direction: row;
  .left {
    width: 100%;
  }
  .right {
    width: 100%;
    margin-left: 20px;
    .top {
      margin: 20px 20px 0 10px;
      display: flex;
      justify-content: space-between;
      .top-left {
        font-size: 20px;
        font-family: Source Han Sans CN, Source Han Sans CN-Bold;
        font-weight: 700;
        color: #303133;
        span {
          margin-left: 10px;
        }
      }
      .top-right {
        cursor: pointer;
        margin-top: 5px;
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #c0c4cc;
      }
    }
    .center {
      margin: 9px auto 10px -20px;
      border-top: 1px solid rgba(29, 49, 117, 0.1);
      background: #fbfbfb;
    }
    .bottom {
      margin: 5px auto;
      cursor: pointer;
      .bottom-top {
        font-size: 18px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #303133;
        margin-bottom: 5px;
        .icon{
          margin-right: 5px;

        }
      }
      .bottom-top:hover {
        font-weight: 700;
          color: #409eff;
      }
      .bottom-address-time {
        margin: 5px 0 0 20px;
        font-size: 14px;
        font-family: Source Han Sans CN, Source Han Sans CN-Medium;
        font-weight: 500;
        color: #909399;
      }
    }
  }
}
</style>
