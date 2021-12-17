<template>
  <!-- 协助调解&&发起 -->
  <div>
    <Table
      v-if="isTable"
      :scroll="{x:1400}"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tabledata"
      :row-key="(record,index)=>{return record.teamId}"
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
      <div slot="operation" slot-scope="text, record">
        <div v-if="initiate === 1 && record.type === 2"><a @click="toConsult(record)">咨询室</a></div>
        <!-- 如果是联动的案件 需要接收了才能进入咨询室 -->
        <div v-if="initiate === 2 && record.type === 2 && (record.handle === 1 || record.handle === 4)"><a @click="toConsult(record)">咨询室</a></div>
        <div v-if="initiate === 1 && record.type === 1"><a @click="toRtc(record)">调解室</a></div>
        <!-- 如果是联动的案件 需要接收才能进调解室 -->
        <div v-if="initiate === 2 && record.type === 1 && record.handle === 1"><a @click="toRtc(record)">调解室</a></div>
      </div>
    </Table>
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import { listTeam } from '@/api/addCase/index.js'
import { intoSfRoom, intoTeamRoom, intoRoom } from '@/api/rtc/index.js'
import moment from 'moment'

export default {
  components: {
    Table
  },
  props: {
    searchSchemaParams: {
      type: Object,
      default: () => {}
    },
    initiate: {
      type: Number,
      default: 1 // 发起 2联动
    }
  },
  data() {
    return {
      isTable: true,
      tabledata: [],
      selectedRows: [],
      selectedRowKeys: [],
      total: 0,
      prefixPreCaseNo1: '',
      prefixPreCaseNo2: '',
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10
      }

    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectedRows = selectedRows
          this.$emit('getRows', this.selectedRows)
        }
      }
    },
    columns() {
      return [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: this.searchSchemaParams.initiate === 1 ? '预案号' : '诉非号',
          dataIndex: 'preCaseNo',
          key: 'preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' }

        },
        {
          title: '预立案时间',
          dataIndex: 'preFilingDate',
          key: 'preFilingDate'
        },
        {
          title: '当事人 | 案由',
          dataIndex: 'reason',
          key: 'reasonn'
        },
        {
          title: this.searchSchemaParams.initiate === 1 ? '法官助理' : '调解单位/组织名称',
          dataIndex: 'assistantName',
          key: 'assistantName'
        },
        {
          title: '调解员',
          dataIndex: 'mediatorName',
          key: 'mediatorName'
        },
        {
          title: '预约调解时间',
          dataIndex: 'schedulingDate',
          key: 'schedulingDate'
        },
        {
          title: '调解地点',
          dataIndex: 'tribunalName',
          key: 'tribunalName'
        },
        {
          title: this.searchSchemaParams.initiate === 1 ? '联动者' : '发起者',
          dataIndex: 'teamNames',
          key: 'teamNames'
        },
        {
          title: '联动事由',
          dataIndex: 'teamReason',
          key: 'teamReason'
        },
        {
          title: '发起时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '办结时间',
          dataIndex: 'endTime',
          key: 'endTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
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
    toDetail(e) {
      if (!e.sfLawId) { // 法院的案件
        this.$store.commit('SET_SFLAWCASE', e.lawId)
        const caseNo = e.preCaseNo
        const path = '/case/detail?lawCase=' + e.lawId
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.lawId
        }
        this.$store.dispatch('ToDetail', obj)
      } else {
        const caseNo = e.preCaseNo
        const path = `/sfcase/detail?caseId=${e.sfLawId}`
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.sfLawId,
          type: 2 // type为2是诉非的案件
        }
        this.$store.dispatch('ToSfDetail', obj)
      }
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList(this.searchParams)
    },
    getList(e) {
      const params = {
        ...this.searchParams,
        ...e
      }
      if (params.prefixPreCaseNo1 && params.prefixPreCaseNo2) {
        this.prefixPreCaseNo1 = this.searchSchemaParams.prefixPreCaseNo1 || ''
        this.prefixPreCaseNo2 = this.searchSchemaParams.prefixPreCaseNo2 || ''
        params.caseNoPrefix = '(' + this.prefixPreCaseNo1 + ')' + this.prefixPreCaseNo2
        delete params.prefixPreCaseNo1
        delete params.prefixPreCaseNo2
      }
      listTeam(params).then(res => {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$emit('getRows', [])
        if (res.code === 200) {
          this.tabledata = res.data.rows.map((item, index) => {
            if (item.finishTime) {
              item.finishTime = moment(item.finishTime).format('YYYY-MM-DD')
            }
            item.preFilingDate = item.preFilingDate ? moment(item.finishTime).format('YYYY-MM-DD') : ''
            if (item.createTime) {
              item.createTime = moment(item.createTime).format('YYYY-MM-DD')
            }
            item.index = index + 1
            item.preCaseNo = this.searchSchemaParams.initiate === 1 ? item.preCaseNo : item.sfLawCaseNo
            item.assistantName = this.searchSchemaParams.initiate === 1 ? item.assistantName : item.unitAndOrg
            item.teamNames = this.searchSchemaParams.initiate === 1 ? item.teamNames : item.initiatorName
            return item
          })
        }
      })
    },
    // 进入调解室
    toRtc(e) {
      if (e.sfType == 1) { // 法院进入调解室
        intoRoom({ lawCaseId: e.lawId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.lawId
            this.$store.commit('SET_LAWCASE', e.lawId)
            type = 1 // 法院
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      } else { // 诉非进入调解室
        intoSfRoom({ sfLawCaseId: e.sfLawCaseId || e.sfLawId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.sfLawCaseId || e.sfLawId
            this.$store.commit('SET_SFLAWCASE', e.sfLawCaseId || e.sfLawId)
            type = 2 // 诉非
            this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      }
    },
    // 进入咨询室
    toConsult(e) {
      if (e.sfType == 1) { // 法院进入咨询室
        intoTeamRoom({ sfTeamId: e.teamId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.teamId
            this.$store.commit('SET_LAWCASE', e.lawId)
            type = 1 // 法院
            this.$router.push(`/rtc/consultRoom?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      } else { // 诉非进入咨询室
        intoTeamRoom({ sfTeamId: e.teamId }).then(({ code, data }) => {
          if (code === 200) {
            this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
            this.$store.commit('SET_RTCTOKEN', data.result)
            let chatRoomId = ''
            let type = null
            chatRoomId = e.teamId
            this.$store.commit('SET_SFLAWCASE', e.sfLawCaseId)
            type = 2 // 诉非
            this.$router.push(`/rtc/consultRoom?chatRoomId=` + chatRoomId + '&type=' + type)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
