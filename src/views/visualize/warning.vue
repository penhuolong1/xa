<template>
  <Layout ref="layout" :menu-num="3" @showXaMap="showXaMap">
    <div class="content-left">
      <WarnItem :info="info1" :type="1" />
      <WarnItem :info="info2" :type="2" />
      <WarnItem :info="info3" :type="3" />
    </div>
    <div v-show="isMid" class="content-middle">
      <XaMap @clickStreen="clickStreen" />
    </div>
    <div class="content-right">
      <HighRisk />
      <HighWarn />
      <ImportantArea />
    </div>
  </Layout>
</template>

<script>
import Layout from './components/Layout.vue'
import WarnItem from './components/warnItem.vue'
import HighRisk from './components/highRisk.vue'
import HighWarn from './components/highWarn.vue'
import XaMap from './components/xaMap.vue'
import ImportantArea from './components/importantArea.vue'
export default {
  components: {
    Layout,
    XaMap,
    WarnItem,
    HighRisk,
    HighWarn,
    ImportantArea
  },
  props: {},
  data() {
    return {
      isMid: true, // 是否显示中间的地图
      info1: {
        title: '群体性纠纷预警',
        subtitle: '（30天内，>5件）',
        tip: '2',
        total: 35,
        list: [
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          }
          // {
          //   name: '原告：XXX',
          //   brief: 'xxxx纠纷',
          //   caseNum: 6
          // }
        ]
      },
      info2: {
        title: '重点纠纷预警',
        subtitle: '（有信访趋势）',
        tip: '2',
        total: 35,
        list: [
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          }
          // {
          //   name: '原告：XXX',
          //   brief: 'xxxx纠纷',
          //   caseNum: 6
          // }
        ]
      },
      info3: {
        title: '长时间未化解纠纷预警',
        subtitle: '（>50天）',
        tip: '2',
        total: 35,
        list: [
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          },
          {
            name: '原告：XXX',
            brief: 'xxxx纠纷',
            caseNum: 6
          }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 点击街道切换高德地图
    clickStreen(params) {
      this.$refs.layout.setMapPoint(params)
      this.isMid = false
    },
    showXaMap() { // 显示翔安地图
      this.isMid = true
    }
  }
}
</script>

<style scoped lang="less">
.content-left {
  position: absolute;
  left: 20px;
  top: 90px;
  width: 30rem;
  height: calc(100vh - 90px);
  // border: 1px solid #62a2cd;
  display: flex;
  flex-direction: column;
  //   padding: 20px;
  border-left: none;
  z-index: 1;
  & > div {
    height: calc((100% - 60px) / 3);
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.content-middle {
  width: calc(100% - 60rem - 40px);
  height: calc(100vh - 150px);
  position: absolute;
  top: 130px;
  left: 30rem;
}
.content-right {
  position: absolute;
  right: 40px;
  top: 90px;
  width: 30rem;
  height: calc(100vh - 90px);
  // border: 1px solid #62a2cd;
  display: flex;
  flex-direction: column;
  //   padding: 20px;
  overflow-y: auto;
  z-index: 1;
  & > div {
    height: calc((100% - 60px) / 3);
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
