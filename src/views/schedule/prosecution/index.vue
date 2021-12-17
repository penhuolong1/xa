<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="green" @click="addReserveTime">添加预约时间</Button>
      <Button class="list-btn-item" type="org" @click="update">修改排期</Button>
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.lawCaseId}"
      :columns="columns"
      :row-selection="{ selectedRowKeys: selectKey, onChange: onSelectChange }"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        current: searchParams.pageNum,
        showTotal: total => {
          return `共计${total}条`
        },
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, record" class="case-bo-box">
        <a class="case-no" @click="toDetail(record)">{{ text }}</a>
        <Tag v-if="record.scheduleType === '可排期'" class="case-type" color="#108ee9">{{ record.scheduleType.substring(0, 1) }}</Tag>
      </div>
    </Table>
    <AddReserveTime ref="addReserveTime" :notification-message="notificationMessage" @done="getList" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table, Tag } from 'ant-design-vue'
import { listPreSchedulingCaseInfo } from '@/api/schedule/index.js'
import AddReserveTime from './components/addReserveTime.vue'
import { queryById, listLitInfo } from '@/api/addCase/index.js'
import { lawCaseStatus } from '@/type/index.js'

export default {
  components: {
    SearchForm,
    Button,
    Tag,
    Table,
    AddReserveTime
  },
  props: {},
  data() {
    return {
      loading: false,
      notificationMessage: '', // 发送短信内容
      total: 0, // 列表总数
      list: [], // 列表数据
      plaintiff: [], // 原告
      defendant: [], // 被告
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index',
          width: 80
        },
        {
          title: '预案号',
          dataIndex: 'preCaseNo',
          rowkey: 'preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' },
          width: 150
        },
        {
          title: '预立案时间',
          dataIndex: 'preFilingDate',
          rowkey: 'preFilingDate',
          width: 150
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 200
        },
        {
          title: '法官助理',
          dataIndex: 'assistantJudgeName',
          rowkey: 'assistantJudgeName',
          width: 100
        },
        {
          title: '速录员',
          dataIndex: 'recorderName',
          key: 'recorderName'
        },
        {
          title: '送达员',
          dataIndex: 'senderName',
          key: 'senderName'
        },
        {
          title: '调解单位/组织',
          dataIndex: 'placeName',
          key: 'placeName',
          width: 200
        },
        {
          title: '调解员',
          dataIndex: 'mediatorName',
          key: 'mediatorName',
          width: 100
        },
        {
          title: '公证送达员',
          dataIndex: 'notarySenderName',
          key: 'notarySenderName'
        },
        {
          title: '案件状态',
          dataIndex: 'lawState',
          key: 'lawState',
          width: 150
        },
        {
          title: '预约诉前程序时间',
          dataIndex: 'schedulingTime',
          key: 'schedulingTime'
        },
        {
          title: '调解地点',
          dataIndex: 'schedulingPlaceName',
          key: 'schedulingPlaceName'
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      },
      tabledata: [
      ],
      searchSchema: [
        {
          label: '预案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber'
        },
        {
          label: '预立案时间',
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
        },
        {
          label: '调解员',
          type: 'mediates',
          medType: 'people',
          field: 'peopleId'
        },
        {
          label: '送达员',
          type: 'judge',
          userType: 4,
          field: 'senderId'
        },
        {
          label: '案件状态',
          type: 'select',
          field: 'lawCaseState',
          options: lawCaseStatus
        },
        {
          label: '预约诉前程序时间',
          type: 'time',
          field: ['schedulingStartTime', 'schedulingEndTime'],
          showTime: true
        },
        {
          label: '排期状态',
          type: 'select',
          field: 'scheduleType',
          options: [
            {
              value: 1,
              label: '可排期'
            },
            {
              value: 2,
              label: '未排期'
            }
          ]
        }
      ],
      selectKey: [], // 选中的列
      selectKeyRow: {}
    }
  },
  computed: {
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    onSelectChange(selectedRowKeys, row) {
      this.selectKey = selectedRowKeys
      this.selectKeyRow = row
    },
    // 添加预约时间
    addReserveTime() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能预约一个案件')
        return
      }
      if (this.selectKeyRow[0].schedulingId) {
        this.$message.error('案件已经排期')
        return
      }
      this.getPeopleInfo()
      setTimeout(() => {
        this.notificationMessage = `您好，您的案件已确定进行诉前调查及调解。原告:${this.plaintiff ? this.plaintiff : ''},被告:${this.defendant ? this.defendant : ''}, 预案号：${this.caseInfo.lawCase.preCaseNo},案由：${this.caseInfo.brief},预约时间：${this.caseInfo.lawCase.plaintDate},调解地址：,请届时请携带身份证、证据原件并准时参加。调解咨询电话：0592-7182052。`
        this.$refs.addReserveTime.show(this.selectKeyRow[0])
      }, 500)
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
      this.searchParams.pageNum = 1

      this.getList()
    },
    getList(e) {
      console.log(e)
      this.loading = true
      listPreSchedulingCaseInfo(this.searchParams).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
          this.total = data.total
          this.selectKey = []
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
    // 修改排期
    update(e) {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能修改一个案件')
        return
      }
      if (!this.selectKeyRow[0].schedulingId) {
        this.$message.error('案件未排期')
        return
      }
      this.$refs.addReserveTime.show(this.selectKeyRow[0])
    },
    // 获取当事人信息
    async getPeopleInfo() {
      await queryById({ lawCaseId: this.selectKeyRow[0].lawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.caseInfo = data
        }
      })
      await listLitInfo({ lawCaseId: this.selectKeyRow[0].lawCaseId }).then(({ code, data }) => {
        this.plaintiff = []
        this.defendant = []
        if (code === 200) {
          data.map(item => {
            if (item.litigationStatus == '原告') {
              this.plaintiff.push(item.litigantName)
            }
            if (item.litigationStatus == '被告') {
              this.defendant.push(item.litigantName)
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
.case-bo-box {
  display: flex;
  .case-no {
    display: inline-block;
    width: 120px;
  }
  .case-type{
    height: 25px;
    margin-top: 5px;
  }
}
</style>
