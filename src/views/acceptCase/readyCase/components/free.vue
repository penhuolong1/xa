<template>
  <Modal
    v-model="freemodel"
    :loading="loading"
    title="冻结案件"
    :mask-closable="false"
    width="600px"
    class="modal"
    @cancel="cancel"
  >
    <template slot="footer">
      <Button key="back" @click="cancel">
        取消
      </Button>
      <Button key="submit" type="primary" :loading="loading" @click="onConfirm()">
        确定
      </Button>
    </template>
    <div class="pop-wrapper">
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <!-- <FormItem label="类型">
          <Select
            v-decorator="['note', { rules: [{ required: true,message:'请选择案件类型'}], initialValue: note }] "
            style="width: 240px"
            :disabled="isDisabled"
            @change="typechange"
          >
            <SelectOption value="诉讼保全">诉讼保全</SelectOption>
            <SelectOption value="鉴定">鉴定</SelectOption>
          </Select>
        </FormItem> -->
        <div v-if="freeType==1">
          <FormItem label="是否冻结送达">
            <RadioGroup v-decorator="['enableSend', { rules: [{ required: true,message:'请选择是否送达' }],initialValue:'1' }]" @change="changeSend">
              <Radio label="yes" value="1">是</Radio>
              <Radio label="no" value="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <DateTo
            v-if="enableSend=='1'"
            field="canSendDate"
            :form-option="{ rules: [{ required: true,message:'请选择保全期限'}], initialValue: time || ''}"
          />
          <FormItem label="保全立案时间">
            <DatePicker
              v-decorator="['preserveDate']"
              placeholer="请选择时间"
              style="width: 240px"
              value-format="YYYY-MM-DD HH:mm:ss"
              show-time
            />
          </FormItem>
          <FormItem label="保全案号" class="financial">
            <CaseNo
              ref="caseNo"
              v-decorator="['caseNo', { rules: [{ required: false, message: '请输入保全案号' }], initialValue: '' }]"
              :type-list="typelist"
              :is-need-button="false"
              :input-disabled="false"
              :is-freeze="true"
            />
          </FormItem>
        </div>
        <div v-if="freeType==2">
          <FormItem label="移送鉴定时间">
            <DatePicker
              v-decorator="['appraisalStartTime', { rules: [{ required: true,message:'请选择移送鉴定时间' }] }]"
              style="width: 275px"
              show-time
              placeholder="请选择时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </FormItem>
          <FormItem label="鉴定类别">
            <Select v-decorator="['appraisalType', { rules: [{ required: true,message:'请选择鉴定类别' }] }]">
              <SelectOption v-for="(item) in typeselect" :key="item.value" class="option">{{ item.value }}</SelectOption>
            </Select>
          </FormItem>
        </div>
      </Form>
    </div>
  </Modal>
</template>
<script>
import CaseNo from '@/components/CaseNo/index.vue'

import { Modal, Form, Select, Radio, DatePicker, Button } from 'ant-design-vue'
import { addappraisalCase, addpreservationCase } from '@/api/freeze/index.js'
import DateTo from '@/views/savecase/Componants/dateTo.vue'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Modal,
    Form,
    Button,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Radio,
    RadioGroup: Radio.Group,
    DatePicker,
    CaseNo,
    DateTo
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      freemodel: false,
      whether: '',
      // type: 1,
      caseNo: '',
      isNeedButton: false,
      enableSend: '1',
      isDisabled: false,
      note: undefined,
      inputDisabled: false,
      loading: false,
      lawCaseArr: [],
      typelist: [{
        label: '闽0213财保',
        value: '闽0213财保'
      }
      ],
      time: '',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectList: [],
      typeselect: [
        {
          value: '法医病理'
        },
        {
          value: '文书'
        },
        {
          value: '亲权'
        },
        {
          value: '电子数据'
        },
        {
          value: '车辆检测'
        }, {
          value: '机动车评估'
        }, {
          value: '文物'
        }, {
          value: '税务审计'
        }, {
          value: '法医精神病'
        }, {
          value: '其他'
        }

      ]
    }
  },
  created() {
    console.log(this.freeType)
  },
  mounted() {
  },
  methods: {
    show(e, time) {
      console.log(e)
      this.freeType = e
      if (time) {
        this.time = time
      }
      this.freemodel = true
      this.lawCaseArr = []
    },
    typechange(value) {
      if (value == '诉讼保全') {
        this.type = 1
      } else {
        this.type = 2
      }
    },
    changeSend(e) {
      this.enableSend = e.target.value
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        if (this.freeType == 2) {
          this.selectKey.forEach(item => {
            this.lawCaseArr.push(item.lawCaseId || item.caseId)
          })
          const params = {
            lawCase: this.lawCaseArr,
            appraisalType: this.form.getFieldsValue().appraisalType,
            appraisalStartTime: this.form.getFieldsValue().appraisalStartTime
          }

          addappraisalCase(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.$emit('done', this.type)
              this.form.resetFields()
              this.freemodel = false
            }
          })
        } else {
          const canSendDate = this.form.getFieldsValue().canSendDate
          const preserveDate = this.form.getFieldsValue().preserveDate
          const params = {
            lawCase: this.selectKey[0].lawCaseId ? this.selectKey[0].lawCaseId : this.selectKey[0].caseId,
            preserveDate: preserveDate,
            enableSend: parseInt(this.form.getFieldsValue().enableSend),
            lawCaseBean: { 'canSendDate': canSendDate }
          }

          if (this.$refs.caseNo.year && this.$refs.caseNo.num) {
            params.preserveCaseNo = this.$refs.caseNo.getCaseNo().caseNo
          }
          if ((!this.$refs.caseNo.year && this.$refs.caseNo.num) || (this.$refs.caseNo.year && !this.$refs.caseNo.num)) {
            this.$message.error('请将保全案号填写完整')
            return
          }
          this.loading = true
          addpreservationCase(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$refs.caseNo.reset()
              this.$message.success(res.msg)
              this.$emit('done', this.freeType)
              this.form.resetFields()
              this.freemodel = false
            }
          })
        }
      })
    },
    // 取消
    cancel() {
      this.freemodel = false
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="less">

</style>
