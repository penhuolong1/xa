<template>
  <Modal
    title="添加关联"
    :visible="visible"
    :mask-closable="false"
    width="60%"
    @cancel="visible = false"
  >
    <div class="search-content">
      <div class="name">{{ obj.litigationStatus }}: {{ obj.name }}</div>
      <div class="content">
        <div class="search-item">
          <div class="label">关联方式:</div>
          <RadioGroup v-model="relateType" size="small" @change="getData">
            <RadioButton :value="1">同人不同案</RadioButton>
            <RadioButton :value="2">同案不同人</RadioButton>
          </RadioGroup>
        </div>
        <div class="search-item">
          <div class="label">关联类型:</div>
          <RadioGroup v-model="type" size="small" @change="getData">
            <RadioButton :value="1">电话</RadioButton>
            <RadioButton :value="2">地址</RadioButton>
          </RadioGroup>
        </div>
        <div v-if="relateType === 1" class="search-item">
          <div class="label">被关联案件状态:</div>
          <RadioGroup v-model="caseType" size="small" @change="getData">
            <RadioButton :value="0">全部</RadioButton>
            <RadioButton :value="1">未结案</RadioButton>
            <RadioButton :value="2">已结案</RadioButton>
          </RadioGroup>
        </div>
      </div>
    </div>
    <Table
      v-if="isTable"
      ref="table"
      :columns="columns"
      :data-source="list"
      :row-selection="{
        onChange: tableChange
      }"
      :selected-row-keys="selectTable"
      bordered
      :loading="tableLoading"
      :row-key="(record,index)=>{return record.id}"
      :pagination="false"
    />
    <template slot="footer">
      <Button @click="visible = false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="submit">
        确认
      </Button>
    </template>
  </Modal>
</template>

<script>
import { Modal, Table, Button, Radio, Checkbox, Input } from 'ant-design-vue'
import { relateTypeInfo } from '@/api/case/associate.js'
import { mapGetters } from 'vuex'
import { addSendRelateInfo } from '@/api/case/associate.js'

