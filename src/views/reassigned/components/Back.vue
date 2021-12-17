<template>
  <!-- 退回上一级 -->
  <div>
    <Modal
      v-model="isback"
      title="回退上一流程"
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
              'remark',
              { rules: [{ required: false, message: '请输入退回备注' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, Select } from 'ant-design-vue'
import { refunded } from '@/api/freeze/index.js'
import UpProcess from '@/components/UpProcess/index.vue'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    UpProcess,
    TextArea: Input.TextArea
    // RangePicker: DatePicker.RangePicker
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lawCaseArr: [],
      mediationCaseArr: [],
      type: 1, // 1为诉前案件，2为正式案件
      list1: [
        {
          value: '预立案待审查'
        },
        {
          value: '预立案'

        }, {
          value: '诉前送达'
        }, {
          value: '诉前调查'
        }, {
          value: '调解'
        }
      ],
      list2: [
        {
          value: '待正式立案'
        },
        {
          value: '已立案待送达'
        }, {
          value: '庭前送达'
        }, {
          value: '审理中'
        }, {
          value: '冻结'
        }, {
          value: '不予受理'
        }, {
          value: '已结案'
        }
      ],
      loading: false,
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
      if (this.selectedRows[0].lawCaseBean.caseNo) {
        this.type = 2
      } else {
        this.type = 1
      }
      this.isback = true
      setTimeout(() => {
        this.$refs.procesShow.getProcess(this.selectedRows[0].lawCaseBean.id)
      }, 10)
    },
    // 退回确定方法
    backConfirm() {
      this.lawCaseArr = []
      this.mediationCaseArr = []
      this.selectedRows.forEach(item => {
        this.lawCaseArr.push(item.lawCaseBean.id)
        this.mediationCaseArr.push(item.id)
      })
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        const form = this.form.getFieldsValue()
        const params = {
          ...form,
          mediationCase: this.mediationCaseArr,
          lawCase: this.lawCaseArr
        }
        // if (!form.process) {
        //   params.caseStatus = '诉前送达'
        // } else {
        //   params.caseStatus = form.process
        // }
        delete params.caseStatus
        console.log(params)
        refunded(params).then(res => {
          this.loading = false
          if (res.code == 200) {
            this.$emit('refresh')
            this.form.resetFields()
            this.isback = false
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
