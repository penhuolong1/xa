<template>
  <div class="wrapper">
    <!-- <Form ref="form1" :label-col="6" :schema="schema" @change="change" /> -->
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <FormItem label="化解结果">
        <Select v-if="getSfCaseInfo.mediatorId" v-decorator="['resultState', { rules: [{ required: true,message:'请选择化解结果' }]}]" placeholder="请选择化解结果" @change="change">
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
        <Select v-if="!getSfCaseInfo.mediatorId" v-decorator="['resultState', { rules: [{ required: true,message:'请选择化解结果' }]}]" @change="change">
          <SelectOption :value="2">当事人撤回调解请求</SelectOption>
          <SelectOption :value="99">其他</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="结案时间">
        <DatePicker
          v-decorator="['closeCaseDate', { rules: [{ required: true,message:'请选择结案时间' }], initialValue: format(new Date(), 'YYYY-MM-DD H:m:s')}]"
          show-time
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <FormItem v-if="resultState === 99" label="理由">
        <TextArea v-decorator="['opinion', { rules: [{ required: true,message:'请输入理由' }] }]" placeholder="理由" />
      </FormItem>
    </Form>
    <Col :span="6" />
    <Button type="primary" :loading="loading" @click="handleTeam">
      确认
    </Button>
  </div>
</template>

<script>
import { Button, Col, Form, Input, Select, DatePicker } from 'ant-design-vue'
// import Form from '@/components/Form'
import { closeCaseState } from '@/type/index.js'
import { caseClosed } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    DatePicker,
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
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo']),
    closeCaseList() {
      return this.getSfCaseInfo.mediatorId ? closeCaseState : [
        {
          value: 2,
          label: '撤回请求'
        },
        {
          value: 99,
          label: '其他'
        }
      ]
    }
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
        caseClosed(params).then(({ code, msg }) => {
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
