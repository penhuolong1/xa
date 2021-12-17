<template>
  <Modal
    v-model="visible"
    title="审核"
    class="modal"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <FormItem label="结果">
        <Select v-decorator="['result', {rules: [{ required: true,message:'请选择结果' }]}]">
          <SelectOption value="争议焦点">争议焦点</SelectOption>
          <SelectOption value="无异议">无异议</SelectOption>
        </Select>
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
import { Modal, Form, Button, Select } from 'ant-design-vue'
import { qtwresetListInfo } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Button
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(listId) {
      this.listId = listId
      this.visible = true
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          // lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        params.listId = this.listId
        this.loading = true
        qtwresetListInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
            this.visible = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.ant-form-item{
  display: flex;
}
.ant-btn{
  margin:10px;
}
.caseno{
  display: flex;
}
.option{
  min-width:300px;
}
.financial{
  display: flex;
  /deep/.ant-select-selection{
    min-width:100px;
  }
}
</style>
