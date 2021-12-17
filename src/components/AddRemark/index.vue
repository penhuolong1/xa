<template>
  <Modal
    v-model="visible"
    title="添加备注"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <FormItem label="有信访趋势">
        <RadioGroup v-decorator="['willPetition', { rules: [{ required: true,message:'请选择是否有信访趋势' }],initialValue: false }]" :options="options" @change="getWillPetition" />
      </FormItem>
      <FormItem v-if="isWillPetition" label="当事人">
        <CheckboxGroup v-decorator="['litigants', { rules: [{ required: true,message:'请选择当事人' }]}]">
          <Checkbox v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="备注">
        <TextArea v-decorator="['remarkText', { rules: [{ required: true,message:'请输入备注内容' }] }]" placeholder="备注内容" />
      </FormItem>
    </Form>
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Form, Input, Button, Radio, Checkbox } from 'ant-design-vue'
import { addRemark } from '@/api/addCase/index'
import { litigantNameByCaseId } from '@/api/schedule/index.js'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Button,
    RadioGroup: Radio.Group,
    CheckboxGroup: Checkbox.Group,
    Checkbox
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      isWillPetition: false,
      litigantList: [],
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(caseId) {
      this.caseId = caseId
      this.visible = true
      this.getData()
    },
    getWillPetition(e) {
      setTimeout(() => {
        this.isWillPetition = this.form.getFieldsValue().willPetition
      }, 200)
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        params.lawCase = this.caseId
        params.litigants = params.litigants && params.litigants.length > 0 ? params.litigants.join(',') : ''
        this.loading = true
        addRemark(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.visible = false
          }
        })
      })
    },
    getData() {
      litigantNameByCaseId({ caseId: this.caseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            this.litigantList = []
            return
          }
          this.litigantList = data.filter(item => !item.agentFlag)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
