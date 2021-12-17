<template>
  <div>
    <Table
      :columns="columns"
      :data-source="list"
      :row-key="(record,index)=>{return index}"
      :scroll="{x: 1400}"
      class="litigant-list-table"
      :pagination="false"
      :expanded-row-keys="expandedRowKeys"
    >
      <div slot="phone" slot-scope="record">
        <div v-for="item in record.phoneList" :key="item.id">{{ item.relation }}:{{ item.phone }}</div>
      </div>
      <div slot="address" slot-scope="record">
        <div v-for="item in record.addressList" :key="item.id">{{ dealAddressType(item.type) }}:{{ item.address }}</div>
      </div>
      <div slot="operation" slot-scope="record">
        <a class="operation_btn" @click="updatelLitigant(record)">{{ isEdit ? '修改':'查看' }}</a>
        <a class="operation_btn1" @click="delLitigant(record)">删除</a>
      </div>
    </Table>
    <AddLitigant ref="addLitigant" :is-edit="isEdit" @done="getLitigant" />
  </div>
</template>
<script>
import { Table } from 'ant-design-vue'
import { listLitigantByCase, delLitigant } from '@/api/sfAddcase/index'
import { relation, addResstype } from '@/type/index.js'
import AddLitigant from '@/components/sfAddLitigant/index'
import { mapGetters } from 'vuex'
const columns = [
  { title: '诉讼地位', dataIndex: 'litigationStatus.name', key: 'litigationStatus.name', align: 'center', width: 100 },
  { title: '类型', dataIndex: 'type', key: 'type', align: 'center', width: 100,
    customRender: function(text) {
      const map = {
        0: '自然人',
        1: '法人',
        2: '非法人'
      }
      return map[text]
    }
  },
  { title: '姓名或者单位名称', dataIndex: 'name', key: 'name', align: 'center', width: 200 },
  { title: '证件号码', dataIndex: 'idCard', key: 'idCard', align: 'center', width: 250 },
  { title: '联系电话', align: 'center', scopedSlots: { customRender: 'phone' }, width: 200 },
  { title: '地址', scopedSlots: { customRender: 'address' }, align: 'sueDate' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center', width: 150 }
]

export default {
  components: {
    Table,
    AddLitigant
  },
  props: {
    isEdit: { // 是否能修改
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
    ...mapGetters(['getSfLawCaseId'])
  },
  created() {
    this.getLitigant()
  },
  mounted() {

  },
  methods: {
    // 获取当事人
    getLitigant() {
      if (!this.getSfLawCaseId) {
        return
      }
      this.list = []
      listLitigantByCase({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            if (item.agentFlag === true) {
              item.litigationStatus.name = '代理人'
            }
            return item
          })
        }
      })
    },
    dealPhoneType(index) {
      if (!index) {
        return ''
      }
      return relation[index - 1].value
    },
    dealAddressType(index) {
      if (!index) {
        return ''
      }
      return addResstype.find(item => item.value == index).label
    },
    // 删除当事人
    delLitigant(e) {
      this.$confirm({
        title: '是否删除该当事人',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sfLitigantId: e.id
          }
          delLitigant(params).then(({ code, msg }) => {
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
    updatelLitigant(e) {
      this.$refs.addLitigant.show(e.id)
    },
    // 添加当事人
    addLitiant() {
      this.$refs.addLitigant.show()
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
.operation_btn2 {
  color: @btn3-color;
}

</style>
