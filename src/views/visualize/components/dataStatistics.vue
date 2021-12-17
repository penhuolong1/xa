<template>
  <div class="dataStatistics-wrapper">
    <Title :label="data1.courtCenter" label1="七街道两镇" />
    <div v-if="needContent" class="content">
      <div class="label">地址：{{ data1.courtCenterPlace }}</div>
      <div class="label">联系方式: {{ data1.centerPhone }}</div>
      <div class="horizontal-strip">
        <label>受理</label>
        <div class="strip-box">
          <div class="strip type1" :style="{'width':data1.sl + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>登记</label>
        <div class="strip-box">
          <div class="strip type2" :style="{'width':data1.dj + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>分流</label>
        <div class="strip-box">
          <div class="strip type3" :style="{'width':data1.fl + '%'}" />
        </div>
      </div>
      <div class="horizontal-strip">
        <label>化解</label>
        <div class="strip-box">
          <div class="strip type4" :style="{'width':data1.hj + '%'}" />
        </div>
      </div>
    </div>
    <GraphicData class="graphic-data" :info="{msuccess: data1.msuccess, inNum: data1.inNum}" />
  </div>
</template>

<script>
import Title from './title.vue'
import GraphicData from './graphicData.vue'
import { getCentgerCourt } from '@/api/visualize/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Title,
    GraphicData
  },
  props: {
    needContent: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data1: {
      }
    }
  },
  computed: {
    ...mapGetters(['getCourtName'])
  },
  watch: {
    getCourtName() {
      this.getData()
    }
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
        startDate: '2021-01-01 00:00:00',
        endDate: '2021-08-01 00:00:00'
      }
      getCentgerCourt(params).then(({ code, data }) => {
        if (code === 200) {
          this.data1 = data[0]
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.dataStatistics-wrapper {
}
.graphic-data {
  margin-top: 10px;
}
.content {
  padding-left: 20px;
  color: #fff;
  font-size: 14px;
  margin-top: 10px;
  .label {
    line-height: 35px;
  }
  .horizontal-strip {
    display: flex;
    height: 35px;
    align-items: center;
    label {
      width: 50px;
    }
    .strip-box {
      flex: 1;
      height: 20px;
      .strip {
        width: 100%;
        height: 100%;
        &.type1 {
          background: linear-gradient(to right,rgba(0,172,233,0.20) 0%, #01fef6 100%);
        }
        &.type2 {
          background: linear-gradient(to right,rgba(253,161,1,0.20) 0%, #fda101 100%);
        }
        &.type3 {
          background: linear-gradient(to right,rgba(0,172,233,0.20) 0%,#01ffd2 100%);
        }
        &.type4 {
          background: linear-gradient(to right,rgba(0,172,233,0.20) 0%, #0178ff 100%);
        }
      }
    }
  }
}
</style>
