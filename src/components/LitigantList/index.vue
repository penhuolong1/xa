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
      <div slot="phone" slot-scope="record">
        <span v-if="record.litigantPhones && record.litigantPhones.length > 0">
          <div v-for="item in record.litigantPhones" :key="item.id">{{ item.relation }}:{{ item.phone }}</div>
        </span>
      </div>
      <div slot="address" slot-scope="record">
        <span v-if="record.litigantAddresses && record.litigantAddresses.length > 0">
          <div v-for="item in record.litigantAddresses" :key="item.id">{{ item.typeName }}:{{ item.address }}</div>
        </span>
      </div>
      <div slot="operation" slot-scope="record">
        <a class="operation_btn" @click="updatelLitigant(record)">编辑</a>
        <a class="operation_btn1" @click="delLitigant(record)">删除</a>
        <a class="operation_btn2" @click="toggle(record)">{{ record.isToggle ? '收起':'展开' }}</a>
      </div>
      <div slot="expandedRowRender" slot-scope="record">
        <Collapse :default-active-key="[1,2]">
          <CollapsePanel key="1">
            <div slot="header" style="text-align: left;">
              <span class="inner-table-title">电话信息</span>
              <!-- <Button type="primary" class="ml-2.5 mr-2.5">历史电话选用</Button> -->
              <Button type="blue3" class="mr-2.5" @click="updateLinkAndAddress(record)">添加</Button>
            </div>
            <Table
              :columns="columns1"
              :row-key="(record,index)=>{return record.id}"
              :data-source="record.linkList"
              :pagination="false"
              class="detail-table"
            >
              <div slot="remark" slot-scope="record1">
                <CheckboxGroup :default-value="record1.remark" disabled>
                  <Checkbox value="打印到邮单">打印到邮单</Checkbox>
                </CheckboxGroup>
              </div>
              <div slot="operation" slot-scope="record1">
                <a class="operation_btn" @click="updateLinkAndAddress(record)">修改</a>
                <a class="operation_btn1" @click="delPhone(record1)">删除</a>
              </div>
            </Table>
          </CollapsePanel>
          <CollapsePanel key="2">
            <div slot="header" style="text-align: left;">
              <span class="inner-table-title">地址信息</span>
              <!-- <Button type="primary" class="ml-2.5 mr-2.5">地址库选用</Button> -->
              <Button type="blue3" class="mr-2.5" @click="updateLinkAndAddress(record)">添加</Button>
            </div>
            <Table
              :columns="columns2"
              :row-key="(record,index)=>{return record.id}"
              :data-source="record.addressList"
              :pagination="false"
              class="detail-table"
            >
              <div slot="remark" slot-scope="record1">
                <CheckboxGroup :default-value="record1.remark" disabled>
                  <Checkbox value="需邮寄">需邮寄</Checkbox>
                  <Checkbox value="需上门">需上门</Checkbox>
                  <Checkbox value="需委托">需委托</Checkbox>
                  <Checkbox value="确认地址">确认地址</Checkbox>
                </CheckboxGroup>
              </div>
              <div slot="operation" slot-scope="record1">
                <a class="operation_btn" @click="updateLinkAndAddress(record)">修改</a>
                <a class="operation_btn1" @click="delAddress(record1)">删除</a>
              </div>
            </Table>
          </CollapsePanel>
        </Collapse>
      </div>
    </Table>
    <AddLitigant ref="addLitigant" :is-edit="isEdit" @done="getLitigant" />
    <Agent ref="agent" :is-edit="isEdit" @done="getLitigant" />
  </div>
</template>
<script>
import { Table, Collapse, Button, Checkbox } from 'ant-design-vue'
import { queryLitigant, delLitigant, delLitAddr, delLitPhone, listLitInfo, changeSueState } from '@/api/addCase/index'
import { addResstype, partyType } from '@/type/index.js'
import Tag from '@/components/Tag/index.vue'
import AddLitigant from '@/components/AddLitigant/index'
import Agent from '@/components/Agent/index'
import { formatDate } from '@/utils/format.js'
import { mapGetters } from 'vuex'

