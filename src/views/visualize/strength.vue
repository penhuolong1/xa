<template>
  <Layout ref="layout" :menu-num="2">
    <div class="strength-content">
      <LinkageUnit class="linkage-unit" />
      <div class="strength-left">
        <CaseOrg />
        <CaseMed style="margin-top: 20px;" />
      </div>
    </div>
  </Layout>
</template>

<script>
// import Unit from './components/strengthUnit.vue'
// import Org from './components/strengthOrg.vue'
// import Med from './components/strengthMed.vue'
import CaseOrg from './components/caseOrg.vue'
import CaseMed from './components/caseMed1.vue'
import Layout from './components/Layout.vue'
import LinkageUnit from './components/linkageUnit.vue'
import { mapGetters } from 'vuex'
import { getCourtNum } from '@/api/visualize/index.js'
export default {
  components: {
    Layout,
    LinkageUnit,
    CaseOrg,
    CaseMed
    // Unit,
    // Org,
    // Med
  },
  props: {

  },
  data() {
    return {
      info: {}
    }
  },
  computed: {
    ...mapGetters(['getCourtName'])
  },
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    getData() {
      const params = {
        courtCenter: this.getCourtName,
        year: 2021
      }
      getCourtNum(params).then(({ code, data }) => {
        if (code === 200) {
          this.info = data[0]
          this.info.unit = [
            {
              label: '区级联动单位',
              text: data[0].courtNum + '家'
            },
            {
              label: '街道/镇级联动单位',
              text: data[0].streetNum + '家'
            }
          ]
          this.info.org = [
            {
              label: '调解组织',
              text: data[0].mediaterListNum + '个'
            }
          ]
          this.info.med = [
            {
              label: '调解员',
              text: data[0].meidaterNum + '人'
            },
            {
              label: '年平均办案量',
              text: data[0].mediaterYearNum + '件'
            }
          ]
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.strength-content {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 90px;
  bottom: 20px;
  height: calc(100vh - 110px);
  border-left: none;
  justify-content: space-around;
  display: flex;
  .linkage-unit {
    display: inline-block;
    width: 600px;
  }
  .strength-left {
    display: inline-block;
    flex: 1;
    height: calc((100% - 20px) / 2);
    margin-left: 20px;
  }
}
</style>
