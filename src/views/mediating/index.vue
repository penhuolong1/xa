<template>
  <div>
    <SearchForm :is-skeleton="isSkeleton" :default-value="defaultValue" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content">
      <Button class="list-btn-item" type="danger" @click="back">退回</Button>
      <Button class="list-btn-item" type="org" @click="next">转下一流程</Button>
      <Button class="list-btn-item" type="blue4" @click="application">申请联动</Button>
      <Button class="list-btn-item" type="blue3" @click="changetime">修改调解时间</Button>
      <Button class="list-btn-item" @click="addRemark">添加备注</Button>
    </div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :row-selection="rowSelection"
      :loading="loading1"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return index}"
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
      <div slot="operation" slot-scope="text, record">
        <div><a @click="toDetail(record)">办理</a></div>
        <div><a @click="toRtc(record)">调解室</a></div>
        <div v-if="record.submitFlag"><a @click="getResult(record)">调解结果</a></div>
      </div>
      <div slot="orgUnit" slot-scope="text, record">
        <div v-if="record.orgUnit">
          <span v-if="record.unitName">调解单位:{{ record.unitName }}</span>
          <span v-if="record.orgName">调解组织:{{ record.orgName }}</span>
        </div>
      </div>

    </Table>
    <Back ref="backshow" :selected-rows="selectedRows" @refresh="getlist" />
    <ChangeTime ref="timeshow" :selected-rows="selectedRows" :litigants="litigants" @refresh="getlist" />
    <!-- <Application ref="applicationshow" :selected-rows="selectedRows" @refresh="getlist" /> -->
    <!-- 申请联动 -->
    <ApplyLinkage ref="applyLinkage" @done="getlist" />

    <!-- 添加备注 -->
    <AddRemark ref="remark" @done="getlist" />
    <!-- 转下一流程 -->
    <NextProcess ref="nextShow" @done="getlist" />
    <Modal
      v-model="isResult"
      :mask-closable="false"
      title="调解结果"
    >
      <div>
        <Row class="row">
          <Col :span="6" class="label">调解结果:</Col>
          <Col :span="12">{{ result.mediateResult }}</Col>
        </Row>
        <Row class="row">
          <Col :span="6" class="label">{{ result.mediateResult === '调解成功' ? '是否申请司法确认:':'是否申请立案' }}</Col>
          <Col :span="12">{{ result.judicialApplyFlag ? '是':'否' }}</Col>
        </Row>
        <Row class="row">
          <Col :span="6" class="label">调解结束时间:</Col>
          <Col :span="12">{{ result.mediateEndDate }}</Col>
        </Row>
      </div>

      <template slot="footer">
        <Button @click="isResult=false">
          取消
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import Back from './Companents/Back'
import ChangeTime from './Companents/ChangeTime'
import AddRemark from '@/components/AddRemark'
import NextProcess from './Companents/NextProcess'
import { getBrief, queryJudge, queryById, listLitInfo } from '@/api/addCase/index.js'
import { Button, Table, Modal, Row, Col } from 'ant-design-vue'
import { onMediation } from '@/api/freeze/index.js'
import { formatDate } from '@/utils/format.js'
import { intoRoom, intoSfRoom } from '@/api/rtc/index.js'
import ApplyLinkage from '@/components/Linkage/applyLinkage.vue'
import { getResultOfCase } from '@/api/sfAddcase/index.js'
export default {
  components: {
    SearchForm,
    Back,
    ChangeTime,
    ApplyLinkage,
    AddRemark,
    NextProcess,
    Button,
    Modal,
    Row,
    Col,
    Table
  },
  props: {
  },
  data() {
    return {
      isSkeleton: false,
      isTable: true,
      ourMediation: 'all',
      isback: false,
      ischangetime: false,
      loading1: false,
      prefixPreCaseNo1: '',
      prefixPreCaseNo2: '',
      notificationMessage: '', // 发送短信内容
      litigants: [],
      plaintiff: [], // 原告
      defendant: [], // 被告
      loading: false,
      isResult: false,
      result: {},
      form: this.$form.createForm(this, { name: 'coordinated' }),
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      },
      defaultValue: {
        ourMediation: 'all'
      },
      total: 0,
      sendStatus: 'all',
      selectedRows: [],
      searchSchema: [
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
              value: 'ownProcess'
            },
            {
              label: '否',
              value: 'otherProcess'
            }
          ]
        },
        {
          label: '调解单位',
          type: 'mediates',
          medType: 'unit',
          field: 'mediationUnit'
        },
        {
          label: '调解组织',
          type: 'mediates',
          medType: 'organization',
          field: 'mediationOrganization'
        },
        {
          label: '调解员',
          type: 'mediates',
          medType: 'people',
          field: 'mediationPeople'

        },
        {
          label: '申请流水号',
          type: 'input',
          field: 'serialNumber'
        },
        {
          label: '法官助理',
          type: 'judge',
          userType: 3,
          field: 'assistan'
        },
        {
          label: '预立案案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'caseNoSuffixStart',
          field4: 'caseNoSuffixEnd',
          style: 'width: 510px;'
        },
        {
          label: '预立案/立案时间',
          type: 'time',
          field: ['fillingDateStart', 'fillingDateEnd'],
          showTime: true
        },
        {
          label: '速录员',
          type: 'judge',
          userType: 5,
          field: 'assistantJudge'
        },
        {
          label: '案由',
          type: 'brief',
          field: 'reason'
        },
        {
          label: '当事人姓名',
          type: 'input',
          field: 'litigantName'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 80
        },
        {
          title: '预案号',
          dataIndex: 'lawCaseBean.preCaseNo',
          key: 'lawCaseBean.preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }
        },
        {
          title: '案号',
          dataIndex: 'lawCaseBean.caseNo',
          key: 'lawCaseBean.caseNo',
          scopedSlots: { customRender: 'preCaseNo' }

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
          width: 200
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
          title: '调解期限',
          dataIndex: 'duration',
          key: 'duration'
        },
        {
          title: '调解单位/组织名称',
          dataIndex: 'orgUnit',
          key: 'orgUnit',
          scopedSlots: { customRender: 'orgUnit' },
          width: 200
        },
        {
          title: '调解员',
          dataIndex: 'mediatorBean.name',
          key: 'mediatorBean.name',
          width: 150

        },
        {
          title: '调解地点',
          dataIndex: 'mediatePlace',
          key: 'mediatePlace'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }

      ],
      searchSchemaParams: [],
      tabledata: [],
      unit: [],
      organization: [],
      people: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          this.litigants = selectedRows[0].lawCaseBean.litigants
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
      // console.log(e)
      const caseNo = e.lawCaseBean.caseNo || e.lawCaseBean.preCaseNo
      const path = `/case/detail?lawCase=${e.lawCaseBean.id}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseBean.id
      }
      this.$store.dispatch('ToDetail', obj)
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getlist()
    },
    search(e) {
      this.ourMediation = e.ourMediation
      this.searchSchemaParams = e
      this.prefixPreCaseNo1 = e.prefixPreCaseNo1
      this.prefixPreCaseNo2 = e.prefixPreCaseNo2
      this.searchParams.pageNumber = 1
      this.getlist()
    },
    back() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.$refs.backshow.show()
    },
    application() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      console.log(this.selectedRows[0].lawCaseBean.id)
      this.$refs.applyLinkage.show(this.selectedRows[0].lawCaseBean.id)
    },
    changetime() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.getPeopleInfo()
      setTimeout(() => {
        this.notificationMessage = `您好，您的案件已确定进行诉前调查及调解。原告:${this.plaintiff ? this.plaintiff : ''},被告:${this.defendant ? this.defendant : ''}, 预案号：${this.caseInfo.lawCase.preCaseNo},案由：${this.caseInfo.brief},预约时间：${this.caseInfo.lawCase.plaintDate},调解地址：,请届时请携带身份证、证据原件并准时参加。调解咨询电话：0592-7182052。`
        this.$refs.timeshow.show()
      }, 500)
    },
    // 添加备注
    addRemark() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectedRows.length > 1) {
        this.$message.error('只能选择一个案件进行添加')
        return
      }
      this.$refs.remark.show(this.selectedRows[0].lawCaseBean.id)
    },
    // 转下一流程
    next() {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.$refs.nextShow.show(this.selectedRows)
    },
    toRtc(e) {
      if (e.sfType == 1) { // 法院进入调解室
        intoRoom({ lawCaseId: e.lawCaseBean.id }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.lawCaseBean.id
            this.$store.commit('SET_LAWCASE', e.lawCaseBean.id)
            type = 1 // 法院
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      } else { // 诉非进入调解室
        intoSfRoom({ sfLawCaseId: e.sfLawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.sfLawCaseId
            this.$store.commit('SET_SFLAWCASE', e.sfLawCaseId)
            type = 2 // 诉非
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      }
    },
    getResult(e) {
      getResultOfCase({ sfLawCaseId: e.sfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.isResult = true
          this.result = data
        } else {
          console.log(123)
        }
      })
    },
    getlist() {
      this.isTable = false
      const params = {
        ...this.searchParams,
        ...this.searchSchemaParams
      }
      params.sendStatus = this.sendStatus
      params.ourMediation = this.ourMediation
      this.loading1 = true
      if (params.prefixPreCaseNo1 || params.prefixPreCaseNo2) {
        delete params.prefixPreCaseNo1
        delete params.prefixPreCaseNo2
        const labe1 = this.prefixPreCaseNo1 || ''
        const labe2 = this.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + labe1 + ')' + labe2
      }
      onMediation(params).then(res => {
        this.isTable = true
        this.loading1 = false
        if (res.code === 200) {
          this.total = parseInt(res.data.totalsCount)
          this.tabledata = res.data.searchResult.map((item, index) => {
            item.mediateTime = item.mediateTime ? this.$moment(item.mediateTime).format('YYYY-MM-DD') : ''
            item.duration = item.duration ? this.$moment(item.duration).format('YYYY-MM-DD') : ''
            item.lawCaseBean.preFilingDate = item.lawCaseBean.preFilingDate ? this.$moment(item.lawCaseBean.preFilingDate).format('YYYY-MM-DD') : ''
            item.lawCaseBean.filingDate = item.lawCaseBean.filingDate ? this.$moment(item.lawCaseBean.filingDate).format('YYYY-MM-DD') : ''
            item.orgUnit = item.organizationName + '|' + item.unitName
            item.index = index + 1
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
.row {
  margin-bottom: 5px;
}
.label {
  text-align: right;
  margin-right: 10px;
}
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
/deep/.UnitAndOriAndMediator{
  min-width:200px;
 span{
   display: inline-flex;
 }

}
/deep/.mediator{
  min-width:200px;
}
</style>
