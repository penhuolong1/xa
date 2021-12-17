<template>
  <div>
    <SearchForm :schema="schema" @search="search" @add="add" />
    <div class="content">
      <Spin v-if="loading" />
      <span v-if="!loading">
        <MedItem v-for="(item,index) in infoList" :key="index" :med-info="item" @done="getList" @look="add" />
      </span>
    </div>
    <Pagination
      v-model="current"
      :total="total"
      :page-size="pageSize"
      @change="onChange"
    />
    <AddOrUpDateMed ref="AddOrUpDateMedShow" @done="getList" />
  </div>
</template>

<script>
import { deptMediator } from '@/api/team/index.js'
import { Pagination, Spin } from 'ant-design-vue'
import AddOrUpDateMed from './components/addOrUpdateMed.vue'
import MedItem from './components/medItem.vue'
import SearchForm from './components/searchFrom.vue'
export default {
  components: {
    Pagination,
    Spin,
    MedItem,
    SearchForm,
    AddOrUpDateMed
  },
  props: {

  },
  data() {
    return {
      isAdd: true,
      loading: true,
      isSkeleton: false,
      current: 1,
      pageSize: 8,
      total: null,
      infoList: [],
      searchSchma: {},
      medInfo: {},
      viewType: 'self',
      schema: [
        {
          label: '所属单位/组织',
          type: 'radioTree',
          field: 'serialNumber'
        },
        {
          label: '解纷类型',
          type: 'select',
          field: 'disputeType'
        },
        {
          label: '调解员名称',
          type: 'input',
          field: 'mediatorName'
        },
        {
          label: '专业领域',
          type: 'input',
          field: 'mainPlace'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    search(e) {
      console.log(e)
      this.searchSchma = e
      this.viewType = e.viewType
      this.getList()
    },
    add(e) {
      if (e) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$refs.AddOrUpDateMedShow.show(this.isAdd, e)
    },
    getList() {
      const params = {
        ...this.searchSchma,
        pageNumber: this.current,
        pageSize: this.pageSize,
        viewType: this.viewType
      }
      this.loading = true
      deptMediator(params).then(({ code, data }) => {
        if (code === 200) {
          this.infoList = data.searchResult
          this.total = parseInt(data.totalsCount)
        }
        this.loading = false
      })
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
    },
    onChange(current) {
      this.current = current
      this.getList()
    },
    treeSelect(e) {
      console.log(e)
    },
    radioSelect(e) {
      console.log(e)
    }
  }
}
</script>
<style scoped lang="less">
.search-wrapper {
  background-color: #fdfdfd;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
  padding: 20px;
  width: 100%;
}
.content {
  width: 100%;
}
/deep/ .ant-pagination{
  float: right;
  margin-right: 60px;
}
</style>
