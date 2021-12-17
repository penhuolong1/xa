<template>
  <div>
    <Modal
      v-model="ischange"
      title="修改鉴定类别"
      :mask-closable="false"
      style="width:600px"
      @ok="tochange"
    >
      <template slot="footer">
        <Button key="back" @click="ischange=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="tochange">
          确定
        </Button>
      </template>
      <Form :form="form1" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="鉴定类别"
        >
          <Select
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '请选择鉴定' }] },
            ]"
            @change="changetype"
          >
            <SelectOption v-for="(item) in typeselect" :key="item.label" :value="item.label" class="option">{{ item.label }}</SelectOption>

          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { caseList, change } from '@/api/freeze/index.js'
import { Button, Modal, Form, Select } from 'ant-design-vue'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
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
      ischange: false,
      loading: false,
      lawCaseArr: [],
      appraisalCaseArr: [],
      idArr: [],
      form1: this.$form.createForm(this, { name: 'coordinated' }),
      typeselect: [
        {
          label: '法医病理',
          value: 0
        },
        {
          label: '文书',
          value: 1
        },
        {
          label: '亲权',
          value: 2
        },
        {
          label: '电子数据',
          value: 3
        },
        {
          label: '车辆检测',
          value: 4
        }, {
          label: '机动车评估',
          value: 5
        }, {
          label: '文物',
          value: 6
        }, {
          label: '税务审计',
          value: 7
        }, {
          label: '法医精神病',
          value: 8
        }, {
          label: '其他',
          value: 9
        }

      ]

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      console.log(this.selectedRows)
      this.ischange = true
    },
    changetype(type) {
      this.typevalue = type
    },
    change(params) {
      change(params).then(res => {
        this.loading = false
        this.selectedRows = []
        this.lawCaseArr = []
        this.appraisalCaseArr = []
        if (res.code == 200) {
          this.ischange = false
          this.form1.resetFields()
          this.$message.success(res.msg)
          this.$emit('refresh')
        }
      })
    },
    // 修改鉴定类别
    tochange() {
      this.selectedRows.forEach(item => {
        this.lawCaseArr.push(item.lawCaseBean.id)
        this.appraisalCaseArr.push(item.id)
      })
      this.form1.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        if (this.type === 1) {
          const params = {
            appraisalType: this.typevalue,
            id: this.appraisalCaseArr,
            lawCase: this.lawCaseArr
          }
          this.change(params)
        } else {
          const params = {
            appraisalType: this.typevalue,
            id: this.selectRow.id.split(),
            lawCase: this.selectRow.lawCase.split()
          }
          this.change(params)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
