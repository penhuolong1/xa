<template>
  <div class="page">
    <div>
      <!-- 头部 -->
      <Head />
      <div style="margin:40px 160px">
        <BreadCrumb :bread-list="breadList" />
      </div>
      <Details
        :type="2"
        :popularization-title="popularizationTitle"
        :popularization-send-dept-name="popularizationSendDeptName"
        :popularization-send-time="popularizationSendTime"
        :popularization-content="popularizationContent"
        :popularization-files="popularizationFiles"
      />
    </div>
    <!-- 悬浮 -->
    <Service />
  </div>
</template>

<script>
import Head from '../../components/head.vue'
import BreadCrumb from '../../components/breadCrumbs.vue'
import Details from '../components/details.vue'
import Service from '../../components/customerService.vue'
import { popularizationDetails } from '@/api/home/index.js'
export default {
  components: {
    Head,
    BreadCrumb,
    Details,
    Service
  },
  data() {
    return {
      breadList: [
        {
          path: '',
          name: '云上普法'
        },
        {
          path: ('/examples/popularization'),
          name: '普法实例'
        },
        {
          path: '',
          name: '详情'
        }
      ], // 路由集合
      popularizationTitle: '',
      popularizationSendDeptName: '',
      popularizationSendTime: '',
      popularizationContent: '',
      popularizationFiles: ''
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      const params = {
        id: this.$route.query.id
      }
      popularizationDetails(params).then(({ code, data }) => {
        if (code === 200) {
          console.log('data', data)
          this.popularizationSendTime = data.popularizationSendTime ? this.$moment(data.popularizationSendTime).format('YYYY-MM-DD HH:mm:ss') : ''
          this.popularizationContent = data.popularizationContent
          this.popularizationFiles = data.popularizationFiles
          this.popularizationTitle = data.popularizationTitle
          this.popularizationSendDeptName = data.popularizationSendDeptName
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  position: relative;
  min-width: 1200px;
  height: 100vh;
  background: #f2f5fa;
}

</style>
