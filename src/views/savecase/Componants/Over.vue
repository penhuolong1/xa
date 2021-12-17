<template>
  <div>
    <Modal
      v-model="isend"
      title="保全结束"
      style="width:600px"
      :mask-closable="false"
      @ok="onConfirm"
    >
      <template slot="footer">
        <Button key="back" @click="isend=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="onConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="保全结束时间"
        >
          <DatePicker
            v-decorator="[
              'frozenEndTime',
              { rules: [{ required: true, message: '请选择保全立案时间' }] },
            ]"
            placeholder="请选择时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
            @change="changetime"
          />
        </FormItem>
        <Refundedstate
          ref="refund"
          field="mediationPlace"
          :form-option="{ rules: [{ required: true,message:'请选择调解地点'}] }"
        />
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
import { Button, Modal, Form, DatePicker, Input, Select } from 'ant-design-vue'
import { finishpreservationCase } from '@/api/freeze/index.js'
import 'moment/locale/zh-cn'
import Refundedstate from './refundState.vue'
import moment from 'moment'
export default {
  components: {
    Modal,
    Button,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    DatePicker,
    Refundedstate
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    selectRow: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: () => 1
    }
  },
  data() {
    return {
      isend: false,
      loading: false,
      endtime: '',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      idArr: [],
      lawCaseArr: [],
      caseStatus: [{
        value: '预立案待审查'
      }, {
        value: '预立案'
      }, {
        value: '诉前送达'
      }, {
        value: '诉前调查'
      }, {
        value: '调查'
      },
      {
        value: '待正式立案'
      }, {
        value: '已立案待送达'
      }, {
        value: '庭前送达'
      }, {
        value: '审理中'
      }, {
        value: '冻结'
      },
      {
        value: '不予受理'
      }, {
        value: '已结案'
      }
      ]
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 保全结束
    show() {
      this.isend = true
      if (this.selectedRows && this.selectedRows.length != 0) {
        setTimeout(() => {
          this.$refs.refund.refunded(this.selectedRows[0].lawCaseBean.id)
        }, 10)
      } else {
        setTimeout(() => {
          this.$refs.refund.refunded(this.selectRow.lawCase)
        }, 10)
      }
      this.lawCaseArr = []
      this.idArr = []
    },
    changetime(time) {
      this.endtime = time
    },

    onConfirm() {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
      })
      if (this.type === 1) {
        this.selectedRows.forEach(item => {
          this.idArr.push(item.id)
          this.lawCaseArr.push(item.lawCaseBean.id)
        })
        const params = {
          id: this.idArr,
          lawCase: this.lawCaseArr,
          ...this.form.getFieldsValue()
        }
        this.over(params)
      } else {
        console.log(this.selectRow.lawCase.split())
        const params = {
          id: this.selectRow.id.split(),
          lawCase: this.selectRow.lawCase.split(),
          ...this.form.getFieldsValue()

        }
        this.over(params)
      }
    },
    over(params) {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        finishpreservationCase(params).then(res => {
          this.loading = false
          if (this.type == 1) {
            this.selectedRows[0].frozenEndTime = this.endtime
          } else {
            this.selectRow.frozenEndTime = this.endtime
          }
          if (res.code === 200) {
            this.isend = false
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
