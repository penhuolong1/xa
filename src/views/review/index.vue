<template>
  <div class="wrapper">
    <h1 class="header">案件详情</h1>
    <CaseDetail class="bottom" />
    <h1 class="header">当事人信息</h1>
    <LitigantList class="bottom" :is-edit="false" />
    <h1 class="header">证据列表</h1>
    <EviList class="bottom" :is-edit="false" />
    <h1 class="header">其他材料</h1>
    <ReviewMaterial class="bottom" :is-edit="false" />
    <Review class="bottom" />
    <h1 class="header">历史审查意见</h1>
    <ReviewHistroy />
  </div>
</template>

<script>
import CaseDetail from './components/caseDetail.vue'
import LitigantList from '@/components/LitigantList/index.vue'
import EviList from '@/components/CourtEvidenceList/index.vue'
import Review from './components/review.vue'
import ReviewMaterial from '@/components/ReviewMaterial/index'
import ReviewHistroy from './components/reviewHistroy.vue'
export default {
  components: {
    CaseDetail,
    LitigantList,
    ReviewMaterial,
    EviList,
    Review,
    ReviewHistroy
  },
  props: {

  },
  data() {
    return {

    }
  },
  created() {
    this.$store.commit('SET_SFLAWCASE', this.$route.query.id)
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.header {
  margin-bottom: 5px;
  font-size: 16px;
}
.bottom {
  margin-bottom: 20px;
}
</style>
