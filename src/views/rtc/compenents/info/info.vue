<template>
  <div class="wrapper">
    <Litigant class="mt-5" /> <!-- 当事人 -->
    <BriefInfo class="mt-5" /> <!-- 纠纷概况 -->
    <Evidence class="mt-5" /> <!-- 证据信息 -->
    <!-- <MediationGroup class="mt-5" /> -->
  </div>
</template>

<script>
import Litigant from './litigant.vue'
import BriefInfo from './briefInfo.vue'
import Evidence from './evidence.vue'
import MediationGroup from './mediationGroup.vue'
export default {
  components: {
    Litigant,
    BriefInfo,
    Evidence,
    MediationGroup
  },
  props: {},
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.wrapper {
  width: 100%;
}
</style>
