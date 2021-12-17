<template>
  <div class="wrapper">
    <Form ref="form1" :label-col="6" :schema="schema" @change="change" />
    <Col :span="6" />
    <Button type="primary" :loading="loading" @click="handleTeam">
      确认
    </Button>
  </div>
</template>

<script>
import { Button, Col } from 'ant-design-vue'
import Form from '@/components/Form'
import { editMediateResult } from '@/api/sfAddcase/index.js'
import { closeCaseState } from '@/type/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Col,
    Form
  },
  props: {

  },
  data () {
    return {
      loading: false,
      resultState: undefined,
      type: null,
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo']),
    schema () {
      return [
        {
          label: '化解结果',
          type: 'select',
          field: 'resultState',
          formOption: { rules: [{ required: true, message: '请选择办结理由' }] },
          options: [
            {
              value: 6,
              label: '调解成功'
            },
            {
              value: 7,
              label: '调解失败'
            }
          ]
        },
        {
          label: this.resultState === 7 ? '是否申请立案' : '是否申请司法确认',
          type: 'radio',
          field: 'judicialApplyFlag',
          formOption: { rules: [{ required: true, message: '请输入理由' }] },
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ]
        },
        {
          label: '调解结束时间',
          type: 'date',
          field: 'mediateEndDate',
          showTime: true,
          formOption: { rules: [{ required: true, message: '请选择调解结束时间' }] }
        }
      ]
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    handleTeam () {
      this.$refs.form1.getFieldsValue().then(res => {
        const params = {
          ...res
        }
        params.sfLawCaseId = this.getSfCaseInfo.id
        editMediateResult(params).then(({ code, msg }) => {
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
    change (e) {
      console.log(e)
      if (e.field === 'resultState') {
        this.resultState = e.value.resultState
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
