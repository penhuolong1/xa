<template>
  <div>
    <Modal
      v-model="istransfer"
      title="移交"
      :mask-closable="false"
      width="500px"
    >
      <template slot="footer">
        <Button key="back" @click="istransfer=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="transConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <Judge
          label="公证处送达员"
          field="notarySenderId"
          :type="12"
        />
        <Judge
          label="邮政送达员"
          field="postalSenderId"
          :type="13"
        />
        <div style="margin:10px 0;margin-left:10%;">注:公证处送达员、邮政送达员至少选择一个</div>
        <FormItem label="移交理由">
          <TextArea v-decorator="['transferReason',{ rules: [{ required: true , message: '请输入移交理由'}] }] " />
        </FormItem>
        <FormItem label="最迟完成天数">
          <Input v-decorator="['lastFinishDay',{ rules: [{ required: true , message: '请输入最迟完成天数'}] }] " suffix="天内" />
        </FormItem>
        <!-- <FormItem label="需要组长审核">
          <RadioGroup v-decorator="['needConform',{ rules: [{ required: false,message:'请选择是否需要组长审核' }],initialValue: true }] ">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem> -->
        <FormItem v-if="selectedRows[0].caseNo" label="是否销庭">
          <RadioGroup v-decorator="['needCancelSchedule',{ rules: [{ required: false,message:'请选择是否需要组长审核' }],initialValue: false }] ">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { transLawCase } from '@/api/freeze/index.js'
import { Button, Modal, Form, Input, Radio } from 'ant-design-vue'
import Judge from '@/components/Common/Judge'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    TextArea: Input.TextArea,
    Judge,
    Radio,
    RadioGroup: Radio.Group
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      istransfer: false,
      loading: false,
      sendProcessIdArr: [],
      form: this.$form.createForm(this, { name: 'coordinated' })

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.istransfer = true
      this.sendProcessIdArr = []
      this.selectedRows.map(item => {
        this.sendProcessIdArr.push(item.SPid)
      })
    },
    transConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ... this.form.getFieldsValue(),
          sendProcessIds: this.sendProcessIdArr
        }
        if (!params.notarySenderId && !params.postalSenderId) {
          this.$message.error('公证处送达员、邮政送达员至少选择一个!')
          return
        }
        // if (this.selectedRows[0].caseNo) {
        //   params.needCancelSchedule = true
        // } else {
        //   params.needCancelSchedule = null
        // }
        params.needConform = false
        this.loading = true

        transLawCase(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.istransfer = false
            this.$message.success(res.msg)
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
