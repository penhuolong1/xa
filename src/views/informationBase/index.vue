<template>
  <div>
    <SearchForm :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @change="change" @search="search" />

    <Button type="primary" @click="addBlack">加入黑名单</Button>
    <Button type="blue4" @click="removeBlack"> 移除黑名单</Button>
    <Button type="blue3" @click="add">新增</Button>
    <Button type="danger" @click="dele">删除</Button>

    <Table
      v-if="isTable"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
      :scroll="{x:1400}"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNumber,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="operation" slot-scope="record">
        <a @click="getDetail(record)">查看详情</a>
      </div>
      <div slot="addressAndType" slot-scope="record,text">
        <p style="white-space:pre-wrap">{{ text.addressAndType }}</p>
      </div>
      <div slot="relationAndPhone" slot-scope="record,text">
        <p style="white-space:pre-wrap">{{ text.relationAndPhone }}</p>
      </div>
    </Table>
    <AddLitigant ref="addLitigant" @done="getList" />

  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Table, Button } from 'ant-design-vue'
import AddLitigant from './components/AddLitigant/index.vue'
import { litigantInfo, changeBlock, remove } from '@/api/freeze/index.js'
export default {
  components: {
    SearchForm,
    Table,
    AddLitigant,
    Button
  },
  props: {
  },
  data() {
    return {
      isTable: true,
      isSkeleton: true,
      loading: false,
      litigantInfoIds: [],
      total: 0,
      selectedRows: [],
      searchSchemaParams: {},
      searchParams: {
        pageSize: 10,
        pageNumber: 1
      },
      litigantType: 'natureMan',
      name: '',
      idCard: '',
      loginAccount: '',
      legalMan: '',
      addressAndType: '',
      searchDefaultValue: {
        litigantType: 'natureMan'
      },
      searchSchema: [
        {
          label: '搜索类型',
          type: 'radio',
          field: 'litigantType',
          options: [
            {
              label: '自然人',
              value: 'natureMan'
            },
            {
              label: '法人/非法人组织',
              value: 'legalMan'
            }
          ]
        },
        {
          label: '姓名',
          type: 'input',
          field: 'name',
          vIf: () => {
            return this.litigantType === 'natureMan'
          }
        },
        {
          label: '证件号码',
          type: 'input',
          field: 'idCard',
          vIf: () => {
            return this.litigantType === 'natureMan'
          }
        },

        {
          label: '公司/组织机构名称',
          type: 'input',
          field: 'loginAccount',
          vIf: () => {
            return this.litigantType === 'litigantType'
          }
        },
        {
          label: '组织机构代码/统一社会信息代码',
          type: 'input',
          field: 'idCard',
          vIf: () => {
            return this.litigantType === 'legalMan'
          }
        },
        {
          label: '法人代表/经营人',
          type: 'input',
          field: 'legalMan',
          vIf: () => {
            return this.litigantType === 'legalMan'
          }
        },
        {
          label: '公司/组织机构名称',
          type: 'input',
          field: 'name',
          vIf: () => {
            return this.litigantType === 'legalMan'
          }
        },
        {
          label: '登录账号',
          type: 'input',
          field: 'loginAccount'
        }
      ],
      tabledata: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '姓名',
          dataIndex: 'litigantName',
          key: 'litigantName'
        },
        {
          title: '类型',
          dataIndex: 'litigantType',
          key: 'litigantType'
        },
        {
          title: '证件类型',
          dataIndex: 'idCardType',
          key: 'idCardType'
        },
        {
          title: '证件号码',
          dataIndex: 'idCard',
          key: 'idCard'
        },
        {
          title: '地址类型 | 详细地址',
          dataIndex: 'addressAndType',
          key: 'addressAndType',
          scopedSlots: { customRender: 'addressAndType' }

        },

        {
          title: '与当事人关系 | 电话号码',
          dataIndex: 'relationAndPhone',
          key: 'relationAndPhone',
          scopedSlots: { customRender: 'relationAndPhone' }

        },
        {
          title: '登陆账号',
          dataIndex: 'loginAccount',
          key: 'loginAccount'
        },
        {
          title: '黑名单',
          dataIndex: 'inBlackList',
          key: 'inBlackList'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }

        }

      ]

    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.selectKey = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    change(value, field) {
      console.log(value)
      console.log(field)
      if (field === 'litigantType') {
        this.litigantType = value
        console.log(value)
      }
      if (field === 'name') {
        this.name = value
        console.log(value)
      }
      if (field === 'idCard') {
        this.idCard = value
        console.log(value)
      }
      if (field === 'loginAccount') {
        this.loginAccount = value
        console.log(value)
      }
      if (field === 'legalMan') {
        this.legalMan = value
        console.log(value)
      }
    },
    add() {
      this.$refs.addLitigant.show()
    },
    // 添加至黑名单
    addBlack() {
      this.selectedRows.forEach(item => {
        this.litigantInfoIds.push(item.litigantId)
      })
      this.$confirm({
        title: '是否将当事人添加至黑名单？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            litigantInfoIds: this.litigantInfoIds,
            operateType: 'add'
          }
          changeBlock(params).then(({ code, msg }) => {
            this.selectedRows = []
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 移出黑名单
    removeBlack() {
      this.selectedRows.forEach(item => {
        this.litigantInfoIds.push(item.litigantId)
      })
      this.$confirm({
        title: '是否将当事人移出黑名单？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            litigantInfoIds: this.litigantInfoIds,
            operateType: 'remove'
          }
          changeBlock(params).then(({ code, msg }) => {
            this.selectedRows = []
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 删除
    dele() {
      this.selectedRows.forEach(item => {
        this.litigantInfoIds.push(item.litigantId)
      })
      this.$confirm({
        title: '是否将该记录删除？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            litigantInfoIds: this.litigantInfoIds
          }
          remove(params).then(({ code, msg }) => {
            this.selectedRows = []
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    search(e) {
      this.searchSchemaParams = e
      this.litigantType = e.litigantType
      console.log(this.searchSchemaParams)
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList() {
      const params = {
        ...this.searchSchemaParams,
        ...this.searchParams
      }
      params.litigantType = this.litigantType
      litigantInfo(params).then(({ code, data }) => {
        if (code === 200) {
          this.total = parseInt(data.totalsCount)
          this.selectedRows = []
          this.tabledata = data.searchResult.map((item, index) => {
            item.index = index + 1
            return item
          })
        }
      })
    },
    getDetail(record) {
      this.$refs.addLitigant.show(record.litigantId)
    },
    changePage() {}
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin: 10px;
}
</style>
