<template>
  <Layout :menu-num="1">
    <div class="content-left">
      <DisputeTrend />
      <AnalysisOfDisputeTypes style="margin-top: 20px;" />s
    </div>
    <div class="content-middle">
      <DisputeContent />
    </div>
    <div class="content-right">
      <StreetHandlingCases class="streetHand" />
      <Privileges class="workEffect" style="margin-top: 20px;" />
    </div>
  </Layout>
</template>

<script>
import WorkEffectiveness from './components/workEffectiveness.vue'
import StreetHandlingCases from './components/streetHandlingCases.vue'
import DisputeContent from './components/disputeContent.vue'
import DisputeTrend from './components/disputeTrend1.vue'
import AnalysisOfDisputeTypes from './components/analysisOfDisputeTypes.vue'
import Privileges from './components/privileges.vue'

import Layout from './components/Layout.vue'
export default {
  components: {
    Layout,
    WorkEffectiveness,
    DisputeTrend,
    DisputeContent,
    AnalysisOfDisputeTypes,
    StreetHandlingCases,
    Privileges
  },
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.content-left {
  position: absolute;
  left: 20px;
  top: 90px;
  width: 30rem;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  padding-top: 0px;
  border-left: none;
  z-index: 1;
  & > div {
    height: calc((100% - 40px) / 2);
  }
}
.content-middle {
  width: calc(100% - 62rem);
  height: calc(100vh - 800px);
  position: absolute;
  bottom: 20px;
  left: 31rem;
}
.content-right {
  position: absolute;
  right: 20px;
  top: 90px;
  width: 30rem;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  z-index: 1;
  .workEffect {
    height: 343px;
  }
  .streetHand {
    height: calc(100% - 383px);
  }
}
</style>
