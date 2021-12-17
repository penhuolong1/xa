<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :default-value="searchParams" :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" @change="change" />
    <div class="list-btn-content enter-X mb-5">
      <!-- <Button class="list-btn-item" type="green" @click="addcase">新增案件</Button> -->
    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return record.id}"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条1`
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
        <div v-if="record.type === 2 && record.handle > 0"><a @click="toConsult(record)">咨询室</a></div>
        <div v-if="record.type === 1 && record.handle === 1"><a @click="toRtc(record)">调解室</a></div>
      </div>
    </Table>
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { sfCaseState } from '@/type/index.js'
import { Button, Table } from 'ant-design-vue'
import { intoSfRoom, intoTeamRoom, intoRoom } from '@/api/rtc/index.js'
import { listCaseOfTeam } from '@/api/sfAddcase/index.js'
const defaultValue = {
  teamType: 1,
  initiate: 1,
  doType: 0
}
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
          width: 150,
          scopedSlots: { customRender: 'caseNo' }
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
          title: '预约调解时间',
          dataIndex: '',
          rowkey: '',
          width: 150
        },
        {
          title: '联动者',
          dataIndex: 'teamName',
          rowkey: 'teamName',
          width: 150
        },
        {
          title: '联动事由',
          dataIndex: 'teamReason',
          rowkey: 'teamReason',
          width: 200
        },
        {
          title: '发起时间',
          dataIndex: 'teamCreateTime',
          rowkey: 'teamCreateTime',
          width: 150
        },
        {
          title: '办结时间',
          dataIndex: 'endTime',
          rowkey: 'endTime',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      isSkeleton: false, // 是否显示骨架屏
      searchParams: { // 列表搜索条件
        pageNum: 1,
        pageSize: 10,
        ...defaultValue
      },
      initiate: 1,
      defaultValue,
      searchSchema: [
        {
          label: '类型',
          type: 'radio',
          field: 'teamType',
          options: [
            {
              value: 1,
              label: '协助调解'
            },
            {
              value: 2,
              label: '咨询'
            }
          ]
        },
        {
          label: '我承担',
          type: 'radio',
          field: 'initiate',
          options: [
            {
              value: 1,
              label: '发起'
            },
            {
              value: 2,
              label: '联动'
            }
          ]
        },
        {
          label: '联动状态',
          type: 'radio',
          field: 'doType',
          options: [
            {
              value: 0,
              label: '全部'
            },
            {
              value: 1,
              label: '正在办理'
            },
            {
              value: 2,
              label: '退回'
            },
            {
              value: 3,
              label: '完成'
            }
          ]
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber',
          trialFieldType: [{
            value: '诉非',
            label: '诉非'
          }]
        },
        {
          label: '联动者名称',
          type: 'input',
          field: 'teamName',
          vIf: () => {
            return this.initiate === 1
          }
        },
        {
          label: '发起者名称',
          type: 'input',
          field: 'initiatorName',
          vIf: () => {
            return this.initiate === 2
          }
        },
        {
          label: '发起时间',
          type: 'time',
          field: ['startTime', 'endTime'],
          trialFieldType: [
            {
              value: '诉非',
              label: '诉非'
            }
          ],
          showTime: true
        }
      ],
      selectKey: [], // 选中的列
      remarkInfo: {}, // 备注需要的信息
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
  },
  activated() {
    this.getList()
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
      if (lab1 && lab2) {
        params.prefixCaseNo = `(${lab1})${lab2}`
      }
      delete params.prefixPreCaseNo1
      delete params.prefixPreCaseNo2
      this.searchParams = {
        ...params,
        // pageNum: this.searchParams.pageNum,
        pageNum: 1,
        pageSize: this.searchParams.pageSize
      }
      this.getList()
    },
    getList(e) {
      this.loading = true
      listCaseOfTeam(this.searchParams).then(({ code, data }) => {
        this.loading = false
        this.selectKey = []
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.registerDate = item.registerDate ? this.format(new Date(item.registerDate), 'YYYY-MM-DD') : ''
            item.teamCreateTime = item.teamCreateTime ? this.format(new Date(item.teamCreateTime), 'YYYY-MM-DD H:m:s') : ''
            item.endTime = item.endTime ? this.format(new Date(item.endTime), 'YYYY-MM-DD H:m:s') : ''
            return item
          })
          this.total = data.total
        }
      })
    },
    toAddCase(e) {
      // const caseNo = e.caseNo || e.serialNumber
      // const path = `/sfcase/detail?caseId=${e.sfLawCaseId || e.lawId}`
      // const obj = {
      //   path,
      //   caseNo: caseNo,
      //   caseId: e.sfLawCaseId || e.lawId,
      //   type: 2
      // }
      // this.$store.dispatch('ToSfDetail', obj)
      if (e.sfType == 1) { // 法院的案件
        this.$store.commit('SET_SFLAWCASE', e.lawId)
        const caseNo = e.caseNo || e.preCaseNo
        const path = '/case/detail?lawCase=' + e.lawId
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.lawId
        }
        this.$store.dispatch('ToDetail', obj)
      } else {
        const caseNo = e.caseNo
        const path = `/sfcase/detail?caseId=${e.sfLawCaseId}`
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.sfLawCaseId,
          type: 2 // type为2是诉非的案件
        }
        this.$store.dispatch('ToSfDetail', obj)
      }
    },
    // 选择搜索条件触发
    change(e, type, val) {
      if (type === 'initiate') {
        this.initiate = e
      }
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
.ant-btn{
  margin:10px;
}

</style>
