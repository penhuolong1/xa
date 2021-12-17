<template>
  <Modal
    v-model="visible"
    title="案件列表"
    class="modal"
    :mask-closable="true"
    width="70%"
    :footer="false"
    @cancel="visible = false"
  >
    <Table
      :columns="columns"
      :data-source="list"
      :scroll="{ x: 1500, y: 500 }"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        showSizeChanger: true,
        showQuickJumper: true,

      }"
      @change="changePage"
    />

  </Modal>
</template>
<script>
import { Table, Modal } from 'ant-design-vue'
import { getPreCaseDetails, getCaseListInMediator, getAuthenticateCaseList, getSaveCaseDetails, getCourtCaseDetails, getBriefCase, getMediaterBrieCase } from '@/api/statistics/index'
export default {
  components: {
    Table,
    Modal
  },
  props: {
    report: {
      type: Number,
      default: 1 // 1:诉前案件统计;2:调解员调解情况统计;3:鉴定案件统计;4:诉前保全案件统计;5:送达质效;6:开庭统计;7:收案案由;8:化解案由
    }
  },
  data() {
    return {
      visible: false,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      searchParams: {},

      list: [],
      columns: [
      ]
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 改变页码 触发方法
    changePage(event) {
      this.pageNumber = event.current
      this.pageSize = event.pageSize
      this.getList()
    },
    show(event) {
      this.searchParams = { ...event }

      this.visible = true
      this.getList(event)
    },
    // 数据
    getList() {
      if (this.report == 1) { // 1.诉前案件统计
        const columns = [
          { title: '预案号', width: 100, dataIndex: 'preCaseNo', key: 'preCaseNo',
            customRender: (text, record) => {
              return (<a onclick={() => { this.toDetail(record) }}>{{ text }}</a>)
            }
          },
          { title: '当事人|案由', width: 150, dataIndex: 'reason', key: 'reason' },
          { title: '预立案日期', dataIndex: 'preFilingDate', key: 'preFilingDate', width: 150 },
          { title: '诉前结案时间', dataIndex: 'preCloseDate', key: 'preCloseDate', width: 150 },
          { title: '法官助理', dataIndex: 'jName', key: 'jName', width: 150 },
          { title: '速录员', dataIndex: 'jjName', key: 'jjName', width: 150 },
          { title: '办理天数', dataIndex: 'overDate', key: 'overDate', width: 150 },
          { title: '起诉标的金额', dataIndex: 'subjectAmount', key: 'subjectAmount', width: 150 }

        ]
        this.columns = columns
      } else if (this.report == 2 || this.report == 3 || this.report == 4) { // 2.调解员调解情况/3.鉴定案件统计/4.诉前保全案件统计
        const columns = [
          { title: '预案号', width: 100, dataIndex: 'preCaseNo', key: 'preCaseNo',
            customRender: (text, record) => {
              return (<a onclick={() => { this.toDetail(record) }}>{{ text }}</a>)
            }
          },
          { title: '当事人|案由', width: 150, dataIndex: 'reason', key: 'reason' },
          { title: '预立案时间', dataIndex: 'preFilingDate', key: 'preFilingDate', width: 150 },
          { title: '诉前结案时间', dataIndex: 'preCloseDate', key: 'preCloseDate', width: 150 },
          { title: '法官助理', dataIndex: 'assistantJudge', key: 'assistantJudge', width: 150 },
          { title: '速录员', dataIndex: 'recorder', key: 'recorder', width: 150 },
          { title: '办理天数', dataIndex: 'overDate', key: 'overDate', width: 150 }
        ]
        this.columns = columns
      } else if (this.report == 6) { // 开庭统计
        const columns = [
          { title: '案号', width: 100, dataIndex: 'caseNo', key: 'caseNo',
            customRender: (text, record) => {
              return (<a onclick={() => { this.toDetail(record) }}>{{ text }}</a>)
            }
          },
          { title: '当事人|案由', width: 150, dataIndex: 'reason', key: 'reason' },
          { title: '承办部门', dataIndex: 'takingDepartment', key: 'takingDepartment', width: 150 },
          { title: '法庭名称', dataIndex: 'court', key: 'court', width: 150 },
          { title: '承办人', dataIndex: 'judge', key: 'judge', width: 150 },
          { title: '法官助理', dataIndex: 'assistantJudge', key: 'assistantJudge', width: 150 },
          { title: '书记员', dataIndex: 'clerk', key: 'clerk', width: 150 },
          { title: '审判长', dataIndex: 'spz', key: 'spz', width: 150 },
          { title: '排庭时间', dataIndex: 'startTime', key: 'startTime', width: 150 },
          { title: '确认开庭时间', dataIndex: 'confirmStartTime', key: 'confirmStartTime', width: 150 }
        ]
        this.columns = columns
      } else if (this.report == 7 || this.report == 8) { // 开庭统计
        const columns = [
          { title: '案号', dataIndex: 'preCaseNo', key: 'preCaseNo', width: 150,
            customRender: (text, record) => {
              return (<a onclick={() => { this.toDetail(record) }}>{{ text }}</a>)
            }
          },
          { title: '案由', width: 100, dataIndex: 'reason', key: 'reason' },
          { title: '预立案日期', dataIndex: 'preFilingDate', key: 'preFilingDate', width: 150 },
          { title: '诉前结案时间', width: 150, dataIndex: 'preCloseDate', key: 'preCloseDate' },
          { title: '办理天数', dataIndex: 'subjectAmount', key: 'subjectAmount', width: 150 }
        ]
        this.columns = columns
      }
      const params = {
        // report ==1 || report == 3 || report == 4
        assistantJudgeId: this.searchParams.assistantJudgeId,
        // report ==2
        mediatorUnitId: this.searchParams.mediatorUnitId,
        mediatorOrgId: this.searchParams.mediatorOrgId,
        mediatorId: this.searchParams.mediatorId,

        // report == 6
        courtId: this.searchParams.courtId,
        judgeId: this.searchParams.judgeId,

        // report == 7
        briefId: this.searchParams.briefId,
        unitId: this.searchParams.unitId,

        startDate: this.searchParams.startDate,
        endDate: this.searchParams.endDate,
        caseNumType: this.searchParams.caseNumType,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize

      }
      if (this.report == 1) {
        getPreCaseDetails(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 2) {
        getCaseListInMediator(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 3) {
        getAuthenticateCaseList(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 4) {
        getSaveCaseDetails(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 6) {
        getCourtCaseDetails(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.confirmStartTime = item.confirmStartTime ? this.$moment(item.confirmStartTime).format('YYYY-MM-DD HH:mm:ss') : ''
              item.startTime = item.startTime ? this.$moment(item.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 7) { // 收案案由
        getBriefCase(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      } else if (this.report == 8) { // 化解案由
        getMediaterBrieCase(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.list || data.list === 0) {
              this.list = []
              return
            }
            this.list = data.list.map(item => {
              item.preFilingDate = item.preFilingDate ? this.$moment(item.preFilingDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item.preCloseDate = item.preCloseDate ? this.$moment(item.preCloseDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item
            })
            this.total = Number(data.total)
          }
        })
      }
    },
    // 案件详情
    toDetail(e) {
      console.log('e', e)
      const caseNo = e.preCaseNo || e.pre_case_no
      const path = `/case/detail?lawCase=${e.lawcaseId || e.lawCaseId}`
      const obj = {
        path,
        caseNo: caseNo,
        caseId: e.lawCaseId || e.lawcaseId
      }
      this.$store.dispatch('ToDetail', obj)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
