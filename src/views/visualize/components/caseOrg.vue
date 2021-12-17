<template>
  <MediationOrganization title="调解组织">
    <div class="org-wrapper">
      <OrgNum class="org-item" />
      <OrgRank class="org-item" />
    </div>
  </MediationOrganization>
</template>

<script>
import MediationOrganization from './mediationOrganization.vue'
import OrgNum from './OrgNum.vue'
import OrgRank from './OrgRank.vue'

export default {
  components: {
    MediationOrganization,
    OrgNum,
    OrgRank
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
