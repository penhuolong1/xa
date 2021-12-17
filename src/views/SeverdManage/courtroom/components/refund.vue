<template>
  <!-- 退回上一级 -->
  <div>
    <Modal
      v-model="isback"
      title="退回"
      style="width:600px"
      :mask-closable="false"
      @ok="backConfirm"
    >
      <template slot="footer">
        <Button key="back" @click="isback=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="backConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <UpProcess ref="procesShow" />
        <FormItem
          label="备注"
        >
          <TextArea
            v-decorator="[
              'refundedReason',
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, Select } from 'ant-design-vue'
import { refundedSend } from '@/api/freeze/index.js'
import UpProcess from '@/components/UpProcess/index.vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    UpProcess,
    Select,
    SelectOption: Select.Option

  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      sendProcessIdArr: [],
      isback: false,
      form: this.$form.createForm(this, { name: 'coordinated' }) // 退回表单
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
        this.sendProcessIdArr.push(item.SPid)
      })
      this.isback = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].caseId)
      }, 10)
    },
    // 退回确定方法
    backConfirm() {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          ...this.form.getFieldsValue(),
          sendProcessIds: this.sendProcessIdArr
        }
        this.loading = false
        refundedSend(params).then(res => {
          if (res.code == 200) {
            this.isback = false
            this.form.resetFields()
            this.$message.success(res.msg)
            this.$emit('refresh')
            this.sendProcessIdArr = []
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
