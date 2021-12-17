<template>
  <div>
    <Table
      :columns="columns"
      :data-source="list"
      :row-key="(record,index)=>{return index}"
      class="litigant-list-table"
      :pagination="false"
      :expanded-row-keys="expandedRowKeys"
    >
      <div slot="files" slot-scope="record">
        <a v-for="item in record.fileList" :key="item.id" style="display:block;" @click="preview(item, record.fileList)">{{ item.fileName }}</a>
      </div>
      <div slot="operation" slot-scope="record">
        <a class="operation_btn" @click="update(record)">{{ isEdit?'修改':'查看' }}</a>
        <a class="operation_btn1" @click="del(record)">删除</a>
      </div>
    </Table>
    <AddEvidence ref="addEvidence" :is-edit="isEdit" @done="getLitigant" />
    <Preview ref="preview" :file-list="[]" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import { listEvidence, delEvidence } from '@/api/addCase/index'
import AddEvidence from './addEvidence.vue'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', align: 'center',
    customRender: (text, row, index) => {
      return index + 1
    } },
  { title: '提供者', dataIndex: 'litigantName', key: 'litigantName', align: 'center' },
  { title: '证据名称', dataIndex: 'name', key: 'name', align: 'center' },
  { title: '证据材料', align: 'center', scopedSlots: { customRender: 'files' }, width: 250 },
  { title: '证明对象', dataIndex: 'eviProve', key: 'eviProve', align: 'center' },
  { title: '页数', dataIndex: 'eviPage', key: 'eviPage', align: 'center' },
  { title: '是否有原件', dataIndex: 'original', key: 'original', align: 'center',
    customRender: (text) => {
      return text ? '是' : '否'
    }
  },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center' }
]

export default {
  components: {
    Table,
    AddEvidence,
    Preview
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [], // 当事人列表
      columns,
      linkList: [], // 联系方式列表
      addressList: [], // 地址列表
      expandedRowKeys: [],
      selectedRowKeys: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getLitigant()
  },
  mounted() {

  },
  methods: {
    // 获取证据信息
    getLitigant() {
      if (!this.getLawCaseId) {
        return
      }
      this.list = []
      listEvidence({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data
          console.log(this.list)
        }
      })
    },
    // 删除
    del(e) {
      this.$confirm({
        title: '是否删除该证据',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            evidenceId: e.evidenceId
          }
          delEvidence(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getLitigant()
            }
          })
        },
        onCancel() {}
      })
    },
    // 修改当事人
    update(e) {
      this.$refs.addEvidence.show(e)
    },
    // 添加证据
    addEvidence() {
      this.$refs.addEvidence.show()
    },
    // 预览
    preview(e) {
      this.$refs.preview.show(e.fileUrl, [])
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
</style>