const columns1 = [
  { title: '与当事人关系', dataIndex: 'relation', key: 'relation', align: 'center' },
  { title: '电话号码', dataIndex: 'phone', key: 'phone', align: 'center' },
  { title: '送达率', dataIndex: 'sendRate', key: 'sendRate', align: 'center' },
  { title: '标记', scopedSlots: { customRender: 'remark' }, key: 'remark', align: 'center' },
  { title: '添加人', dataIndex: 'addPeople', key: 'addPeople', align: 'center' },
  { title: '添加时间', dataIndex: 'addDate', key: 'addDate', align: 'center' },
  { title: '操作', scopedSlots: { customRender: 'operation' }, key: 'operation', align: 'center' }
]

const columns2 = [
  { title: '地址类型', dataIndex: 'typeName', key: 'typeName', align: 'center' },
  { title: '地址', dataIndex: 'address', key: 'address', align: 'center', width: 300 },
  { title: '有效期', dataIndex: 'validityDate', key: 'validityDate', align: 'center' },
  { title: '标记', scopedSlots: { customRender: 'remark' }, key: 'remark', align: 'center' },
  { title: '添加人  ', dataIndex: 'addPeople', key: 'addPeople', align: 'center' },
  { title: '添加时间', dataIndex: 'addDate', key: 'addDate', align: 'center' },
  { title: '操作', scopedSlots: { customRender: 'operation' }, key: 'operation', align: 'center' }
]

