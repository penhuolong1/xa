<template>

  <div class="court-list-wrapper">
    <div class="list">
      <div class="title">{{ getCourtName }}一览</div>
      <CourtItem v-for="(item, index) in list" :key="index" :item="item" @display="display" @displayNone="displayNone" />
    </div>

    <!-- 浮窗 -->
    <div ref="acp" class="list1">
      <div class="title">{{ listName }}</div>
      <CourtItem1 v-for="(item, index) in list" :key="index" :item="item" />
    </div>
  </div>
</template>

<script>
import CourtItem from './courtItem.vue'
import CourtItem1 from './courtItem1.vue'
import { getCenterCourtStreet } from '@/api/visualize/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    CourtItem,
    CourtItem1
  },
  props: {},
  data() {
    return {
      list: [],
      listName: ''
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
  mounted() {},
  methods: {
    display(e) {
      if (e == '凤祥街道') {
        this.listName = '凤祥街道分中心'
      } else if (e == '新店街道') {
        this.listName = '新店街道分中心'
      } else if (e == '民安街道') {
        this.listName = '民安街道分中心'
      } else if (e == '金海街道') {
        this.listName = '金海街道分中心'
      } else if (e == '马巷街道') {
        this.listName = '马巷街道分中心'
      } else if (e == '内厝街道') {
        this.listName = '内厝街道分中心'
      } else if (e == '香山街道') {
        this.listName = '香山街道分中心'
      }
      // 操作dom 获取p标签改变其样式
      var acps = this.$refs.acp
      acps.style.display = 'block'
    },
    displayNone() {
      // 操作dom 获取p标签改变其样式
      var acps = this.$refs.acp
      acps.style.display = 'none'
    },
    getData() {
      const params = {
        courtCenter: this.getCourtName,
        startDate: '2021-01-01 00:00:00',
        endDate: '2021-08-01 00:00:00'
      }
      const streetList = [
        '凤祥街道',
        '新店街道',
        '民安街道',
        '金海街道',
        '马巷街道',
        '内厝街道',
        '香山街道',
        '大嶝街道'
      ]
      getCenterCourtStreet(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.map((item, index) => {
            item.streetName = streetList[index]
            return item
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.court-list-wrapper {
  .title {
    background: url('../../../assets/visualize/titles.png');
    background-size: 482px 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    color: #fff;
    padding-left: 10px;
  }
  .list {
    position: absolute;
    right: 0px;
    width: 482px;
    height: calc(100vh - 110px);
    padding: 15px 20px 20px;
    background: url('../../../assets/visualize/bg8.png') no-repeat;
    background-size: 100% 100%;
    overflow: auto;
  }
  .list1 {
    display: none;
    position: absolute;
    right: 400px;
    top: 30px;
    width: 452px;
    height: calc(100vh - 140px);
    padding: 15px 20px 20px;
    background: url('../../../assets/visualize/bg8.png') no-repeat;
    background-size: 100% 100%;
    overflow: auto;
  }
}
</style>
