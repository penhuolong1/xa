<template>
  <div class="wrapper">
    <span v-if="getIsDeal === 0">
      <Form ref="form1" :label-col="6" :schema="schema" @change="change" />
      <Col :span="6" />
      <Button type="primary" :loading="loading" @click="handleTeam">
        确认
      </Button>
    </span>
    <Empty v-if="getIsDeal === 1" description="已处理" />
  </div>
</template>

<script>
import { Button, Col, Empty } from 'ant-design-vue'
import Form from '@/components/Form'
import { acceptOfMediator } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Col,
    Empty,
    Form
  },
  props: {

  },
  data() {
    return {
      loading: false,
      doType: undefined,
      form: this.$form.createForm(this, { name: 'form' }),
      schema: [
        {
          label: '处理',
          type: 'radio',
          field: 'doType',
          formOption: { rules: [{ required: true, message: '请选择处理方式' }] },
          options: [
            {
              value: 1,
              label: '接收'
            },
            {
              value: 4,
              label: '退回'
            }
          ]
        },
        {
          label: '退回理由',
          type: 'textArea',
          field: 'opinion',
          formOption: { rules: [{ required: true, message: '请输入理由' }] },
          vIf: () => {
            return this.doType === 4
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getIsDeal'])
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleTeam() {
      this.$refs.form1.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sfLawCaseId = this.getSfCaseInfo.id
        acceptOfMediator(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form1.resetFields()
            this.$store.dispatch('GetSfCaseInfo')
            this.$store.dispatch('GetHandleOfCase')
            this.$store.dispatch('GetOperateLogOfCase')
          }
        })
      })
    },
    change(e) {
      if (e.field === 'doType') {
        this.doType = e.value.doType
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  padding-top: 50px;
}
</style>
