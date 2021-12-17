<template>
  <!--案件鉴定 -->
  <div>
    <SearchForm :is-skeleton="isSkeleton" :schema="searchSchema" class="enter-X" @search="search" />
    <div class="list-btn-content enter-X">
      <Button class="list-btn-item" type="danger" @click="back">退回</Button>
      <Button class="list-btn-item" type="blue4" @click="point">指派</Button>
      <Button class="list-btn-item" type="blue3" @click="update">修改</Button>
      <Button class="list-btn-item" type="blue2" @click="close">办结</Button>
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.teamId}"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys, onChange: onSelectChange
      }"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="preCaseNo" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </div>
      <div slot="operation" slot-scope="record">
        <a class="mr-5" @click="detail(record)">查看详情</a>
      </div>
    </Table>
    <!-- 退回 -->
    <Back ref="back" @done="getList" />
    <!-- 指派 -->
    <Point ref="point" @done="getList" />
    <!-- 修改 -->
    <Update ref="update" @done="getList" />
    <!-- 结案 -->
    <Close ref="close" @done="getList" />
    <!-- 详情 -->
    <Detail ref="detail" />
  </div>

</template>
<script>
import SearchForm from '@/components/SearchForm'
import { Button, Table } from 'ant-design-vue'
import { formatDate } from '@/utils/format.js'
import { listTeamOfPoint } from '@/api/addCase'
import { cancelTeam } from '@/api/sfAddcase'
import Back from '@/components/Linkage/back.vue'
import Point from '@/components/Linkage/point.vue'
import Update from '@/components/Linkage/update.vue'
import Close from '@/components/Linkage/close.vue'
import Detail from '@/components/Linkage/detail.vue'
import ApplyLinkage from '@/components/Linkage/applyLinkage.vue'
import { trialFieldType2 } from '@/type/index.js'
export default {
  components: {
    SearchForm,
    Button,
    Back,
    Point,
    Update,
    Close,
    Detail,
    ApplyLinkage,
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
          title: '类型',
          dataIndex: 'type',
          rowkey: 'type',
          width: 100,
          customRender: (text) => {
            return text === 1 ? '联动调解' : '咨询'
          }
        },
        {
          title: '我承担',
          dataIndex: 'orInitiator',
          rowkey: 'orInitiator',
          width: 100,
          customRender: (text) => {
            return text == '1' ? '发起' : '联动'
          }
        },
        {
          title: '预立案号',
          dataIndex: 'caseNo',
          rowkey: 'caseNo',
          scopedSlots: { customRender: 'preCaseNo' },
          width: 150
        },
        {
          title: '当事人|案由',
          dataIndex: 'reason',
          rowkey: 'reason',
          width: 300
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
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 150
        },
        {
          title: '操作',
          key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center',
          width: 150
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
          label: '联动状态',
          type: 'select',
          field: 'doType',
          options: [
            {
              value: '0',
              label: '全部'
            },
            {
              value: '1',
              label: '未指派'
            },
            {
              value: '2',
              label: '退回'
            }
          ]
        },
        {
          label: '我承担',
          type: 'select',
          field: 'initiate',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '1',
              label: '发起'
            },
            {
              value: '2',
              label: '联动'
            }
          ]
        },
        {
          label: '发起者名称',
          type: 'input',
          field: 'initiatorName'
        },
        {
          label: '联动者名称',
          type: 'input',
          field: 'teamName'
        },
        {
          label: '发起时间',
          type: 'time',
          field: ['startTime', 'endTime']
        },
        {
          label: '案号',
          type: 'caseNo',
          field1: 'prefixPreCaseNo1',
          field2: 'prefixPreCaseNo2',
          field3: 'startNumber',
          field4: 'endNumber',
          trialFieldType: [
            ...trialFieldType2,
            {
              value: '诉非',
              label: '诉非'
            }
          ]
        }
      ],
      selectKey: [], // 选中的列
      selectedRowKeys: []
    }
  },
  computed: {
  },
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectKey = selectedRows
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
      const params = { ...e }
      this.searchParams = {
        ...params,
        pageNum: this.searchParams.pageNum,
        pageSize: this.searchParams.pageSize
      }
      this.searchParams.pageNumber = 1
      this.getList()
    },
    getList(e) {
      this.loading = true
      listTeamOfPoint(this.searchParams).then(({ code, data }) => {
        this.loading = false
        this.selectedRowKeys = []
        this.selectKey = []
        if (code === 200) {
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            return item
          })
          this.total = parseInt(data.total)
        }
      })
    },
    toDetail(e) {
      if (e.sfType == 1) { // 法院的案件
        this.$store.commit('SET_SFLAWCASE', e.id)
        const caseNo = e.caseNo || e.preCaseNo
        const path = '/case/detail?lawCase=' + e.caseId + '&type=2'
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.caseId
        }
        this.$store.dispatch('ToDetail', obj)
      } else {
        const caseNo = e.caseNo
        const path = `/sfcase/detail?caseId=${e.caseId}`
        const obj = {
          path,
          caseNo: caseNo,
          caseId: e.caseId,
          type: 2 // type为2是诉非的案件
        }
        this.$store.dispatch('ToSfDetail', obj)
      }
    },
    // 退回
    back() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能操作一个案件')
        return
      }
      const params = {
        id: this.selectKey[0].teamId
      }
      if (this.selectKey[0].orInitiator == 1) { // 发起人撤回整个案件
        cancelTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.getList()
          }
        })
      } else { // 联动角色向上一级退回联动
        this.$refs.back.show(this.selectKey[0].teamId)
      }
    },
    // 指派
    point() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能操作一个案件')
        return
      }
      if (this.selectKey[0].orInitiator != 0) {
        this.$message.error('只有被联动方才能指派')
        return
      }
      this.$refs.point.show(this.selectKey[0].teamId)
    },
    // 修改
    update() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能操作一个案件')
        return
      }
      if (this.selectKey[0].orInitiator != 1) {
        this.$message.error('只有自己发起的联动才能修改')
        return
      }
      this.$refs.update.show(this.selectKey[0].teamId)
    },
    // 办结
    close() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      if (this.selectKey.length !== 1) {
        this.$message.error('一次只能操作一个案件')
        return
      }
      if (this.selectKey[0].orInitiator != 1) {
        this.$message.error('只有自己发起的联动才能办结')
        return
      }
      this.$refs.close.show(this.selectKey[0])
    },
    // 查看详情
    detail(e) {
      this.$refs.detail.show(e.teamId)
    },
    // 发起联动
    applyLinkage(e) {
      this.$refs.applyLinkage.show()
    }
  }
}
</script>

<style scoped lang="less">
.ant-btn{
  margin:10px;
}
</style>
