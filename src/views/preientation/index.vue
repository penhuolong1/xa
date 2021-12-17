<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="defaultValue" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="yetMediate">适宜调解</Button>
      <Button class="list-btn-item" type="org" @click="next">转下一流程</Button>
      <Button class="list-btn-item" type="blue4" @click="addPalaceTime">修改诉前调查时间</Button>
      <Button class="list-btn-item" @click="addRemark">添加备注</Button>

    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :row-selection="rowSelection"
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
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
      <div slot="operate" slot-scope="text, record">
        <div><a @click="toDetail(record, 5)">办理</a></div>
        <a @click="toRtc(record)">调解室</a>
      </div>
    </Table>
    <!-- 下一流程 -->
    <NextStep ref="next" :select-key="selectKey" :next-list="nextList" @done="getList" />
    <!-- 添加备注 -->
    <AddRemark ref="remark" />
    <!-- 修改诉前调查时间 -->
    <AddPalaceTime ref="addPalaceTime" @done="getList" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import NextStep from '@/components/NextStep'
import AddRemark from '@/components/AddRemark'
import AddPalaceTime from './components/addPalaceTime.vue'
import { listPreCaseInfo, yetMediate } from '@/api/preientation'
import { intoRoom } from '@/api/rtc/index.js'

export default {
  components: {
    SearchForm,
    Button,
    Table,
    NextStep,
    AddRemark,
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
          rowkey: 'index'
        },
        {
          title: '预案号',
          dataIndex: 'preCaseNo',
          rowkey: 'preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }
        },
        {
          title: '预立案时间',
          dataIndex: 'preFillingDate',
          rowkey: 'preFillingDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason'
        },
        {
          title: '送达情况',
          dataIndex: 'preSendState',
          rowkey: 'preSendState'
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudge',
          rowkey: 'assistantJudge'
        },
        {
          title: '预约诉前调查时间',
          dataIndex: 'schedulingStartTime',
          key: 'schedulingStartTime'
        },
        {
          title: '诉前调查记录次数',
          dataIndex: 'schedulingcount',
          key: 'schedulingcount'
        },
        {
          title: '标识状态',
          dataIndex: 'markState',
          key: 'markState'
        },
        {
          title: '操作',
          dataIndex: 'operate',
          key: 'operate',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10,
        preSendState: ''
      },
      defaultValue: {
        preSendState: ''
      },
      tabledata: [
      ],
      searchSchema: [
        {
          label: '诉前送达结果',
          type: 'radio',
          field: 'preSendState',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '诉前送达成功-适宜调解',
              label: '诉前送达成功-适宜调解'
            },
            {
              value: '诉前送达不成功-不适宜调解',
              label: '诉前送达不成功-不适宜调解'
            },
            {
              value: '送达失败',
              label: '送达失败'
            },
            {
              value: '电话送达成功-适宜调解',
              label: '电话送达成功-适宜调解'
            },
            {
              value: '现场送达成功',
              label: '现场送达成功'
            },
            {
              value: '其他',
              label: '其他'
            }
          ],
          className: 'form-item-5'
        },
        {
          label: '预立案案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案时间',
          type: 'time',
          field: ['preStartDate', 'preEndDate'],
          showTime: true
        },
        {
          label: '法官助理',
          type: 'judge',
          userType: 3,
          field: 'assistantId'
        },
        {
          label: '速录员',
          type: 'judge',
          userType: 5,
          field: 'recorderId'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        }
      ],
      selectKey: [], // 选中的列
      nextList: [
        {
          value: 3,
          label: '待正式立案'
        },
        {
          value: 4,
          label: '诉前销案'
        },
        {
          value: 5,
          label: '不予受理'
        }
      ],
      isTable: true
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectKey)
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    // 下一个流程
    next() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (!this.selectKey.length > 0) {
        this.$message.error('一次只能选择一个案件')
        return
      }
      this.$refs.next.show()
    },
    // 修改诉前调查时间
    addPalaceTime() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (!this.selectKey.length > 0) {
        this.$message.error('一次只能选择一个案件')
        return
      }
      this.$refs.addPalaceTime.show(this.selectKey[0])
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
      if (lab1 && lab2) {
        params.prefixPreCaseNo = '(' + lab1 + ')' + lab2
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize
      }
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      this.isTable = false
      listPreCaseInfo(this.searchParams).then(({ code, data }) => {
        this.isTable = true
        this.loading = false
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
          this.total = data.total
        }
      })
    },
    // 跳转详情
    toDetail(e, type) {
      console.log(type)
      const caseNo = e.caseNo || e.preCaseNo
      let path = `/case/detail?lawCase=${e.lawCaseId}`
      if (type) {
        path = `/case/detail?lawCase=${e.lawCaseId}&menu=${type}`
      }
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId
      }
      this.$store.dispatch('ToDetail', obj)
    },
    async toRtc(e) {
      this.$store.commit('SET_LAWCASE', e.lawCaseId)
      await intoRoom({ lawCaseId: e.lawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
          this.$store.commit('SET_RTCTOKEN', data.result)
          this.$router.push('/rtc')
        }
      })
    },
    // 添加备注
    addRemark() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectKey[0].lawCaseId)
    },
    // 适宜调解
    yetMediate() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$confirm({
        title: '您确认将选中的案件进入待指派调解员？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            lawCaseId: this.selectKey[0].lawCaseId,
            lawCaseState: '调解中'
          }
          yetMediate(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}

</style>
