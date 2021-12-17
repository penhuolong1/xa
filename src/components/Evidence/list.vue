<template>
  <Table
    :columns="columns"
    :data-source="list"
    :row-key="(record,index)=>{return index}"
    :pagination="false"
    class="my-table"
  >
    <div slot="operation" slot-scope="record">
      <a class="operation_btn" @click="look(record)">查看</a>
      <a class="operation_btn1" @click="del(record)">删除</a>
    </div>
  </Table>
</template>
<script>
import { Table } from 'ant-design-vue'
import { queryEvidence } from '@/api/collectCase/index'
import { mapGetters } from 'vuex'
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', align: 'center' },
  { title: '提供者', dataIndex: 'litigantName', key: 'litigantName', align: 'center' },
  { title: '证据名称', dataIndex: 'eviName', key: 'eviName', align: 'center' },
  { title: '证明对象', dataIndex: 'eviProve', key: 'eviProve', align: 'center' },
  { title: '证据来源', dataIndex: 'eviSource', key: 'eviSource', align: 'center' },
  { title: '页数', dataIndex: 'eviPage', key: 'eviPage', align: 'center' },
  { title: '是否有原件', dataIndex: 'original', key: 'original', align: 'center' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center' }
]

export default {
  components: {
    Table
  },
  props: {

  },
  data() {
    return {
      list: [], // 当事人列表
      columns
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getEviList()
  },
  mounted() {

  },
  methods: {
    submit() {
    },
    // 获取当事人
    getEviList() {
      if (!this.getLawCaseId) {
        return
      }
      queryEvidence({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data.row || data.row.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            item.isToggle = true
            item.countercharge = item.countercharge === 1 ? '是' : '否'
            return item
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.operation_btn {
  color: @theme-color;
  margin-right: @space-default;
}
.operation_btn1 {
  color: @err-color;
  margin-right: @space-default;
}
.my-table {
  border-top: 1px solid #e8e8e8;
}

</style>
