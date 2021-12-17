<template>
  <div class="page">
    <div>
      <!-- 头部 -->
      <Head />

      <div class="bread-crumb-inquire">
        <!-- 面包屑 -->
        <BreadCrumb :bread-list="breadList" />
        <!-- 搜索 -->
        <Inquire @onChange="onChange" @handleQuery="handleQuery" />
      </div>
      <div class="content">
        <div class="box">
          <div>
            <div v-for="(item,index) in stripList" :key="index" class="strip" v-bind="item" @click="handleDetails(item)">
              <Strip :type="2" :title="item.popularizationSendDept" :content="item.popularizationTitle" :date="item.popularizationSendTime" />
            </div>
          </div>

          <Pagination :total="total" :pages="pages" @handlePageNum="handlePageNum" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Head from '../../components/head.vue'
import BreadCrumb from '../../components/breadCrumbs.vue'
import Inquire from '../../components/Inquire.vue'
import Strip from '../components/strip.vue'
import Pagination from '../../components/pagination.vue'
import { popularization } from '@/api/home/index.js'
export default {
  components: {
    Head,
    BreadCrumb,
    Inquire,
    Strip,
    Pagination
  },
  data() {
    return {
      total: 100,
      keyword: '',
      breadList: [
        {
          path: '',
          name: '云上普法'
        },
        {
          path: '',
          name: '普法实例'
        }
      ], // 路由集合
      stripList: [],
      pageNumber: 1,
      pages: ''

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 关键字
    onChange(e) {
      console.log('keyword5', e)
      console.log('keyword6', e.target._value)
      this.keyword = e.target._value
      console.log('keyword1', this.keyword)
    },
    // 查询
    handleQuery() {
      console.log('keyword2', this.keyword)
      this.getList()
      console.log('keyword3', this.keyword)
    },
    // 加载数据
    async getList() {
      const params = {
        keyword: this.keyword,
        pageNumber: 1,
        pageSize: 10
      }
      popularization(params).then(({ code, data }) => {
        if (code === 200) {
          this.stripList = data.searchResult.map(item => {
            item.popularizationSendTime = item.popularizationSendTime ? this.$moment(item.popularizationSendTime).format('YYYY-MM-DD') : ''
            return item
          })
          this.stripList[0].popularizationSendDept = '最新公告'
          this.total = data.totalsCount
          this.pages = data.totalsPages
        }
      })
    },
    // 普法动态 详情
    handleDetails(item) {
      console.log('1222', item)
      this.$router.push(`/examples/details?id=${item.popularizationId}`)
    },
    // 页码选择
    handlePageNum(e) {
      this.pageNumber = e
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
// 面包屑、搜索
.bread-crumb-inquire {
  margin: 40px 160px 20px;
  display: flex;
  justify-content: space-between;
}
// 主要内容
.content {
  margin: 0 auto;
  width: calc(100% - 320px);
  .box {
    width: 100%;
    padding: 20px 80px 40px;
    height: 674px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px undefined;
    display: grid;
    grid-template-rows: 95% 5%;
    .strip {
  width: 100%;
    }
  }
}
</style>
