<template>
  <MediationOrganization title="调解员">
    <div class="org-wrapper">
      <MedNum class="org-item" />
      <MedRank class="org-item" />
    </div>
  </MediationOrganization>
</template>

<script>
import MediationOrganization from './mediationOrganization.vue'
import MedNum from './medNum.vue'
import MedRank from './medRank.vue'

export default {
  components: {
    MediationOrganization,
    MedNum,
    MedRank
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
.org-wrapper {
  padding-top: 20px;
  height: calc(100% - 72px);
  display: flex;
  .org-item  {
    display: inline-block;
    width: calc((100% - 160px) / 2);
    margin: 0 40px;
    height: 100%;
  }
}
</style>
