<template>
  <Modal
    v-model="visible"
    :title="title"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <div class="pop-wrapper">
      <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <FormItem label="预约诉前程序时间">
          <DatePicker
            v-decorator="['schedulingTime', { rules: [{ required: true,message:'预约诉前程序时间不能为空'}] }]"
            type="date"
            :show-today="false"
            :show-time="{
              'minute-step': 30,
              'second-step': 60,
              'disabledHours': () => {
                let hours = []
                for (var i = 0; i < 8; i++) {
                  hours.push(i)
                }
                for (var i = 17; i < 24; i++) {
                  hours.push(i)
                }
                return hours
              },
              defaultValue: moment('00:00', 'mm:ss')
            }"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem label="调解地点">
          <Select v-decorator="['tribunalId', { rules: [{ required: true,message:'请选择调解地点' }]}]" placeholder="请选择调解地点">
            <SelectOption v-for="item in tribunalList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <!-- <FormItem label="短信通知当事人">
          <RadioGroup v-decorator="['smsNotice', {initialValue: true}]" @change="getSmsNotice">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="smsNotice" label="通知对象">
          <CheckboxGroup v-decorator="['noticeObjects', { rules: [{ required: true,message:'请选择通知对象' }]}]">
            <Checkbox v-for="item in litigantList" :key="item.id" :value="item">{{ item.name }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem v-if="smsNotice" label="通知内容">
          <TextArea v-decorator="['content', { rules: [{ required: false}] ,initialValue:notificationMessage}] " :disabled="true" />
        </FormItem> -->
      </Form>
    </div>
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Form, Select, Radio, DatePicker, Checkbox, Input, Button } from 'ant-design-vue'
import { listTribunal, litigantNameByCaseId } from '@/api/schedule/index.js'
import { editPreScheduling } from '@/api/preientation/index.js'
import moment from 'moment'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Radio,
    RadioGroup: Radio.Group,
    Checkbox,
    CheckboxGroup: Checkbox.Group,
    DatePicker,
    Button,
    TextArea: Input.TextArea
  },
  props: {
    notificationMessage: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      title: '添加预约时间',
      tribunalList: [], // 调解地点
      litigantList: [], // 当事人列表
      lawCase: {}, // 案件信息
      smsNotice: true,
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    moment,
    show(obj) {
      console.log(this.notificationMessage)
      if (obj.schedulingTime) {
        this.title = '修改排期'
        this.$nextTick(() => {
          this.form.getFieldDecorator('schedulingTime', { initialValue: obj.schedulingTime + ':00' })
          this.form.getFieldDecorator('tribunalId', { initialValue: obj.tribunalId })
        })
      }
      this.lawCase = obj
      this.visible = true
      this.getData()
    },
    // 选择是否通知当事人
    getSmsNotice(e) {
      this.smsNotice = e.target.value
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        params.smsNotice = false
        params.noticeObjects = params.noticeObjects && params.noticeObjects.length > 0 ? params.noticeObjects.map(item => {
          return {
            id: item.id,
            partType: item.agentFlag ? 2 : 1 // 1当事人 2代理人
          }
        }) : []
        params.lawCaseId = this.lawCase.lawCaseId ? this.lawCase.lawCaseId : this.lawCase.caseId
        this.loading = true
        editPreScheduling(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.smsNotice = true
            this.$message.success(msg)
            this.visible = false
            this.$emit('done')
            this.form.resetFields()
          }
        })
      })
    },
    // 获取数据
    getData() {
      // 获取调解地点
      listTribunal({ type: 2 }).then(({ code, data }) => {
        if (code === 200) {
          this.tribunalList = data
        }
      })
      // 获取当事人
      litigantNameByCaseId({ caseId: this.lawCase.lawCaseId ? this.lawCase.lawCaseId : this.lawCase.caseId }).then(({ code, data }) => {
        if (code === 200) {
          this.litigantList = data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.ant-form-item{
  display: flex;
}
.ant-btn{
  margin:10px;
}
.caseno{
  display: flex;
}
.option{
  min-width:300px;
}
.financial{
  display: flex;
  /deep/.ant-select-selection{
    min-width:100px;
  }
}
</style>