export default {
  components: {
    Modal,
    Table,
    Button,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    TextArea: Input.TextArea,
    Checkbox,
    CheckboxGroup: Checkbox.Group
  },
  props: {

  },
  data() {
    return {
      visible: false,
      columns: [],
      relateType: 1, // 关联方式
      type: 1, // 关联类型
      caseType: 0, // 被关联案件状态
      obj: {}, // 当事人信息
      list: [],
      phoneList: [], // 电话号码列表
      addressList: [], // 地址列表
      loading: false,
      selectPhone: [], // 选择的电话
      selectAddress: [], // 选择的地址
      remark: '', // 备注
      selectTable: [], // 表格选择
      tableLoading: false,
      isTable: true
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    show(data) {
      this.visible = true
      this.selectTable = []
      this.obj = data
      this.getData()
    },
    submit() {
      const params = {
        type: this.type,
        litigantIds: this.selectTable,
        remark: this.remark
      }
      if (params.type === 1) {
        params.phonesOrAddresses = this.selectPhone
      } else {
        params.phonesOrAddresses = this.selectAddress
      }
      params.litigantId = this.obj.litId
      if (!params.litigantIds || params.litigantIds.length === 0) {
        this.$message.error('请选择关联人')
        return
      }
      addSendRelateInfo(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.$emit('done')
          this.reset()
        }
      })
    },
    reset() {
      this.selectTable = null
      this.isTable = false
      setTimeout(() => {
        this.isTable = true
      }, 200)
      this.remark = ''
      this.type = 1
      this.relateType = 1
      this.caseType = 0
      this.selectPhone = []
      this.selectAddress = []
    },
    tableChange(e) {
      this.selectTable = e
    },
    // 获取数据
    getData() {
      const params = {
        relateType: this.relateType,
        type: this.type,
        caseType: this.caseType
      }
      if (params.relateType === 1) {
        params.litigantId = this.obj.litId
        params.caseId = ''
      } else {
        params.litigantId = ''
        params.caseId = this.getLawCaseId
        params.caseType = 0
      }
      this.tableLoading = true
      this.isTable = false
      relateTypeInfo(params).then(({ code, data }) => {
        this.tableLoading = false
        this.isTable = true
        if (code === 200) {
          this.list = []
          this.phoneList = []
          this.addressList = []
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            item.preCaseNo = item.lawCaseInfo.preCaseNo
            item.litName = `${item.litName}(${item.litigationStatus})`
            if (item.litigantPhones && item.litigantPhones.length > 0) {
              item.litigantPhones.forEach(item1 => {
                if (this.phoneList.length === 0) {
                  this.phoneList.push(item1)
                } else {
                  const index = this.phoneList.findIndex(item2 => item2.phone === item1.phone)
                  if (index === -1) {
                    this.phoneList.push(item1)
                  }
                }
              })
            }
            if (item.litigantAddresses && item.litigantAddresses.length > 0) {
              item.litigantAddresses.forEach(item1 => {
                if (this.addressList.length === 0) {
                  this.addressList.push(item1)
                } else {
                  const index = this.addressList.findIndex(item2 => item2.address === item1.address)
                  if (index === -1) {
                    this.addressList.push(item1)
                  }
                }
              })
            }
            return item
          })
          this.changeTable()
        }
      })
    },
    // 修改搜索条件改变表格样式
    changeTable() {
      if (this.relateType === 1) { // 同人不同案
        if (this.type === 1) { // 电话
          this.columns = [
            { title: '诉讼地位', dataIndex: 'statusName', key: 'statusName', align: 'center', width: 150 },
            { title: '案号', dataIndex: 'preCaseNo', key: 'preCaseNo', align: 'center', width: 200 },
            {
              title: '电话',
              dataIndex: 'phone',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: (<CheckboxGroup vModel={this.selectPhone}>
                    {
                      this.phoneList && this.phoneList.length > 0 ? this.phoneList.map(item => {
                        return <Checkbox value={item.phone}>{item.phone}</Checkbox>
                      }) : null
                    }
                  </CheckboxGroup>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            },
            {
              title: '备注',
              dataIndex: 'remark',
              align: 'center',
              width: 200,
              customRender: (text, row, index) => {
                const obj = {
                  children: (<TextArea vModel={this.remark} placeholder='请输入备注'></TextArea>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            }
          ]
        } else { // 地址
          this.columns = [
            { title: '诉讼地位', dataIndex: 'statusName', key: 'statusName', align: 'center', width: 150 },
            { title: '案号', dataIndex: 'preCaseNo', key: 'preCaseNo', align: 'center', width: 200 },
            {
              title: '地址',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: (<CheckboxGroup vModel={this.selectAddress}>
                    {
                      this.addressList && this.addressList.length > 0 ? this.addressList.map(item => {
                        return <Checkbox value={item.address}>{item.address}</Checkbox>
                      }) : null
                    }
                  </CheckboxGroup>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            },
            {
              title: '备注',
              dataIndex: 'remark',
              align: 'center',
              width: 200,
              customRender: (text, row, index) => {
                const obj = {
                  children: (<TextArea vModel={this.remark} placeholder='请输入备注'></TextArea>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            }
          ]
        }
      } else { // 同案不同人
        if (this.type === 1) { // 电话
          this.columns = [
            { title: '姓名或单位名称', dataIndex: 'litName', key: 'litName', align: 'center', width: 150 },
            { title: '案号',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: row.lawCaseInfo.preCaseNo,
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }, width: 200
            },
            {
              title: '电话',
              dataIndex: 'phone',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: (<CheckboxGroup vModel={this.selectPhone}>
                    {
                      this.phoneList && this.phoneList.length > 0 ? this.phoneList.map(item => {
                        return <Checkbox value={item.phone}>{item.phone}</Checkbox>
                      }) : null
                    }
                  </CheckboxGroup>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = 2
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            },
            {
              title: '备注',
              dataIndex: 'remark',
              align: 'center',
              width: 200,
              customRender: (text, row, index) => {
                const obj = {
                  children: (<TextArea vModel={this.remark} placeholder='请输入备注'></TextArea>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = 2
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            }
          ]
        } else { // 地址
          this.columns = [
            { title: '诉讼地位', dataIndex: 'litigationStatus', key: 'litigationStatus', align: 'center', width: 150 },
            { title: '案号',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: row.lawCaseInfo.preCaseNo,
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }, width: 200
            },
            {
              title: '地址',
              align: 'center',
              customRender: (text, row, index) => {
                const obj = {
                  children: (<CheckboxGroup vModel={this.selectAddress}>
                    {
                      this.addressList && this.addressList.length > 0 ? this.addressList.map(item => {
                        return <Checkbox value={item.address}>{item.address}</Checkbox>
                      }) : null
                    }
                  </CheckboxGroup>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            },
            {
              title: '备注',
              dataIndex: 'remark',
              align: 'center',
              width: 200,
              customRender: (text, row, index) => {
                const obj = {
                  children: (<TextArea vModel={this.remark} placeholder='请输入备注'></TextArea>),
                  attrs: {}
                }
                if (index === 0) {
                  obj.attrs.rowSpan = this.list.length
                } else {
                  obj.attrs.rowSpan = 0
                }
                return obj
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.content {
  display: flex;
  margin: 20px 0px;
  align-items: center;
  .search-item {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .label {
      margin-right: 5px;
    }
  }
}
/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
/deep/.ant-checkbox-wrapper{
  display: block;
}
</style>
