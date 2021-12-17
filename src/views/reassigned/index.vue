<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" :default-value="searchDefaultValue" class="enter-X" @search="search" />
    <div class="list-btn-content">
      <Button class="list-btn-item" type="danger" @click="back">回退上一流程</Button>
      <Button class="list-btn-item" type="primary" @click="assign">指派</Button>
      <Button class="list-btn-item" type="blue4" @click="changetime">修改调解时间</Button>
      <!-- <Button class="list-btn-item" type="blue3">调解员排期表</Button> -->
      <Button class="list-btn-item" @click="remark">添加备注</Button>

    </div>
    <Table
      v-if="isTable"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"

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
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
      <div slot="caseNo" slot-scope="text, records">
        <a @click="toDetail(records)">{{ text }}</a>
      </div>
      <div slot="UnitAndOriAndMediator" slot-scope="text, record">
        <div v-if="record.UnitAndOriAndMediator" class="unit">
          <span v-if="record.UnitAndOriAndMediator[0]!='null'">调解单位:{{ record.UnitAndOriAndMediator[0] }}</span>
          <span v-if="record.UnitAndOriAndMediator[1]!='null'">调解组织:{{ record.UnitAndOriAndMediator[1] }}</span>
          <span v-if="record.UnitAndOriAndMediator[2]!='null'">调解员:{{ record.UnitAndOriAndMediator[2] }}</span>
        </div>

      </div>
    </Table>
    <!-- 退回上一级 -->
    <Back ref="show" :selected-rows="selectedRows" @refresh="getlist" />
    <!-- 指派调解员 -->
    <Reassign ref="assginshow" :selected-rows="selectedRows" @refresh="getlist" />
    <!-- 修改调解时间 -->
    <ChangeTime ref="timeshow" :selected-rows="selectedRows" @refresh="getlist" />
    <!-- 添加备注 -->
    <AddRemark ref="remarkshow" @done="getlist" />

  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import Back from './components/Back'
import Reassign from './components/Reassign.vue'
import ChangeTime from './components/ChangeTime'
import AddRemark from '@/components/AddRemark'
import Next from '../SeverdManage/reAssignSeverd/components/next.vue'
import { Button, Table } from 'ant-design-vue'
import { mediationlist } from '@/api/freeze/index.js'
import { queryById, listLitInfo } from '@/api/addCase/index.js'

import { formatDate } from '@/utils/format.js'
import moment from 'moment'

