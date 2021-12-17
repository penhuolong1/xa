<template>
  <div>
    <Modal
      v-model="appoint"
      title="指派送达员"
      :mask-closable="false"
      width="1450px"
    >
      <template slot="footer">
        <Button key="back" @click="appoint=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="appointConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
        <div class="title-wrapper">
          <div class="title">
            <Judge
              label="公证处送达员"
              :is-appoint="isAppoint"
              field="notarySenderId"
              :type="12"
              :placeholder="deliver"
              :form-option="{ rules: [{ required: true,message:'请选择送达员'}] }"
              style="width:25%"
              @change="change"
            />

            <Judge
              label="邮政送达员"
              :is-appoint="isAppoint"
              field="postalSenderId"
              :type="13"
              :placeholder="deliver"
              :form-option="{ rules: [{ required: true,message:'请选择送达员'}] }"
              style="width:25%"
              @change="change"
            />
            <FormItem label="最迟完成时间">
              <Input v-decorator="['lastFinishDay', { rules: [{ required: true,message:'请输入最迟完成时间'}] ,initialValue:15}] " suffix="天内" />
            </FormItem>
            <div class="btn">
              <Button type="blue3" @click="batchConfirm"> 批量确认 </Button>

              <Button type="blue2" @click="inteDispatch"> 智能分派 </Button>
            </div>
          </div>

        </div>
        <Divider />
        <Table
          :columns="columns"
          :data-source="tableList"
          :row-key="(record,index)=>{return index}"
          :loading="loading"
        >
          <div slot="deliver" slot-scope="record" class="deliver">
            <Select
              v-model="record.notarySenderId"
              class="required"
              placeholder="请选择"
              :default-value="record.notarySenderId"
              @change="change"
            >
              <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
            </Select>
          </div>
          <div slot="postalSender" slot-scope="record" class="deliver">
            <Select
              v-model="record.postalSenderId"
              placeholder="请选择"
              :default-value="record.postalSenderId"
              @change="change"
            >
              <SelectOption v-for="item in postlist" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
            </Select>
          </div>
          <div slot="lastFinish" slot-scope="record">
            <Input v-model="record.days" suffix="天内" :default-value="15" />
          </div>
        </Table>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Select, Input, Table, Divider } from 'ant-design-vue'
