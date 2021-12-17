<template>
  <Layout ref="layout" :menu-num="2">
    <div class="strength-content">
      <div><Unit :info="info.unit" /></div>
      <div><Org :info="info.org" /></div>
      <div><Med :info="info.med" /></div>
    </div>
  </Layout>
</template>

<script>
import Unit from './components/strengthUnit.vue'
import Org from './components/strengthOrg.vue'
import Med from './components/strengthMed.vue'
import Layout from './components/Layout.vue'
import { mapGetters } from 'vuex'
import { getCourtNum } from '@/api/visualize/index.js'
export default {
  components: {
    Layout,
    Unit,
    Org,
    Med
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
  left: 0px;
  top: 130px;
  width: 100%;
  height: calc(100vh - 150px);
  display: flex;
  padding: 20px;
  border-left: none;
  justify-content:space-around;
  &>div {
    width: 32%;
    height: 100%;
    border: 1px solid rgba(98,162,205,0.2);
    position: relative;
    padding: 10px 30px;
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
  }
}
</style>
