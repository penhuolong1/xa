<template>
  <div>
    <Modal
      v-model="isnext"
      title="转下一流程"
      :mask-closable="false"
      width="600px"
    >
      <template slot="footer">
        <Button key="back" @click="isnext=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="nextConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">

        <FormItem v-if="caseType==1" label="下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择是否送达' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="caseType==2" label="下一流程">
          <Select v-decorator="['nextProcess', { rules: [{ required: true,message:'请选择是否送达' }] }]" @change="changeNextType">
            <SelectOption v-for="(item, index) in nextList1" :key="index" :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>
        <!-- 诉前程序 -->
        <div v-if="type=='1'">
          <FormItem label="送达情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
        </div>
        <!-- 待正式立案 -->
        <div v-if="type=='2'">
          <FormItem label="处理情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择处理情况' }] }]">
              <SelectOption v-for="(item, index) in list1" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
        </div>
        <!-- 待庭室确认 -->
        <div v-if="type=='3'">
          <FormItem label="移交原因">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list2" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
        </div>
        <!-- 结案 -->
        <div v-if="type=='4'&&caseType==2 ">
          <FormItem label="处理情况">
            <Select v-decorator="['condition', { rules: [{ required: true,message:'请选择是否送达' }] }]">
              <SelectOption v-for="(item, index) in list3" :key="index" :value="item.value">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
        </div>
        <FormItem label="备注">
          <TextArea v-decorator="['remark'] " />
        </FormItem>

      </Form>
    </Modal>
  </div>
</template>
<script>

import moment from 'moment'
import { refundedLawCase } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input, Select, DatePicker, Radio } from 'ant-design-vue'
import Tribunal from '@/components/Common/Tribunal'
import { sendingNextProcess } from '@/api/freeze/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    Radio,
    RadioGroup: Radio.Group,
    Tribunal
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isnext: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      type: 1,
      caseType: 1,
      nextProcess: '诉前程序',
      needConform: 'true',
      nullArr: [],
      valueArr: [],
      laeCaseArr: [],
      nextList: [
        {
          value: '诉前程序'
        },
        {
          value: '待正式立案'
        }

      ],
      nextList1: [
        {
          value: '待庭室确认'
        },
        {
          value: '结案'
        }
      ],
      // 送达情况-诉前程序
      list: [
        {
          value: '诉前送达成功-适宜调解',
          label: '诉前送达成功-适宜调解'
        },
        {
          value: '诉前送达不成功-不适宜调解',
          label: '诉前送达不成功-不适宜调解'
        },
        {
          value: '送达失败',
          label: '送达失败'
        },
        {
          value: '电话送达成功-适宜调解',
          label: '电话送达成功-适宜调解'
        },
        {
          value: '现场送达成功',
          label: '现场送达成功'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      // 送达情况-待正式立案
      list1: [
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
        }
      ],
      // 送达情况-待庭室确认
      list2: [
        {
          value: '移交审理'
        },
        {
          value: '调解'
        },
        {
          value: '按撤诉处理'
        },
        {
          value: '撤诉'
        }
      ],
      // 送达情况-结案
      list3: [
        {
          value: '判决'
        },
        {
          value: '调解'
        },
        {
          value: '撤诉'
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
      if (this.selectedRows.length == 1) {
        if (!this.selectedRows.caseNo) {
          this.caseType = 1
        } else {
          this.caseType = 2
        }
      }
      if (this.selectedRows.length > 1) {
        this.selectedRows.forEach(item => {
          this.caseTypeArr.push(item.lawCaseBean.caseNo)
        })
        for (let i = 0; i <= this.caseTypeArr.length; i++) {
          if (!this.caseTypeArr[i]) {
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
      }
      this.nullArr = []
      this.valueArr = []
      this.caseTypeArr = []
      this.isnext = true
    },
    changePage(e) {
      if (e.pageSize !== this.searchParams.pageSize) {
        this.searchParams.pageNum = 1
        this.searchParams.pageSize = e.pageSize
      } else {
        this.searchParams.pageNum = e.current
      }
    },
    nextConfirm() {
      this.selectedRows.forEach(item => {
        this.laeCaseArr.push(item.caseId)
      })
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue(),
          lawCases: this.laeCaseArr
        }
        this.loading = true
        console.log(params)
        sendingNextProcess(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$emit('refresh')
            this.isnext = false
            this.form.resetFields()
          }
        })
      })
    },

    changeNextType(e) {
      this.nextProcess = e
      this.form.setFieldsValue({
        condition: undefined
      })
      if (e == '诉前程序') {
        this.type = 1
      } else if (e == '待正式立案') {
        this.type = 2
      } else if (e == '待庭室确认') {
        this.type = 3
      } else {
        this.type = 4
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
