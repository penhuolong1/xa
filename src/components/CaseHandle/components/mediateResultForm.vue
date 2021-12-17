<template>
  <div class="wrapper">
    <!-- <Form ref="form1" :label-col="6" :schema="schema" @change="change" /> -->
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <FormItem label="化解结果">
        <Select v-decorator="['resultState', { rules: [{ required: true,message:'请选择化解结果' }]}]" @change="change">
          <SelectOptGroup label="化解成功">
            <SelectOption :value="1">达成调解</SelectOption>
            <SelectOption :value="2">撤回请求</SelectOption>
          </SelectOptGroup>
          <SelectOptGroup label="化解失败">
            <SelectOption :value="3">联系不到</SelectOption>
            <SelectOption :value="4">明确表示不接受调解</SelectOption>
            <SelectOption :value="5">双方分歧较大且难以达成调解</SelectOption>
            <SelectOption :value="99">其他</SelectOption>
          </SelectOptGroup>
        </Select>
      </FormItem>
      <FormItem v-if="resultState === 99" label="备注">
        <TextArea v-decorator="['ramark', { rules: [{ required: true,message:'请输入备注内容' }] }]" placeholder="备注内容" />
      </FormItem>
    </Form>
    <Col :span="6" />
    <Button type="primary" :loading="loading" @click="handleTeam">
      确认
    </Button>
  </div>
</template>

<script>
import { Button, Col, Form, Input, Select } from 'ant-design-vue'
import { editMediateResult } from '@/api/sfAddcase/index.js'
import { closeCaseState } from '@/type/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Col,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Select,
    SelectOptGroup: Select.OptGroup,
    SelectOption: Select.Option
  },
  props: {

  },
  data() {
    return {
      loading: false,
      resultState: undefined,
      form: this.$form.createForm(this, { name: 'form' }),
      schema: [
        {
          label: '化解结果',
          type: 'select',
          field: 'resultState',
          formOption: { rules: [{ required: true, message: '请选择办结理由' }] },
          group: true,
          options: closeCaseState
        },
        {
          label: '备注',
          type: 'textArea',
          field: 'ramark',
          formOption: { rules: [{ required: true, message: '请输入理由' }] },
          vIf: () => {
            return this.resultState === 99
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo'])
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleTeam() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        params.sfLawCaseId = this.getSfCaseInfo.id
        editMediateResult(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.form.resetFields()
            this.$store.dispatch('GetSfCaseInfo')
            this.$store.dispatch('GetHandleOfCase')
            this.$store.dispatch('GetOperateLogOfCase')
          }
        })
      })
    },
    change(e) {
      this.resultState = e
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  padding-top: 50px;
}
</style>