export default {
  components: {
    Table,
    Collapse,
    CollapsePanel: Collapse.Panel,
    Button,
    Checkbox,
    Tag,
    Agent,
    CheckboxGroup: Checkbox.Group,
    AddLitigant
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
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', align: 'center' },
        { title: '一审诉讼地位', dataIndex: 'litigationStatus', key: 'litigationStatus', align: 'center' },
        { title: '类型', dataIndex: 'type', key: 'type', align: 'center'
        },
        { title: '姓名或者单位名称', dataIndex: 'litigantName', key: 'litigantName', align: 'center', width: 200,
          customRender: (text, row) => {
            const tag = row.countercharge === true ? (<Tag text='反诉'/>) : ''
            return (<span>{text}{tag}</span>)
          } },
        { title: '代理关系', dataIndex: 'agentName', key: 'agentName', align: 'sueDate', width: 150 },
        { title: '电话号码', align: 'center', scopedSlots: { customRender: 'phone' }, width: 150 },
        { title: '地址', align: 'center', scopedSlots: { customRender: 'address' }, width: 200 },
        { title: '状态', dataIndex: 'state', key: 'state', align: 'center',
          customRender: (text, row) => {
            if (row.litigationStatus === '被告' || row.litigationStatus === '被告（代理人）') {
              if (row.state === 0) {
                return (<span>撤诉<a class='ml-2.5' onclick={() => { this.changeSue(row) }}>重新起诉</a></span>)
              } else if (row.state === 1) {
                return (<span>起诉<a class='ml-2.5' onclick={() => { this.changeSue(row) }}>撤诉</a></span>)
              } else {
                return (<span>起诉<a class='ml-2.5' onclick={() => { this.changeSue(row) }}>撤诉</a></span>)
              }
            } else {
              return '-'
            }
          }
        },
        { title: '起诉时间', dataIndex: 'sueDate', key: 'sueDate', align: 'sueDate' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center' }
      ],
      columns1,
      columns2,
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
    // 选择当事人
    onSelectChange(e) {
      console.log(this.selectedRowKeys)
      this.selectedRowKeys = e
    },
    toggle(data) {
      const index = data.index - 1
      if (!this.expandedRowKeys || this.expandedRowKeys.length === 0) {
        this.expandedRowKeys.push(index)
        this.list[index].isToggle = true
        return
      }
      const index1 = this.expandedRowKeys.findIndex(item => item === index)
      if (index1 === -1) {
        this.expandedRowKeys.push(index)
        this.list[index].isToggle = true
      } else {
        this.expandedRowKeys.splice(index1, 1)
        this.list[index].isToggle = false
      }
      console.log(this.expandedRowKeys)
    },
    // 获取当事人
    getLitigant() {
      if (!this.getLawCaseId) {
        return
      }
      this.list = []
      listLitInfo({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            item.isToggle = false
            item.type = partyType.find(item1 => item1.value === item.type).label
            item.linkList = item.litigantPhones && item.litigantPhones.length > 0 ? item.litigantPhones.map(item1 => {
              item1.remark = item1.remark ? item1.remark.split(',') : []
              item1.addDate = item1.addDate ? this.$moment(item1.addDate).format('YYYY-MM-DD HH:mm:ss') : ''
              return item1
            }) : []
            item.addressList = item.litigantAddresses && item.litigantAddresses.length > 0 ? item.litigantAddresses.map(item1 => {
              item1.remark = item1.remark ? item1.remark.split(',') : []
              item1.validityDate = item1.validityDate ? this.$moment(item1.validityDate).format('YYYY-MM-DD HH:mm:ss') : ''
              item1.addDate = item1.addDate ? this.$moment(item1.addDate).format('YYYY-MM-DD HH:mm:ss') : ''
              const obj = addResstype.find(item2 => item2.value === item1.type)
              item1.typeName = obj ? obj.label : ''
              return item1
            }) : []
            if (item.agentFlag) { // 如果是代理人
              item.agentName = '代理当事人:' + item.principal
            }
            return item
          })
          console.log(this.list)
          this.expandedRowKeys = []
          // for (let i = 0; i < this.list.length; i++) {
          //   this.expandedRowKeys.push(i)
          // }
        }
      })
    },
    // 删除当事人
    delLitigant(e) {
      this.$confirm({
        title: '是否删除该当事人',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            litigantId: e.litigantId
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
      if (e.agentFlag) { // 如果是代理人 打开代理人得详情
        this.$refs.agent.show(e.litigantId, 1, e.agentFlag)
      } else {
        this.$refs.addLitigant.show(e.litigantId, 1, e.agentFlag)
      }
    },
    // 添加和修改地址和联系方式
    updateLinkAndAddress(e) {
      this.$refs.addLitigant.show(e.litigantId, 3)
    },
    // 添加当事人
    addLitiant() {
      this.$refs.addLitigant.show()
    },
    // 删除联系方式
    delPhone(e) {
      this.$confirm({
        title: '是否删除该联系方式',
        onOk: () => {
          const params = {
            litPhoneId: e.id
          }
          delLitPhone(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getLitigant()
            }
          })
        },
        onCancel() {}
      })
    },
    // 删除地址
    delAddress(e) {
      this.$confirm({
        title: '是否删除该地址',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            litAddrId: e.id
          }
          delLitAddr(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getLitigant()
            }
          })
        },
        onCancel() {}
      })
    },
    changeSue(e) {
      const params = {
        litigantId: e.litigantId,
        state: e.state === 1 ? 0 : 1
      }
      changeSueState(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getLitigant()
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
.operation_btn2 {
  color: @btn3-color;
}
/deep/.ant-table-thead {
  th:first-child {
    display: none;
  }
}
/deep/.ant-table-tbody {
  td:first-child {
    display: none;
  }
  >tr:nth-child(even) {
    background-color: white;
    // >td {
    //   padding: 0px;
    // }
  }
}
/deep/.ant-collapse {
  border-top: none;
  border-bottom: none;
}
.inner-table-title {
  color: @theme-color;
}
/deep/.ant-collapse-content-box {
  padding: 0px;
}
.detail-table {
  // /deep/.ant-table-body {
  //   background-color: #f4fbfe;
  // }
  /deep/.ant-table-thead {
    th:first-child {
      display: block;
    }
  }
  /deep/.ant-table-tbody {
    td:first-child {
      display: revert;
    }
    >tr:nth-child(even) {
      >td {
        padding: 16px;
      }
    }
    >tr:last-child {
      >td {
        border-bottom: none;
      }
    }
  }
  /deep/.ant-table-thead > tr > th {
    background-color: #f4fbfe;
  }
}
</style>
