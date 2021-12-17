<template>
  <div>
    <Modal
      v-model="isback"
      title="退回"
      :mask-closable="false"
      style="width:600px"
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
          label="退回理由"
        >
          <TextArea
            v-decorator="[
              'remark',
              { rules: [{ required: false, message: '请输入退回理由' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { refundonSendProcess } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input } from 'ant-design-vue'
import UpProcess from '@/components/UpProcess/index.vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    UpProcess,
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
      isback: false,
      type: 0,
      disabled: true,
      caseTypeArr: [], // 判断用户选择的案件是否同一类型
      lawCaseArr: [],
      nullArr: [],
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
      if (this.selectedRows.length == 1) {
        if (this.selectedRows[0].lawCaseBean.caseNo) {
          this.type = 1
        } else {
          this.type = 0
        }
      }
      if (this.selectedRows.length > 1) {
        this.selectedRows.forEach(item => {
          this.caseTypeArr.push(item.lawCaseBean.caseNo)
        })
        console.log(this.caseTypeArr)
        for (let i = 0; i <= this.caseTypeArr.length; i++) {
          if (this.caseTypeArr[i] == null) {
            this.nullArr.push(this.caseTypeArr[i])
          } else {
            this.valueArr.push(this.caseTypeArr[i])
          }
          if (this.nullArr.length > 1 && this.valueArr.length >= 1) {
            this.$message.error('请选择相同类型的案件进行操作！')
            this.nullArr = []
            this.valueArr = []
            this.caseTypeArr = []
            return
          }
        }
        if (this.selectedRows[0].lawCaseBean.caseNo) {
          this.type = 1
        } else {
          this.type = 0
        }
      }
      this.nullArr = []
      this.valueArr = []
      this.caseTypeArr = []
      this.isback = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].lawCaseBean.id)
      }, 10)
      this.sendProcessIdArr = []
      this.selectedRows.map(item => {
        this.sendProcessIdArr.push(item.id)
      })
    },
    backConfirm() {
      this.form.validateFields((err, values) => {
        if (!err && this.selectedRows) {
          this.loading = true
          const form = this.form.getFieldsValue()
          const params = {
            ...form,
            sendProcessIds: this.sendProcessIdArr
          }
          refundonSendProcess(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.form.resetFields()
              this.$message.success(res.msg)
              this.sendProcessIds = []
              this.isback = false
              this.$emit('refresh')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
