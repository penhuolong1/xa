<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X mb-5">
      <!-- <Button class="list-btn-item" type="green" @click="addcase">新增案件</Button> -->
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.id}"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: searchParams.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="caseNo" slot-scope="text, record">
        <a @click="toAddCase(record)">{{ text }}</a>
      </div>
      <div slot="operate" slot-scope="text, record">
        <a @click="toAddCase(record)">进入</a>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { sfCaseSource } from '@/type/index.js'
import { listOfMove } from '@/api/sfAddcase/index.js'
import { trialFieldType2 } from '@/type/index.js'

export default {
  components: {
    SearchForm,
    Button,
    Table
  },
  props: {},
  data() {
    return {
      loading: false,
      total: 0, // 列表总数
      list: [], // 列表数据
      moveType: 1, // 1 申请司法确认 2 申请立案
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
          title: '立案日期',
          dataIndex: 'registerDate',
          rowkey: 'registerDate',
          width: 150
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 250
        },
        {
          title: '调解单位/组织名称',
          dataIndex: 'deptName',
          rowkey: 'deptName',
          width: 150
        },
        {
          title: '调解员',
          dataIndex: 'mediatorName',
          rowkey: 'mediatorName',
          width: 150
        },
        {
          title: '申请移送时间',
          dataIndex: 'moveTime',
          rowkey: 'moveTime',
          width: 200
        },
        {
          title: '反馈结果',
          dataIndex: 'moveResult',
          rowkey: 'moveResult',
          width: 150,
          customRender: (txt) => {
            const resultMap = {
              0: '未处理',
              1: '同意受理',
              2: '补正材料',
              3: '不予受理'
            }
            return resultMap[txt]
          }
        },
        {
          title: '司法确认/立案案号',
          dataIndex: 'formalCaseNo',
          rowkey: 'formalCaseNo',
          width: 150
        }
        // {
        //   title: '操作',
        //   scopedSlots: { customRender: 'operate' },
        //   width: 100
        // }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10,
        moveType: 1
      },
      searchSchema: [
        {
          label: '案件来源',
          type: 'select',
          field: 'caseSource',
          options: sfCaseSource
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber',
          trialFieldType: [
            {
              value: '诉非',
              label: '诉非'
            },
            ...trialFieldType2
          ]
        },
        {
          label: '立案时间',
          type: 'time',
          field: ['registerDateStart', 'registerDateEnd'],
          showTime: true
        },
        {
          label: '移送时间',
          type: 'time',
          field: ['moveTimeStart', 'moveTimeEnd'],
          showTime: true
        },
        {
          label: '当事人名称',
          type: 'input',
          field: 'litigantName'
        },
        {
          label: '纠纷案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '调解单位',
          type: 'mediates',
          medType: 'unit',
          field: 'unitId'
        },
        {
          label: '调解组织',
          type: 'mediates',
          medType: 'organization',
          field: 'orgId'
        }
      ],
      remarkInfo: {}, // 备注需要的信息
      isTable: true
    }
  },
  computed: {
  },
  watch: {
    $route: {
      handler() {
        // 初始化操作
        if (this.$route.name === 'moveCourtList2') { // 区分是立案还是申请司法确认
          this.searchParams.moveType = 2
          this.moveType = 2
        } else {
          this.searchParams.moveType = 1
          this.moveType = 1
        }
        this.getList()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  activated() {
    this.getList()
  },
  mounted() {
  },
  methods: {
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
    // 跳转到录入案件
    search(e) {
      const params = { ...e }
      const lab1 = params.prefixPreCaseNo1 || ''
      const lab2 = params.prefixPreCaseNo2 || ''
      params.moveType = this.moveType
      if (lab1 && lab2) {
        params.prefixStr = `(${lab1})${lab2}`
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        pageNum: 1,
        pageSize: this.searchParams.pageSize
      }
      this.getList()
    },
    getList(e) {
      this.loading = true
      listOfMove(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.registerDate = item.registerDate ? this.format(new Date(item.registerDate), 'YYYY-MM-DD') : ''
            item.moveTime = item.move_time ? this.format(new Date(item.move_time), 'YYYY-MM-DD') : ''
            item.teamCreateTime = item.teamCreateTime ? this.format(new Date(item.teamCreateTime), 'YYYY-MM-DD H:m:s') : ''
            item.mediateDate = item.mediateDate ? this.format(new Date(item.mediateDate), 'YYYY-MM-DD H:m:s') : ''
            item.endTime = item.endTime ? this.format(new Date(item.endTime), 'YYYY-MM-DD H:m:s') : ''
            return item
          })
          this.total = data.total
        }
      })
    },
    toAddCase(e) {
      const caseNo = e.caseNo || e.serialNumber
      const path = `/sfcase/detail?caseId=${e.id}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.id,
        type: 2
      }
      this.$store.dispatch('ToSfDetail', obj)
    },
    // 选择搜索条件触发
    change(e, type, val) {
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
