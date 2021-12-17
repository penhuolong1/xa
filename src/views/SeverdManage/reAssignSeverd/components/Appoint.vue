<template>
  <div>
    <Modal
      v-model="appoint"
      title="指派送达员"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="appoint=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="appointConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <Judge
          label="公证处送达员"
          field="notarySenderId"
          :type="12"
          :form-option="{ rules: [{ required: true,message:'请选择送达员'}],initialValue:notarySender.notarySenderName }"
          @change="changeNotary"
        />
        <Judge
          label="邮政送达员"
          field="postalSenderId"
          :type="13"
          :form-option="{ rules: [{ required: true,message:'请选择送达员'}],initialValue:postalSender.postalSenderName}"
          @change="changePost"
        />
        <FormItem
          label="最迟完成时间"
        >
          <Input v-decorator="['lastFinishDay', { rules: [{ required: true,message:'请输入最迟完成时间'}],initialValue:15 }] " suffix="天内" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Select, Input } from 'ant-design-vue'
import Judge from '@/components/Common/Judge'
import { appoint, relationSender } from '@/api/freeze/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    Judge
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      paramsObj: {},
      appoint: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      notarySender: {
        notarySenderName: '',
        notarySenderId: ''
      },
      postalSender: {
        postalSenderName: '',
        postalSenderId: ''
      },
      id: ''

    }
  },
  watch: {
    // selectedRows: {
    //   handler(val) {
    //     this.id = val[0].lawCaseBean.id
    //   },
    //   deep: true
    // }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.getBackMess()
      console.log(this.postalSender)
      this.appoint = true
    },
    changeNotary(e) { // 修改公证处
      this.notarySender.notarySenderId = e
    },
    changePost(e) { // 修改邮政送达员
      this.postalSender.postalSenderId = e
    },
    appointConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.paramsObj = this.selectedRows.map(item => {
          return {
            sendProcessId: item.id,
            lastFinishDay: this.form.getFieldsValue().lastFinishDay,
            notarySenderId: this.notarySender.notarySenderId,
            postalSenderId: this.postalSender.postalSenderId
          }
        })
        const params = [
          ... this.paramsObj
        ]
        console.log(params)
        this.loading = true
        appoint(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.appoint = false
            this.form.resetFields()
            this.$emit('refresh')
          }
        })
      })
    },
    // 获取回填信息
    getBackMess() {
      relationSender(this.selectedRows[0].lawCaseBean.id).then(({ code, data }) => {
        if (code === 200) {
          this.notarySender.notarySenderId = data ? data.notarySenderId : null
          this.notarySender.notarySenderName = data ? data.notarySenderName : null
          this.postalSender.postalSenderId = data ? data.postalSenderId : null
          this.postalSender.postalSenderName = data ? data.postalSenderName : null
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
