<template>
  <div class="strength-unit-wrapper">
    <Header :title="title" :sub-title-list="info" />
    <RadarChart title="调解员类型" />
    <div class="unit-list-content">
      <Title label="调解员排行榜" />
      <Item v-for="(item, index) in list" :key="index" class="item" :item="item" :type="index%2 == 1 ? 2:0" />
    </div>
  </div>
</template>

<script>
import Header from './strengthHeader.vue'
import Title from './title.vue'
import Item from './strengthItem.vue'
import RadarChart from './typeRadarChart.vue'
import { mapGetters } from 'vuex'
import { getMediaterNum } from '@/api/visualize/index.js'
export default {
  components: {
    Header,
    Title,
    Item,
    RadarChart
  },
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '调解员',
      list: [],
      subTitleList: [
        {
          label: '调解组织',
          text: '49 个'
        }
      ]
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
        startDate: '2021-01-01 00:00:00',
        endDate: '2021-08-01 00:00:00'
      }
      getMediaterNum(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            item.name = item.meidaterName
            return item
          }).splice(0, 3)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.unit-list-content {
  margin-top: 30px;
  padding: 0 10px;
  .item {
    margin-top: 30px;
  }
}
</style>
