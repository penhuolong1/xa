<template>
  <!-- 涉诉案件 -->
  <div>
    <Table
      :columns="columns"
      :data-source="list"
      bordered
      :row-key="(record,index)=>{return index}"
    >
      <div slot="name" slot-scope="record">
        <div>{{ record.name }}<Button class="btn" type="link" @click="add(record)">添加</Button></div>
      </div>
      <div slot="operate" slot-scope="record">
        <Button v-if="record.id" class="btn" type="link" @click="remove(record)">移除</Button>
      </div>
    </Table>
    <AddAssociate ref="addAssociate" @done="getData" />
  </div>
</template>

<script>
import { Table, Button } from 'ant-design-vue'
import { relateList, removeInfo } from '@/api/case/associate.js'
import AddAssociate from './addAssociate.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Table,
    Button,
    AddAssociate
  },
  props: {

  },
  data() {
    return {
      columns: [],
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
      relateList({ caseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = []
          if (!data || data.length === 0) {
            return
          }
          data.forEach((item, index) => {
            if (item.sendRelationList && item.sendRelationList.length > 0) {
              item.sendRelationList.forEach((item1, index) => {
                const obj = {
                  litigationStatus: item.litigationStatus,
                  name: item.name,
                  content: item1.phone || item1.address,
                  litigantName: item1.litigantName,
                  preCaseNo: item1.preCaseNo,
                  remark: item1.remark,
                  id: item1.id,
                  litId: item.id,
                  type: item1.type === 1 ? '电话' : '地址'
                }
                if (index === 0) {
                  obj.rowSpan = item.sendRelationList.length
                } else {
                  obj.rowSpan = 0
                }
                this.list.push(obj)
              })
            } else {
              const obj = {
                litigationStatus: item.litigationStatus,
                name: item.name,
                content: '',
                litigantName: '',
                preCaseNo: '',
                litId: item.id,
                id: '',
                type: '',
                rowSpan: 1
              }
              this.list.push(obj)
            }
          })
          this.getColumns()
        }
      })
    },
    // 添加
    add(e) {
      this.$refs.addAssociate.show(e)
    },
    getColumns() {
      this.columns = [
        { title: '一审诉讼地位', dataIndex: 'litigationStatus', key: 'litigationStatus', align: 'center', width: 150,
          customRender: (text, row, index) => {
            const obj = {
              children: text,
              attrs: {}
            }
            obj.attrs.rowSpan = row.rowSpan
            return obj
          }
        },
        { title: '姓名或者单位名称', scopedSlots: { customRender: 'name' }, align: 'center', width: 200,
          customRender: (text, row, index) => {
            const obj = {
              children: (<div>{row.name}<Button class='btn' type='link' onclick={this.add.bind(this, row)}>添加</Button></div>),
              attrs: {}
            }
            obj.attrs.rowSpan = row.rowSpan
            return obj
          }
        },
        { title: '案号', dataIndex: 'preCaseNo', key: 'preCaseNo', align: 'center' },
        { title: '当事人', dataIndex: 'litigantName', key: 'litigantName', align: 'center' },
        { title: '类型', dataIndex: 'type', key: 'type', align: 'center' },
        { title: '内容', dataIndex: 'content', key: 'content', align: 'center' },
        { title: '备注', dataIndex: 'remark', key: 'remark', align: 'center' },
        { title: '操作', scopedSlots: { customRender: 'operate' }, align: 'center' }]
    },
    // 移除
    remove(e) {
      this.$confirm({
        title: '是否确认移除',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sendRelateId: e.id
          }
          removeInfo(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getData()
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less">
.btn {
  display: inline-block;
}
</style>
