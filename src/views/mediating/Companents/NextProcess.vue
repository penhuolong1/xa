<template>
  <div>
    <Modal
      v-model="isNext"
      :mask-closable="false"
      title="转下一流程"
    >
      <Form ref="form" :schema="schema" :wrapper-col="16" @change="change" />

      <template slot="footer">
        <Button @click="isNext=false">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="onConfirm">
          确认
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import Form from '@/components/Form'
import { Modal, Button } from 'ant-design-vue'
import { mediationNextProcess, allCaseNext } from '@/api/freeze/index.js'
import moment from 'moment'

export default {
  components: {
    Form, Button, Modal
  },
  props: {
    isWhole: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      isNext: false,
      caseType: 1,
      lawCase: [],
      valArr: [],
      nullArr: [],
      mediateResult: null,
      caseStatusStr: '',
      result: '',
      schema: [
        {
          label: '转下一流程',
          type: 'select',
          field: 'caseStatusStr',
          options: [{
            label: '待正式立案',
            value: '待正式立案'
          }, {
            label: '诉前销案',
            value: '诉前销案'
          }],
          formOption: { rules: [{ required: true, message: '请选择下一流程' }] }

        },
        {
          label: '调解结果',
          type: 'select',
          field: 'mediateResult',
          options: [{
            label: '调解成功',
            value: true
          },
          {
            label: '调解失败',
            value: false
          }],
          formOption: { rules: [{ required: true, message: '请选择调解结果' }] }
        },
        {
          label: '调解结束时间',
          type: 'date',
          field: 'mediateFinishTime',
          formOption: { rules: [{ required: false, message: '请输入理由' }], initialValue: this.format(new Date(), 'YYYY-MM-DD H:m:s') }

        },
        {
          label: '申请司法确认',
          type: 'select',
          field: 'needJudgeConform',
          formOption: { rules: [{ required: true, message: '请选择是否需要申请司法确认' }] },
          vIf: () => {
            return this.mediateResult === true && this.caseStatusStr === '待正式立案'
          },
          options: [{
            label: '是',
            value: true
          }, {
            label: '否',
            value: false
          }]

        },
        {
          label: '处理情况',
          type: 'select',
          field: 'nextProcess',
          options: [{
            label: '移送',
            value: '移送'
          }, {
            label: '调解',
            value: '调解'
          }, {
            label: '撤诉',
            value: '撤诉'
          },
          {
            label: '其他',
            value: '其他'
          }],
          formOption: { rules: [{ required: true, message: '请选择处理情况' }] },
          vIf: () => {
            return this.caseStatusStr === '待正式立案'
          }

        },
        {
          label: '诉前结案时间',
          type: 'date',
          field: 'lawCasePreFinishTime',
          formOption: { rules: [{ required: true, message: '请选择诉前结案时间' }], initialValue: this.format(new Date(), 'YYYY-MM-DD H:m:s') }
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'remark'

        }
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(selectedRows) {
      if (selectedRows.length > 1) {
        selectedRows.map(item => {
          if (item.lawCaseBean.caseNo || item.caseNo) {
            this.valArr.push(item)
          } else {
            this.nullArr.push(item)
          }
        })
        if (this.valArr.length > 0 && this.nullArr.length > 0) {
          this.$message.error('只能选择同种类型的案件')
          this.valArr = []
          this.nullArr = []
          return
        }
      }
      this.lawCase = []
      selectedRows.map(item => {
        console.log(item.caseId)
        if (!this.isWhole) {
          this.lawCase.push(item.lawCaseBean.id)
        }
        if (this.isWhole) {
          this.lawCase.push(item.caseId)
        }
      })
      this.valArr = []
      this.nullArr = []
      this.isNext = true
    },
    change(e) {
      console.log(e)
      if (e.field === 'nextProcess') {
        this.nextProcess = e.value.nextProcess
        console.log(this.nextProcess)
      }
      if (e.field === 'caseStatusStr') {
        this.caseStatusStr = e.value.caseStatusStr
      }
      if (e.field === 'mediateResult') {
        this.mediateResult = e.value.mediateResult
      }
    },
    onConfirm() {
      this.$refs.form.getFieldsValue().then(res => {
        const params = {
          ...res,
          lawCase: this.lawCase
        }
        params.lawCasePreFinishTime = moment(res.lawCasePreFinishTime).format('YYYY-MM-DD HH:mm:ss')
        this.loading = true
        if (!this.isWhole) {
          mediationNextProcess(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
              this.$refs.form.resetFields()
              this.isNext = false
            }
          })
        }

        // 全案件-转下一流程
        if (this.isWhole) {
          params.lawCases = this.lawCase
          delete params.lawCase
          params.process = '调解中'
          allCaseNext(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
              this.$refs.form.resetFields()
              this.isNext = false
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