import Judge from '@/components/Common/Judge'
import { queryJudge } from '@/api/addCase/index.js'
import { appoint, relationSender } from '@/api/freeze/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    Table,
    Divider,
    Select,
    SelectOption: Select.Option,
    Judge
  },
  props: {
    // 父组件传来的值
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deliver: '',
      postalSender: '',
      isAppoint: false,
      finishDay: '',
      lastFinishDay1: '',
      paramsObj: {},
      selectedKey: [],
      appoint: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '预案号/案号',
          dataIndex: 'lawCaseBean.preCaseNo',
          key: 'lawCaseBean.preCaseNo',
          scopedSlots: { customRender: 'preCaseNo' },
          width: '120px'
        },
        {
          title: '案号',
          dataIndex: 'lawCaseBean.caseNo',
          key: 'lawCaseBean.caseNo',
          scopedSlots: { customRender: 'preCaseNo' },
          width: '120px'
        },

        {
          title: '预立案时间',
          dataIndex: 'lawCaseBean.preFilingDate',
          key: 'lawCaseBean.preFilingDate',
          width: '120px'
        },

        {
          title: '立案时间',
          dataIndex: 'lawCaseBean.filingDate',
          key: 'lawCaseBean.filingDate',
          width: '100px'
        },
        {
          title: '承办部门',
          dataIndex: 'lawCasePartBean.departmentName',
          key: 'lawCasePartBean.departmentName',
          width: '150px'

        },
        {
          title: '承办人',
          dataIndex: 'lawCasePartBean.judgeName',
          key: 'lawCasePartBean.judgeName',
          width: '80px'
        },
        {
          title: '法官助理',
          dataIndex: 'lawCasePartBean.AssistantJudgeName',
          key: 'lawCasePartBean.AssistantJudgeName',
          width: '80px'
        },

        {
          title: '公证处送达员',
          scopedSlots: { customRender: 'deliver' },
          width: '180px'
        },
        {
          title: '邮政送达员',
          scopedSlots: { customRender: 'postalSender' },
          width: '180px'
        },
        {
          title: '最迟完成时间',
          scopedSlots: { customRender: 'lastFinish' },
          width: '180px'

        }
      ],
      tabledata: [],
      list: [], // 公证处
      postlist: [], // 邮政
      tableList: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedKey = selectedRows
          console.log('selectedKey: ', selectedRows)
        }
      }
    }
  },
  created() {
    // this.getData()
  },
  mounted() {
  },
  methods: {
    show() {
      this.getData()

      this.tableList = this.selectedRows
      this.$forceUpdate()
      // return
      this.inteDispatch()
      this.appoint = true
    },
    change(e) {
      console.log(e)
      this.$forceUpdate()
    },
    getData() {
      // 获取当事人信息
      queryJudge({ type: 12 }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
          console.log(this.list)
        }
      })
      queryJudge({ type: 13 }).then(({ code, data }) => {
        if (code === 200) {
          this.postlist = data
          console.log(this.postlist)
        }
      })
    },
    // 批量确认
    batchConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.tableList = this.selectedRows.map(item => {
          item.notarySenderId = this.form.getFieldsValue().notarySenderId
          item.postalSenderId = this.form.getFieldsValue().postalSenderId
          item.days = this.form.getFieldsValue().lastFinishDay
          return item
        })
      })
      console.log(this.form.getFieldsValue())
      console.log(this.tableList)
      // this.deliver = this.form.getFieldsValue().deliver
      // this.finishDay = this.form.getFieldsValue().lastFinishDay
    },
    // 智能分派
    async inteDispatch() {
      console.log(this.tableList, this.selectedRows)
      this.tabledata = [...this.selectedRows]
      for (let i = 0; i < this.selectedRows.length; i++) {
        await relationSender(this.selectedRows[i].lawCaseBean.id).then(({ code, data }) => {
          if (code === 200) {
            this.tabledata[i].notarySenderId = data && data.notarySenderId ? data.notarySenderId : null
            this.tabledata[i].notarySenderName = data && data.notarySenderName ? data.notarySenderName : null
            this.tabledata[i].postalSenderId = data && data.postalSenderId ? data.postalSenderId : null
            this.tabledata[i].postalSenderName = data && data.postalSenderName ? data.postalSenderName : null
            this.tabledata[i].days = 15
            this.$forceUpdate()
          }
        })
      }

      // this.tabledata = this.selectedRows.map(item => {
      //   relationSender(item.lawCaseBean.id).then(({ code, data }) => {
      //     if (code === 200) {
      //       item.notarySenderId = data && data.notarySenderId ? data.notarySenderId : null
      //       item.notarySenderName = data && data.notarySenderName ? data.notarySenderName : null
      //       item.postalSenderId = data && data.postalSenderId ? data.postalSenderId : null
      //       item.postalSenderName = data && data.postalSenderName ? data.postalSenderName : null
      //       return
      //     }
      //   })
      // })
      console.log(this.tabledata)
    },
    appointConfirm() {
      console.log(this.tableList)
      // this.form.validateFields(err => {
      //   if (err) {
      //     return`
      //   }
      this.paramsObj = this.tableList.map(item => {
        return {
          sendProcessId: item.id,
          lastFinishDay: item.days,
          notarySenderId: item.notarySenderId,
          postalSenderId: item.postalSenderId
        }
      })
      const params = [
        ... this.paramsObj
      ]
      console.log(params)
      // return
      this.loading = true
      appoint(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.appoint = false
          this.form.resetFields()
          this.$emit('refresh')
        }
      })
      // })
    }
  }
}
</script>

<style scoped lang="less">
.title-wrapper{
  .title{
  display: flex;
    // width:30%;
  }
}
.btn{
  display: flex;
  float: right;
   justify-content: center;
  align-items: center;
  /deep/ .ant-btn{
    margin-top:-10px;
    margin-right: 10px;
  }
}
.deliver{
  display: flex;
   justify-content: center;
  align-items: center;
  margin-left: 13%;
  width:100%;
}
.lastFinish{
  display:flex;
  justify-content: center;
  align-items: center;
  span{
    width: 40px;
  }
}
</style>
