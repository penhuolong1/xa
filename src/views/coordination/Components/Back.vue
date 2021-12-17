<template>
  <div>
    <Modal
      v-model="isback"
      title="撤回"
      :mask-closable="false"
      style="width:600px"
      @ok="backConfirm"
    >
      <template slot="footer">
        <Button key="back" @click="isback=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="backConfirm()">
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
              'remark',
              { rules: [{ required: true, message: '请输入退回备注' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input } from 'ant-design-vue'
import UpProcess from '@/components/UpProcess/index.vue'
import { withdraw } from '@/api/freeze/index.js'
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
    type: {
      type: Number,
      default: () => 1
    },
    collaborativeCase: {
      type: Number,
      default: () => 1
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isback: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      collaborativecaseArr: []
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    show() {
      console.log(this.selectedRows)
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请选择案件')
        return
      }
      this.isback = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].lawId)
      }, 10)
    },
    backConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        this.selectedRows.forEach(item => {
          this.collaborativecaseArr.push(item.id)
        })
        console.log(this.collaborativecaseArr)
        const params = new FormData()
        params.append('collaborativeCases', this.collaborativecaseArr)
        withdraw(params).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.form.resetFields()
            this.isback = false
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
