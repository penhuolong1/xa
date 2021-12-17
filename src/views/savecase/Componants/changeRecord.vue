<template>
  <div>
    <Modal
      v-model="isend"
      title="修改保全案号"
      width="680px"
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
          label="修改保全案号"
        >
          <CaseNo
            ref="caseNo"
            v-decorator="['caseNo', { rules: [{ required: false, message: '请输入保全案号' }], initialValue: '' }]"
            class="required"
            :type-list="typelist"
            :is-need-button="false"
            :input-disabled="false"
            :is-freeze="true"
            :preserve-case-no="selectedRows[0].preserveCaseBean.preserveCaseNo"
          />
        </FormItem>
        <FormItem label="保全立案时间">
          <DatePicker
            v-decorator="[
              'preserveDate'
            ]"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width:250px"
          />
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
import { Button, Modal, Form, DatePicker, Input, Select } from 'ant-design-vue'
import { changeCaseNo } from '@/api/freeze/index.js'
import 'moment/locale/zh-cn'
import CaseNo from '@/components/CaseNo/index.vue'

import moment from 'moment'
export default {
  components: {
    Modal,
    Button,
    Form,
    FormItem: Form.Item,
    DatePicker,
    CaseNo
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
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
      typelist: [{
        label: '闽0213财保',
        value: '闽0213财保'
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
      setTimeout(() => {
        this.isend = true
      }, 100)
    },
    changetime(time) {
      this.endtime = time
    },

    onConfirm() {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
      })
      const params = {
      }
      if ((!this.$refs.caseNo.year && this.$refs.caseNo.num) || (this.$refs.caseNo.year && !this.$refs.caseNo.num)) {
        this.$message.error('请将保全案号填写完整')
        return
      }
      if (!this.$refs.caseNo.year && !this.$refs.caseNo.num) {
        this.$message.error('案号不能为空')
        return
      }
      if (this.$refs.caseNo.year && this.$refs.caseNo.num) {
        params.caseNo = this.$refs.caseNo.getCaseNo().caseNo
      }
      this.over(params)
    },
    over(params) {
      this.form.validateFields((err) => {
        if (err) {
          return
        }
        this.loading = true
        changeCaseNo(this.selectedRows[0].id, params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.isend = false
            this.form.resetFields()
            this.$emit('refresh')
            this.$refs.caseNo.reset()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
