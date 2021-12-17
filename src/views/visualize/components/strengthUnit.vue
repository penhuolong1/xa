<template>
  <div class="strength-unit-wrapper">
    <Header :title="title" :sub-title-list="info" />
    <div class="unit-list-content">
      <Title label="单位排行榜">
        <div class="detail" @click="toDetail">
          详情
          <Icon type="right" />
        </div>
      </Title>
      <Item v-for="(item, index) in list" :key="index" class="item" :item="item" :type="index%2 == 1 ? 2:0" />
    </div>
  </div>
</template>

<script>
import Header from './strengthHeader.vue'
import Title from './title.vue'
import Item from './strengthItem.vue'
import { Icon } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { getCourtCaseNum } from '@/api/visualize/index.js'
export default {
  components: {
    Header,
    Title,
    Item,
    Icon
  },
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '联动单位',
      list: [],
      subTitleList: [
        {
          label: '区级联动单位',
          text: '32 家'
        },
        {
          label: '街道/镇级联动单位',
          text: '49 家'
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
      getCourtCaseNum(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            item.name = item.courtName
            return item
          })
        }
      })
    },
    toDetail() {
      this.$router.push('/visualize/help')
    }
  }
}
</script>

<style scoped lang="less">
.strength-unit-wrapper {
}
.unit-list-content {
  margin-top: 30px;
  padding: 0 10px;
  .item {
    margin-top: 30px;
  }
}
.detail {
  color: #fff;
  cursor: pointer;
}
</style>
