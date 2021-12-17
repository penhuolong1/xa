<template>
  <div>
    <Modal
      v-model="isover"
      title="结案"
      style="width:600px"
      :mask-closable="false"
      @ok="endcase"
    >
      <template slot="footer">
        <Button key="back" @click="isover=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="endcase">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          v-if="caseType==1"
          label="处理情况"
        >
          <Select
            v-decorator="[
              'closeTypeStr',
              { rules: [{ required: true }] },
            ]"
          >
            <SelectOption v-for="(item) in typeselect" :key="item.value" class="option">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          v-if="caseType==2"
          label="处理情况"
        >
          <Select
            v-decorator="[
              'closeTypeStr',
              { rules: [{ required: true }] },
            ]"
          >
            <SelectOption v-for="(item) in typeselect1" :key="item.value" class="option">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          v-if="caseType==2"
          label="诉前结案时间"
        >
          <DatePicker
            v-decorator="[
              'finishDate',
              { rules: [{ required: true, message: '请选择鉴定时间' }] },
            ]"
            value-format="YYYY-MM-DD"
          />
        </FormItem>
        <FormItem
          v-if="caseType==1"
          label="结案时间"
        >
          <DatePicker
            v-decorator="[
              'finishDate',
              { rules: [{ required: true, message: '请选择鉴定时间' }] },
            ]"
            value-format="YYYY-MM-DD HH:mm:ss"
            show-time
          />
        </FormItem>
        <FormItem
          label="备注"
        >
          <TextArea
            v-decorator="[
              'remark',
              { rules: [{ required: false, message: '请选择鉴定时间' }] },
            ]"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, DatePicker, Input, Select } from 'ant-design-vue'
import { finish } from '@/api/freeze/index.js'
import Bus from '../../coordination/Components/bus'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    DatePicker,
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
      date: '',
      isover: false,
      type: 1,
      caseType: 1,
      lawCases: [],
      valArr: [],
      nullArr: [],
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      typeselect: [
        {
          value: '判决'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
        }

      ],
      typeselect1: [
        {
          value: '移送'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
        },
        {
          value: '其他'
        },
        {
          value: '诉前销案'
        }
      ]
    }
  },
  created() {
  },
  methods: {

    show(selectedRows) {
      this.lawCases = []
      if (selectedRows) {
        if (selectedRows[0].caseNo) {
          this.caseType = 1
        } else {
          this.caseType = 2
        }
        selectedRows.map(item => {
          if (item.caseNo) {
            this.valArr.push(item)
          } else {
            this.nullArr.push(item)
          }
        })
        console.log(this.valArr)
        if (this.valArr.length > 0 && this.nullArr.length > 0) {
          this.$message.error('只能选择同种类型的案件')
          this.valArr = []
          this.nullArr = []
          return
        }
      }
      selectedRows.map(item => {
        this.lawCases.push(item.caseId)
      })
      this.valArr = []
      this.nullArr = []
      this.isover = true
    },
    endcase() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          ...this.form.getFieldsValue(),
          lawCases: this.lawCases
        }
        params.finishDate = moment(params.finishDate).format('YYYY-MM-DD 00:00:00')
        finish(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.form.resetFields()
            this.$message.success(msg)
            this.isover = false
            this.$emit('done')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
