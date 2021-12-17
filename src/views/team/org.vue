<template>
  <div>
    <SearchForm :schema="schema" @search="search" @add="add" />

    <div class="content">
      <OrgItem v-for="(item,index) in contentList" :key="index" :org-info="item" />
    </div>
    <Pagination
      v-if="contentList.length>0"
      v-model="current"
      :total="total"
      :page-size="pageSize"
      @change="onChange"
    />
    <AddOrEditOrg ref="AddOrEditOrgShow" :is-add="isAdd" @done="getList" />
  </div>
</template>

<script>
import { Pagination } from 'ant-design-vue'
import OrgItem from './components/orgItem.vue'
import SearchForm from './components/searchFrom.vue'
import { organization, departmentList } from '@/api/team/index.js'
import AddOrEditOrg from './components/addOrEditOrg.vue'
export default {
  components: {
    OrgItem,
    AddOrEditOrg,
    SearchForm,
    Pagination
  },
  props: {

  },
  data() {
    return {
      current: 1,
      pageSize: 10,
      total: null,
      isSkeleton: false,
      list: [],
      isAdd: false,
      contentList: [],
      searchSchema: {},
      orgInfo: '',
      withOrg: [],
      schema: [
        {
          label: '所属单位/组织',
          type: 'treeSelect',
          field: 'orgName'
        },
        {
          label: '组织类型',
          type: 'select',
          field: 'deptType'
        },
        {
          label: '组织名称',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '专业领域',
          type: 'input',
          field: 'mainResponsibility'
        }
      ]
    }
  },
  created() {
    this.getList()
    // this.getUnit()
  },
  mounted() {

  },
  methods: {
    search(e) {
      this.searchSchema = e
      this.getList()
    },
    add() {
      this.isAdd = true
      console.log(this.$refs.AddOrEditOrgShow)
      this.$refs.AddOrEditOrgShow.Show()
    },
    // 获取所属单位/组织
    getUnit() {
      departmentList('ignore').then(({ code, data }) => {

      })
    },
    // 获取调解组织数据
    getList() {
      const params = {
        ...this.searchSchema
      }
      organization(params).then(({ code, data }) => {
        if (code === 200) {
          this.contentList = data.searchResult
          this.total = parseInt(data.totalsCount)
        }
      })
    },
    // 分页
    onChange(current) {
      this.current = current
      this.getList()
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
/deep/.ant-pagination{
  float: right;
  margin-right: 60px;

}
</style>
