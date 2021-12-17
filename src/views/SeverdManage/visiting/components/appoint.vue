<template>
  <div>
    <Modal
      v-model="appoint"
      title="指派上门送达员"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="appoint=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="appointConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <Judge
          label="送达员"
          field="senderId"
          :type="4"
          :form-option="{ rules: [{ required: true,message:'请选择送达员'}] }"
        />
        <FormItem
          label="最迟完成时间"
        >
          <Input v-decorator="['limitedDay', { rules: [{ required: true,message:'请输入最迟完成时间'}] }] " suffix="天内" />
        </FormItem>
      </Form></Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input } from 'ant-design-vue'
import Judge from '@/components/Common/Judge'
import { editSendInfo } from '@/api/send/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    Judge
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      paramsObj: {},
      appoint: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.appoint = true
    },
    appointConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          ...this.form.getFieldsValue(),
          sendId: this.selectedRows[0].sendId,
          lawCaseId: this.selectedRows[0].caseId,
          litigantId: this.selectedRows[0].litigantId,
          sendType: '上门',
          sendState: 1
        }
        editSendInfo(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.appoint = false
            this.$message.success(res.msg)
            this.form.resetFields()
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
