<template>
  <div class="box">
    <WorkEffectiveness />
    <StreetHandlingCases style="margin-top:20px" />
    <DisputeTrend style="margin-top:20px" />
    <AnalysisOfDisputeTypes style="margin-top:20px" />
    <LinkageUnit style="margin-top:20px" />
    <RadarChart style="margin-top:20px" />
    <MediationOrganization style="margin-top:20px" />
  </div>

</template>

<script>
import WorkEffectiveness from './components/workEffectiveness.vue'
import StreetHandlingCases from './components/streetHandlingCases.vue'
import DisputeTrend from './components/disputeTrend1.vue'
import AnalysisOfDisputeTypes from './components/analysisOfDisputeTypes.vue'
import LinkageUnit from './components/linkageUnit.vue'
import RadarChart from './components/radarChart1.vue'
import MediationOrganization from './components/mediationOrganization.vue'
export default {
  components: {

    WorkEffectiveness,
    StreetHandlingCases,
    DisputeTrend,
    AnalysisOfDisputeTypes,
    LinkageUnit,
    RadarChart,
    MediationOrganization
  }
}
</script>

<style lang="less" scoped>
.box{
    padding: 20px;
}

</style>
