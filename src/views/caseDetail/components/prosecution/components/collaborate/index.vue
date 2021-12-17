<template>
  <div class="wrapper" style="padding-top: 20px;">
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :data-source="list"
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
      <template slot="operation" slot-scope="record">
        <div>
          <div><a @click="detail(record)">查看详情</a></div>
          <a v-if="record.type == 1" @click="toRtc(record)">调解室</a>
          <a v-if="record.type == 2" @click="toConsult(record)">咨询室</a>
          <tr />
        </div>
      </template>
    </Table>
    <!-- 详情 -->
    <Detail ref="detail" />
  </div>
</template>

<script>
import { Table } from 'ant-design-vue'
import Tag from '@/components/Tag/index.vue'
import { mapGetters } from 'vuex'
import Detail from '@/components/Linkage/detail.vue'

import { listTeamOfCase } from '@/api/collectCase/index.js'
import { intoTeamRoom, intoRoom } from '@/api/rtc/index.js'

export default {
  components: {
    Table,
    Tag,
    Detail
  },
  props: {
    param: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          rowkey: 'index',
          width: 80,
          customRender: (text, row, index) => {
            return index + 1
          }
        },
        {
          title: '类型',
          dataIndex: 'type',
          rowkey: 'type',
          width: 100,
          customRender: (text) => {
            return text === 1 ? '联动调解' : '咨询'
          }
        },
        {
          title: '发起时间',
          dataIndex: 'createTime',
          rowkey: 'createTime',
          width: 150
        },
        {
          title: '发起者',
          dataIndex: 'initiatorName',
          key: 'initiatorName',
          width: 150,
          customRender: (text, row) => {
            return `${text}(${row.initiatorDept})`
          }
        },
        {
          title: '联动者',
          dataIndex: 'teamName',
          key: 'teamName',
          width: 150
        },
        {
          title: '联动详情',
          dataIndex: 'detail',
          key: 'detail',
          width: 250,
          customRender: (text, row) => {
            if (row.type === 1) {
              return (<div>
                <div>预约调解时间:{row.startTime}</div>
                <div>调解地点:{row.tribunalName}</div>
              </div>)
            } else {
              return (<div>
                <div>联动事项:{row.teamReason}</div>
                <div>最迟完成时间:{row.lastDays}</div>
              </div>)
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          width: 150,
          customRender: (text, row) => {
            const tag = row.orReply == 1 ? (<Tag text='已回复'></Tag>) : ''
            const tag1 = row.partMediate ? (<Tag text='已参与'></Tag>) : ''
            return (<div>{row.finish == 1 ? '已办结' : '进行中'}{tag}{tag1}</div>)
          }
        },
        {
          title: '操作',
          key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center',
          width: 150
        }
      ],
      list: [],
      loading: false,
      total: 0,
      searchParams: { // 列表搜索条件
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId']),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
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
    // 查看详情
    detail(e) {
      this.$refs.detail.show(e.id)
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNumber = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNumber = e.current
      }
      this.getList(this.searchParams)
    },
    getList() {
      this.isTable = true
      listTeamOfCase({ lawCaseId: this.$route.query.lawCase }).then(({ code, data }) => {
        if (!data || data.length === 0) {
          return
        }
        this.list = data
      })
    },
    toRtc(e) {
      intoRoom({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
          this.$store.commit('SET_RTCTOKEN', data.result)
          let chatRoomId = ''
          let type = null
          chatRoomId = this.getLawCaseId
          this.$store.commit('SET_LAWCASE', this.getLawCaseId)
          type = 1 // 法院
          this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
        }
      })
    },
    // 进入咨询室
    toConsult(e) {
      intoTeamRoom({ sfTeamId: e.id }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
          this.$store.commit('SET_RTCTOKEN', data.result)
          let chatRoomId = ''
          let type = null
          chatRoomId = e.teamId
          this.$store.commit('SET_LAWCASE', this.getLawCaseId)
          type = 1 // 法院
          this.$router.push(`/rtc/consultRoom?chatRoomId=` + chatRoomId + '&type=' + type)
        }
      })
    }
  }
}
</script>

<style scoped lang="less" src="../index.less"></style>
