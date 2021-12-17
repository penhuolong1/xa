<template>
  <Modal
    v-model="visible"
    title="添加记录"
    class="modal"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <FormItem label="举证人">
        <Select v-decorator="['litigant',{rules: [{ required: true,message:'请选择举证人' }]}]" placeholder="请选择举证人">
          <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="证据名称">
        <Input v-decorator="['eviName', {rules: [{ required: true,message:'请输入证据名称' }]}]" type="text" placeholder="请输入证据名称" />
      </FormItem>
      <FormItem label="证明对象">
        <Input v-decorator="['eviProve', {rules: [{ required: true,message:'请输入证明对象' }]}]" type="text" placeholder="请输入证明对象" />
      </FormItem>
      <FormItem label="证据来源">
        <Input v-decorator="['eviSource', {rules: [{ required: true,message:'请输入证据来源' }]}]" type="text" placeholder="请输入证据来源" />
      </FormItem>
      <FormItem label="页数">
        <Input v-decorator="['eviPage']" type="number" placeholder="请输入页数" />
      </FormItem>
      <FormItem label="是否有原件">
        <RadioGroup v-decorator="['original', {initialValue: true}]" :options="options" />
      </FormItem>
      <FormItem label="附件">
        <Upload ref="upload" action="/api/court/file/uploadQtwEvidenceFile" show-type="url" />
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
import { Modal, Form, Select, Input, Button, Radio } from 'ant-design-vue'
import { litigantNameByCaseId } from '@/api/schedule/index.js'
import { saveQtwEvidence } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
import Upload from '@/components/Upload/index.vue'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Input,
    RadioGroup: Radio.Group,
    Button,
    Upload
  },
  props: {
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      options: [
        {
          value: true,
          label: '有'
        },
        {
          value: false,
          label: '无'
        }
      ],
      litigantList: []
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
    show() {
      this.visible = true
      this.getData()
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
        params.fileIds = this.$refs.upload.fileList && this.$refs.upload.fileList.length ? this.$refs.upload.fileList.map(item => item.data.id) : null
        this.loading = true
        saveQtwEvidence(params).then(({ code, msg }) => {
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
      litigantNameByCaseId({ caseId: this.getLawCaseId }).then(({ code, data }) => {
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
