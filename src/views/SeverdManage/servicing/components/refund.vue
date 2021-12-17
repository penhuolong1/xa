<template>
  <div>
    <Modal
      v-model="isrefund"
      title="退回"
      :mask-closable="false"
      width="600px"
    >
      <template slot="footer">
        <Button key="back" @click="isrefund=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="refundConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <UpProcess ref="procesShow" />

        <FormItem label="退回理由">
          <TextArea v-decorator="['refundedReason',{ rules: [{ required: true , message: '请输入退回理由'}] },] " />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { refundedLawCase } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input } from 'ant-design-vue'
import UpProcess from '@/components/UpProcess/index.vue'

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
      isrefund: false,
      loading: false,
      sendProcessIds: [],
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.isrefund = true
      this.selectedRows.map(item => {
        this.sendProcessIds.push(item.SPid)
      })
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].caseId)
      }, 10)
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
      this.getList()
    },
    refundConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          refundedReason: this.form.getFieldsValue().refundedReason,
          sendProcessIds: this.sendProcessIds
        }
        this.loading = false
        refundedLawCase(params).then(res => {
          this.$emit('refresh')
          this.isrefund = false
          this.sendProcessIds = []
          this.$message.success(res.msg)
          this.form.resetFields()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
