<template>
  <div>
    <Modal
      v-model="isaccept"
      title="接收"
      :mask-closable="false"
      width="600px"
    >
      <template slot="footer">
        <Button key="back" @click="isaccept=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="acceptConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="下一流程"
        >
          <Select
            v-decorator="[
              'nextProcess',
              { rules: [{ required: true,message: '请选择接收类型' }] },
            ]"
            @change="changeType"
          >
            <SelectOption value="审理中">审理中</SelectOption>
            <SelectOption value="结案">结案</SelectOption>

          </Select>
        </FormItem>
        <FormItem
          label="确认完成送达时间"
        >
          <DatePicker
            v-decorator="[
              'sendFinishTime',
              { rules: [{ required: true, message: '请选择完成时间' }] },
            ]"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </FormItem>
        <div v-if="type==1">
          <FormItem label="是否短信/微信推送">
            <RadioGroup
              v-decorator="[
                'notificationLitigant',{ rules: [{ required: false}] ,initialValue: true}
              ]"

              @change="changeNotice"
            >
              <Radio :value="true">是</Radio>
              <Radio :value="false">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            v-if="isNotice==1"
            label="提示的方式"
          >
            <RadioGroup
              v-decorator="[
                'notificationWay',
              ]"
            >
              <Radio value="SMS">短信</Radio>
              <Radio value="WeChat">微信</Radio>
            </RadioGroup>
          </FormItem>
        </div>
        <FormItem
          v-if="type==2"
          label="处理情况"
        >
          <Select
            v-decorator="[
              'condition',
              { rules: [{ required: true,message: '请选择接收类型' }] },
            ]"
          >
            <SelectOption value="判决">判决</SelectOption>
            <SelectOption value="调解">调解</SelectOption>
            <SelectOption value="撤诉">撤诉</SelectOption>

          </Select>
        </FormItem>
        <FormItem
          label="备注"
        >
          <TextArea
            v-decorator="[
              'remark',
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, DatePicker, Select, Radio } from 'ant-design-vue'
import moment from 'moment'
import { receiveLawCase } from '@/api/freeze/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    Select,
    SelectOption: Select.Option,
    RadioGroup: Radio.Group,
    Radio,
    DatePicker,
    FormItem: Form.Item,
    TextArea: Input.TextArea
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type: 1, // 接收类型
      isNotice: 1, // 是否短信/微信推送
      loading: false,
      isaccept: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.isaccept = true
    },
    changeType(e) {
      if (e == '审理中') {
        this.type = 1
      } else {
        this.type = 2
      }
    },
    changeNotice(e) {
      console.log(typeof e.target.value)
      if (e.target.value) {
        this.isNotice = 1
      } else {
        this.isNotice = 0
      }
    },
    acceptConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        const form = this.form.getFieldsValue()
        const params = {
          ...form
        }
        params.sendProcessId = this.selectedRows[0].SPid
        receiveLawCase(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.isaccept = false
            this.$emit('refresh')
            this.form.resetFields()
            this.$message.success(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
