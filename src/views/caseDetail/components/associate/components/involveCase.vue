<template>
  <!-- 涉诉案件 -->
  <Table
    :columns="columns"
    :data-source="list"
    :row-key="(record,index)=>{return record.id}"
  >
    <div slot="other" slot-scope="record">
      <div v-for="item in record.caseList" :key="item.lawId" class="item">
        {{ item.caseNo || item.preCaseNo }} | 诉讼地位:{{ item.litigationStatusName }} | 送达结果:{{ item.result }} | 诉前程序结果
      </div>
    </div>
  </Table>
</template>

<script>
import { Table } from 'ant-design-vue'
import { relateLawsuit } from '@/api/case/associate.js'
import { mapGetters } from 'vuex'
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', align: 'center', width: 100 },
  { title: '一审诉讼地位', dataIndex: 'litigationStatus', key: 'litigationStatus', align: 'center', width: 150 },
  { title: '姓名或者单位名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
  { title: '涉诉案件', scopedSlots: { customRender: 'other' }, align: 'center' }
]
export default {
  components: {
    Table
  },
  props: {

  },
  data() {
    return {
      columns,
      list: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      relateLawsuit({ caseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data && data.length > 0 ? data.map((item, index) => {
            item.index = index + 1
            return item
          }) : []
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
