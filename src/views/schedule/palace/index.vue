<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @change="search" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="addPalace(1)">添加排庭时间</Button>
      <Button class="list-btn-item" type="org" @click="addPalace(0)">修改排庭</Button>
      <Button v-if="searchParams.queryCaseType === 1" class="list-btn-item" type="primary" @click="merge">合并系列案件</Button>
      <Button v-if="searchParams.queryCaseType === 2" class="list-btn-item" type="blue4" @click="cencelCombine">解除合并</Button>
      <Button class="list-btn-item" type="blue3" @click="eliminate">销庭</Button>
    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="list"
      :loading="loading"
      :scroll="{ x: 1400 }"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        showSizeChanger: true,
        showQuickJumper: true,
        current: searchParams.pageNum
      }"
      @change="changePage"
    >
      <div slot="caseNo" slot-scope="text, record" class="case-bo-box">
        <a class="case-no" @click="toDetail(record)">{{ text }}</a>
        <Tag v-if="record.scheduleType === '可排庭'" class="case-type" color="#108ee9">{{ record.scheduleType.substring(0, 1) }}</Tag>
      </div>
    </Table>
    <AddPalaceTime ref="addPalaceTime" @done="getList" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table, Tag } from 'ant-design-vue'
import { listSchedulingCaseInfo, combineCase, cencelCombine, cancelScheduling } from '@/api/schedule/index.js'
import { lawCaseStatus } from '@/type/index.js'
import AddPalaceTime from './components/addPalaceTime.vue'
const schema = [
  {
    title: '承办部门',
    dataIndex: 'takingDepartment',
    rowkey: 'takingDepartment'
  },
  {
    title: '开庭地点',
    dataIndex: 'tribunal',
    key: 'tribunal'
  },
  {
    title: '承办法官',
    dataIndex: 'judge',
    key: 'judge'
  },
  {
    title: '书记员',
    dataIndex: 'clerk',
    key: 'clerk'
  },
  {
    title: '排庭时间',
    dataIndex: 'startTime',
    key: 'startTime'
  },
  {
    title: '排庭状态',
    dataIndex: 'state',
    key: 'state'
  },
  {
    title: '确认排庭时间',
    dataIndex: 'confirmStartTime',
    key: 'confirmStartTime'
  },
  // {
  //   title: '创建日期',
  //   dataIndex: 'createTime',
  //   key: 'createTime'
  // },
  {
    title: '案件状态',
    dataIndex: 'lawCaseStatus',
    key: 'lawCaseStatus'
  }
]
export default {
  components: {
    SearchForm,
    Button,
    Tag,
    Table,
    AddPalaceTime
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index',
          width: 80
        },
        {
          title: '案号',
          dataIndex: 'caseNo',
          rowkey: 'caseNo',
          scopedSlots: { customRender: 'caseNo' },
          width: 150
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason'
        },
        {
          title: '立案时间',
          dataIndex: 'filingDate',
          rowkey: 'filingDate'
        },
        ...schema
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        queryCaseType: 1,
        pageNum: 1,
        pageSize: 10
      },
      searchDefaultValue: {
        queryCaseType: 1
      },
      tabledata: [
      ],
      searchSchema: [
        {
          label: '',
          type: 'radioButton',
          field: 'queryCaseType',
          options: [
            {
              value: 1,
              label: '全部案件'
            },
            {
              value: 2,
              label: '系列案件'
            }
          ],
          style: 'width: 240px;'
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '立案时间',
          type: 'time',
          field: ['startDate', 'endDate'],
          showTime: true
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '承办部门',
          type: 'select',
          field: 'takingDepartmentId'
        },
        {
          label: '开庭地点',
          type: 'select',
          field: 'tribunalId'
        },
        {
          label: '法官',
          type: 'judge',
          userType: 1,
          field: 'judgeId'
        },
        {
          label: '书记员',
          type: 'judge',
          userType: 2,
          field: 'clerkId'
        },
        {
          label: '送达员',
          type: 'judge',
          userType: 4,
          field: 'sendId'
        },
        {
          label: '案件状态',
          type: 'select',
          field: 'lawCaseState'
        },
        {
          label: '排庭时间',
          type: 'time',
          field: ['startTime', 'endTime'],
          showTime: true
        },
        {
          label: '确认排庭时间',
          type: 'time',
          field: ['confirmStartTime', 'confirmStartTime'],
          showTime: true
        },
        {
          label: '排庭状态',
          type: 'select',
          field: 'lawCaseState',
          options: [
            {
              value: 1,
              label: '可排庭'
            },
            {
              value: 2,
              label: '未排庭'
            }
          ]
        }
      ],
      isTable: true,
      selectKey: [] // 选中的列
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectedRows)
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    // 添加开庭时间
    addPalace(type) {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能添加一个案件')
        return
      }
      if (type === 1) {
        if (this.selectKey[0].startTime) {
          this.$message.error('该案件已经是存在开庭时间')
          return
        }
      } else {
        if (!this.selectKey[0].startTime) {
          this.$message.error('请先添加排庭时间')
          return
        }
      }
      this.$refs.addPalaceTime.show(this.selectKey[0])
    },
    // 合并案件
    merge() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      combineCase(this.selectKey.map(item => item.lawCaseId)).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getList()
        }
      })
    },
    // 解除合并
    cencelCombine() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      cencelCombine(this.selectKey.map(item => item.relationId)).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getList()
        }
      })
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList()
    },
    search(e) {
      console.log(e)
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      params.prefixPreCaseNo = lab1 + lab2
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize
      }
      this.searchParams.pageNum = 1

      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      if (this.searchParams.queryCaseType === 1) {
        this.columns = [
          {
            title: '序号',
            dataIndex: 'index',
            rowkey: 'index',
            width: 80
          },
          {
            title: '案号',
            dataIndex: 'caseNo',
            rowkey: 'caseNo',
            scopedSlots: { customRender: 'caseNo' },
            width: 200
          },
          {
            title: '当事人 | 案由',
            dataIndex: 'reason',
            rowkey: 'reason'
          },
          {
            title: '立案时间',
            dataIndex: 'filingDate',
            rowkey: 'filingDate'
          },
          ...schema
        ]
      } else {
        this.columns = [
          {
            title: '序号',
            dataIndex: 'index',
            rowkey: 'index',
            width: 80
          },
          {
            title: '案号',
            dataIndex: 'caseNos',
            rowkey: 'caseNos',
            width: 400
          },
          ...schema
        ]
      }
      this.isTable = false
      listSchedulingCaseInfo(this.searchParams).then(({ code, data }) => {
        this.isTable = true
        this.loading = false
        this.selectKey = []
        if (code === 200) {
          const stateMap = {
            0: '预排庭',
            1: '开庭'
          }
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.state = stateMap[item.state]
            item.lawCaseStatus = item.lawCaseStatus ? lawCaseStatus.find(item1 => item1.value === item.lawCaseStatus).label : ''
            return item
          })
          this.total = data.total
        }
      })
    },
    // 跳转详情
    toDetail(e) {
      const caseNo = e.caseNo || e.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    // 消庭
    eliminate() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      cancelScheduling(this.selectKey.map(item => item.schedulingId)).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getList()
        }
      })
    }

  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}
.case-bo-box {
  display: flex;
  .case-no {
    display: inline-block;
    width: 150px;
  }
  .case-type{
    height: 25px;
    margin-top: 5px;
  }
}
</style>
