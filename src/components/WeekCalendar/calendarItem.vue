<template>
  <div class="content" @click="detail()">
    <div v-for="item in list1" :key="item.schedulingId" class="item">{{ item.number || item.preNumber }}号({{ item.names }})</div>
    <div v-if="dataList && dataList.length > 3" class="center">...等{{ dataList.length }}个</div>
    <Modal
      v-model="visible"
      title="详情"
      width="1400px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <div>
        <Table
          :columns="columns"
          :data-source="dataList"
          :row-key="(record,index)=>{return index}"
          :pagination="false"
        >
          <div slot="preCaseNo" slot-scope="text, record">
            <a @click="toDetail(record)">{{ text }}</a>
          </div>
        </Table>
      </div>
      <template slot="footer">
        <Button @click="visible=false">
          取消
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Modal, Table, Button } from 'ant-design-vue'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    customRender: (text, row, index) => {
      return index + 1
    }
  },
  { title: '案号', dataIndex: 'caseNo', key: 'caseNo', align: 'center', scopedSlots: { customRender: 'preCaseNo' }},
  { title: '当事人|案由', dataIndex: 'reason', key: 'reason', align: 'center', width: 200 },
  { title: '法官助理', dataIndex: 'assistantName', key: 'assistantName', align: 'center' },
  { title: '速录员', dataIndex: 'recoderName', key: 'recoderName', align: 'center' },
  {
    title: '调解单位/组织',
    dataIndex: 'orgName',
    key: 'orgName',
    align: 'center',
    customRender: (text, row, index) => {
      return row.orgName || row.unitName
    }
  },
  { title: '调解员', dataIndex: 'mediatorName', key: 'mediatorName', align: 'center' },
  { title: '预约诉前程序时间', dataIndex: 'startTime', key: 'startTime', align: 'center' },
  { title: '调解地点', dataIndex: 'tribunalName', key: 'tribunalName', align: 'center' }
]
const columns1 = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    customRender: (text, row, index) => {
      return index + 1
    }
  },
  { title: '案号', dataIndex: 'caseNo', key: 'caseNo', align: 'center', scopedSlots: { customRender: 'preCaseNo' }},
  { title: '当事人|案由', dataIndex: 'reason', key: 'reason', align: 'center', width: 200 },
  { title: '承办部门', dataIndex: 'departmentName', key: 'departmentName', align: 'center' },
  { title: '开庭地点', dataIndex: 'tribunalName', key: 'tribunalName', align: 'center' },
  {
    title: '承办法官',
    dataIndex: 'judgeName',
    key: 'judgeName',
    align: 'center',
    customRender: (text, row, index) => {
      return row.orgName || row.unitName
    }
  },
  { title: '书记员', dataIndex: 'clerkName', key: 'clerkName', align: 'center' },
  { title: '排庭时间', dataIndex: 'startTime1', key: 'startTime1', align: 'center' },
  {
    title: '排庭状态',
    dataIndex: '',
    key: '',
    align: 'center',
    customRender: (text, row, index) => {
      return row.confirmStartTime ? '排庭' : '预排庭'
    }
  },
  { title: '确认排庭时间', dataIndex: 'confirmStartTime', key: 'confirmStartTime', align: 'center' }
]

export default {
  components: {
    Modal,
    Table,
    Button
  },
  props: {
    time: { // 事件
      type: String,
      default: ''
    },
    list: { // 数据
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1 // 1排期 2排庭
    }
  },
  data() {
    return {
      dataList: [],
      list1: [],
      visible: false,
      columns
    }
  },
  watch: {
    list() {
      this.list()
    }
  },
  created() {
    this.init()
    if (this.type === 1) {
      this.columns = columns
    } else {
      this.columns = columns1
    }
  },
  mounted() {

  },
  methods: {
    init() {
      this.dataList = []
      if (!this.list || this.list.length === 0) {
        return
      }
      const startTime = new Date(this.time).getTime()
      const endTime = new Date(this.time).getTime() + 30 * 60 * 1000
      this.list.forEach(item => {
        const time = new Date(item.startTime).getTime()
        if (time >= startTime && time < endTime) {
          this.dataList.push(item)
        }
      })
      if (this.dataList.length > 2) {
        this.list1 = [...this.dataList].splice(0, 3)
      } else {
        this.list1 = [...this.dataList]
      }
    },
    detail() {
      this.visible = true
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
    }
  }
}
</script>

<style scoped lang="less">
.content {
  padding: 10px;
  cursor: pointer;
}
.item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: @theme-color;
  border-radius: 4px;
  margin-bottom: 5px;
  color: #fff;
}
.center {
  text-align: center;
}
</style>
