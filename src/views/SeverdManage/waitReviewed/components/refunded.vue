<template>
  <div>
    <Modal
      v-model="refunded"
      title="退回"
      style="width:600px"
      :mask-closable="false"
    >
      <template slot="footer">
        <Button key="back" @click="refunded=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="refundConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <UpProcess ref="procesShow" />
        <FormItem
          label="退回理由"
        >
          <TextArea
            v-decorator="['refundedReason', { rules: [{ required: true,message:'请输入退回理由' }] }]"
            placeholder="退回理由"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input } from 'ant-design-vue'
import UpProcess from '@/components/UpProcess/index.vue'
import { refundedSending } from '@/api/freeze/index.js'
export default {
  components: {
    UpProcess,
    Button,
    Modal,
    Form,
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
      refunded: false,
      sendProcessIdArr: [],
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.sendProcessIdArr = []
      this.selectedRows.map(item => {
        this.sendProcessIdArr.push(item.sendProcessid)
      })
      this.refunded = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].caseId)
      }, 10)
    },
    refundConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          ...this.form.getFieldsValue(),
          sendProcessIds: this.sendProcessIdArr
        }
        this.loading = false
        refundedSending(params).then(res => {
          if (res.code === 200) {
            this.form.resetFields()
            this.$message.success(res.msg)
            this.selectedRows = []
            this.sendProcessIdArr = []
            this.refunded = false
            this.$emit('refresh')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
