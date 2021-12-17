<template>
  <Layout :menu-num="1">
    <div class="content-left">
      <DataStatistics :need-content="false" />
      <RadarChart :type="1" title="街道/镇化解案件数量/件" />
      <RadarChart :type="2" title="街道/镇化解成功率/%" />
    </div>
    <!-- <div class="content-middle">
      <XaMap1 />
    </div> -->
    <div class="content-right">
      <DisputeTrend />
      <DisputeType />
    </div>
  </Layout>
</template>

<script>
import DataStatistics from './components/dataStatistics.vue'
import RadarChart from './components/radarChart.vue'
import Layout from './components/Layout.vue'
import XaMap1 from './components/xaMap1.vue'
import DisputeTrend from './components/disputeTrend.vue'
import DisputeType from './components/disputeType.vue'
export default {
  components: {
    Layout,
    DataStatistics,
    RadarChart,
    DisputeTrend,
    DisputeType,
    XaMap1
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

  }
}
</script>

<style scoped lang="less">
.content-left {
  position: absolute;
  left: 0px;
  top: 130px;
  width: 30rem;
  height: calc(100vh - 140px);
  // border: 1px solid #62a2cd;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-left: none;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    background: rgba(3, 16, 47, 1);
    filter: blur(10px);
    z-index: -1;
  }
  &>div{
    flex: 1;
    width: 100%;
  }
}
.content-middle {
  width: calc(100% - 55.75rem);
  height: calc(100vh - 150px);
  position: absolute;
  top: 130px;
  left: 25.75rem;
}
.content-right {
  position: absolute;
  right: 0px;
  top: 130px;
  width: 30rem;
  height: calc(100vh - 140px);
  // border: 1px solid #62a2cd;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(3, 16, 47, 1);
    filter: blur(10px);
    z-index: -1;
  }
  &>div{
    flex: 1;
    width: 100%;
  }
}
</style>