export default {
  components: {
    SearchForm,
    Back,
    Reassign,
    ChangeTime,
    AddRemark,
    Next,
    Button,
    Table
  },
  props: {
  },
  data() {
    return {
      updateTime: '',
      isSkeleton: false,
      loading: false,
      assigntype: 1, // 指派类型：1：本院调解&&无特邀调解组织  2：不是本院调解 3：有特邀调解组织
      sendStatus: 'all',
      isOurMediation: 'all',
      total: 0,
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      showTime: [],
      selectedRows: [],
      selectKey: [],
      plaintiff: [], // 原告
      defendant: [], // 被告
      thirdParty: [], // 第三人
      searchDefaultValue: {
        sendStatus: 'all',
        ourMediation: 'all'
      },
      mediateTime: '',
      ourMediation: 'all',
      prefixPreCaseNo1: '',
      prefixPreCaseNo2: '',
      notificationMessage: '',
      searchSchema: [
        {
          label: '指派状态',
          type: 'radio',
          field: 'sendStatus',
          options: [
            {
              label: '全部',
              value: 'all'
            },
            {
              label: '未指派',
              value: 'unSend'
            },
            {
              label: '退回',
              value: 'refunded'
            }
          ]
        },
        {
          label: '是否本院调解',
          type: 'radio',
          field: 'ourMediation',
          options: [
            {
              label: '全部',
              value: 'all'
            },
            {
              label: '是',
              value: 'yes'
            },
            {
              label: '否',
              value: 'no'
            }
          ]
        },
        // {
        //   label: '申请流水号',
        //   type: 'input',
        //   field: 'serialNumber'
        // },
        // {
        //   label: '预立案/案号',
        //   type: 'caseNo',
        //   field1: 'prefixPreCaseNo1',
        //   field2: 'prefixPreCaseNo2',
        //   field3: 'caseNoSuffixStart',
        //   field4: 'caseNoSuffixEnd'
        // },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        },
        {
          // label: '预立案/立案时间',
          // type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          // showTime: true,
          style: 'width: 531px;'
        },

        {
          label: '法官助理',
          type: 'judge',
          userType: 3,
          field: 'assistantJudge'
        },
        {
          label: '速录员',
          type: 'judge',
          userType: 5,
          field: 'stenographer'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'reason'
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
          title: '预立案号',
          dataIndex: 'lawCaseBean.preCaseNo',
          key: 'lawCaseBean.preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }
        },
        {
          title: '案号',
          dataIndex: 'lawCaseBean.caseNo',
          key: 'lawCaseBean.caseNo',
          scopedSlots: { customRender: 'caseNo' }

        },
        {
          title: '预立案时间',
          dataIndex: 'lawCaseBean.preFilingDate',
          key: 'lawCaseBean.preFilingDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'lawCaseBean.reason',
          key: 'lawCaseBean.reason',
          width: '300px'
        },
        {
          title: '法官助理',
          dataIndex: 'lawCaseBean.lawCaseInfo.assistantJudge.name',
          key: 'lawCaseBean.lawCaseInfo.assistantJudge.name'
        },

        {
          title: '预约调解时间',
          dataIndex: 'mediateTime',
          key: 'mediateTime'
        },
        {
          title: '标识状态',
          dataIndex: 'result',
          key: 'result'
        },
        {
          title: '退回角色',
          dataIndex: 'operateName',
          key: 'operateName'
        },
        {
          title: '退回理由',
          dataIndex: 'opinion',
          key: 'opinion'
        }

      ],
      searchSchemaParams: [],
      isTable: true

    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.selectKey = selectedRows
          // this.litigants = selectedRows[0].lawCaseBean.litigants
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  created() {
    this.getlist()
  },
  mounted() {
  },
  methods: {
    toDetail(e) {
      const caseNo = e.lawCaseBean.caseNo || e.lawCaseBean.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseBean.id}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseBean.id
      }
      this.$store.dispatch('ToDetail', obj)
    },
    // 判断是否选中案件
    back() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.show.show()
    },
    // 判断指派
    assign() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      //  `（翔安法院）本院已将${this.caseInfo.lawCase.preCaseNo}${this.plaintiff}与被告:${this.defendant ? this.defendant : ''}${this.thirdParty}${this.selectedRows[0].lawCaseBean.reason}一并收件,现通知你（单位）于${this.caseInfo.lawCase.preMediateDate}请携带相关身份证明及相应证据的原件到调解地址：,将由调解员${this.caseInfo.lawCase.preMediateDate}组织你们双方当事人进行调解、证据交换及事实调查等。`
      this.$refs.assginshow.show()
    },
    // 判断修改时间
    changetime() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件修改时间')
        return
      }
      this.$refs.timeshow.show(this.selectedRows[0].lawCaseBean.id)
    },
    remark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remarkshow.show(this.selectedRows[0].lawCaseBean.id)
    },
    search(e) {
      this.prefixPreCaseNo1 = e.prefixPreCaseNo1
      this.prefixPreCaseNo2 = e.prefixPreCaseNo2
      this.searchSchemaParams = e
      this.sendStatus = e.sendStatus
      this.ourMediation = e.ourMediation
      this.searchParams.pageNumber = 1

      this.getlist()
    },
    // 分页触发
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getlist()
    },
    getlist() {
      this.isTable = false
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      delete params.sendStatus
      delete params.ourMediation
      params.ourMediation = this.ourMediation
      params.sendStatus = this.sendStatus
      if (params.prefixPreCaseNo1 || params.prefixPreCaseNo2) {
        delete params.prefixPreCaseNo1
        delete params.prefixPreCaseNo2
        const labe1 = this.prefixPreCaseNo1 || ''
        const labe2 = this.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }

      mediationlist(params).then(res => {
        this.isTable = true
        this.loading = false
        if (res.code == 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult
          this.tabledata = res.data.searchResult.map((item, index) => {
            item.mediateTime = item.mediateTime ? this.$moment(item.mediateTime).format('YYYY-MM-DD') : ''
            item.lawCaseBean.preFilingDate = item.lawCaseBean.preFilingDate ? this.$moment(item.lawCaseBean.preFilingDate) : ''
            item.index = index + 1
            if (item.UnitAndOriAndMediator) {
              item.UnitAndOriAndMediator = item.UnitAndOriAndMediator.split('|')
            }
            return item
          })
        }
      })
    },
    // 获取当事人信息
    async getPeopleInfo() {
      await queryById({ lawCaseId: this.selectedRows[0].lawCaseBean.id }).then(({ code, data }) => {
        if (code === 200) {
          this.caseInfo = data
        }
      })
      await listLitInfo({ lawCaseId: this.selectedRows[0].lawCaseBean.id }).then(({ code, data }) => {
        this.plaintiff = []
        this.defendant = []
        this.thirdParty = []
        if (code === 200) {
          data.map(item => {
            if (item.litigationStatus == '原告') {
              this.plaintiff.push(item.litigantName)
            }
            if (item.litigationStatus == '被告') {
              this.defendant.push(item.litigantName)
            }
            if (item.litigationStatus == '第三人') {
              this.thirdParty.unshift('第三人')
              this.thirdParty.push(item.litigantName)
            } else {
              this.thirdParty = []
            }
          })
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
  /deep/.ant-calendar-picker-input.ant-input{
    min-width: 235px;
  }
  .deadline{
    // display: inline-flex;
    span{
      display:inline
    }
  }
//  /deep/.UnitAndOriAndMediator{
//   // min-width:200px;
//   // display: table-cell;
//  span{
//    display: inline-flex;
//  }
//  }
 .unit{
   display: grid;
 }
</style>
