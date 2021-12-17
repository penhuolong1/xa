<template>
  <Modal
    v-model="visible"
    title="添加记录"
    class="modal"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <FormItem label="真实性">
        <RadioGroup v-decorator="['truth', {initialValue: detailObj.truth || false}]" :options="options" />
      </FormItem>
      <FormItem label="合法性">
        <RadioGroup v-decorator="['legality', {initialValue: detailObj.legality || false}]" :options="options" />
      </FormItem>
      <FormItem label="关联性">
        <RadioGroup v-decorator="['relevance', {initialValue: detailObj.relevance || false}]" :options="options" />
      </FormItem>
      <FormItem label="原因">
        <Input v-decorator="['reason', {initialValue: detailObj.reason}]" type="text" /></FormItem>
      <FormItem label="其他意见">
        <Input v-decorator="['otherReason', {initialValue: detailObj.otherReason}]" type="text" /></FormItem>
      <FormItem label="附件">
        <Upload ref="upload" action="/api/court/freeFile/uploadFreeFile" :default-file-list="fileList" show-type="path" />
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
import { addQtwVerify } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
import Upload from '@/components/Upload/index.vue'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
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
      detailObj: {},
      options: [
        {
          value: true,
          label: '认可'
        },
        {
          value: false,
          label: '不认可'
        }
      ],
      fileList: [],
      verifyId: '',
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
    show(listId) {
      this.listId = listId
      this.visible = true
    },
    edit(obj) {
      this.detailObj = obj
      this.verifyId = obj.id
      this.fileList = obj.freeFileInfo && obj.freeFileInfo.length > 0 ? obj.freeFileInfo.map((item, index) => {
        return {
          id: item.id,
          uid: item.id,
          name: item.fileName,
          url: item.filePath
        }
      }) : []
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
        if (this.verifyId) {
          params.verifyId = this.verifyId
        } else {
          params.listId = this.listId
        }
        params.freeFileIds = this.$refs.upload.fileList && this.$refs.upload.fileList.length ? this.$refs.upload.fileList.map(item => item.id) : []
        console.log(params)
        this.loading = true
        addQtwVerify(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.detailObj = {}
            this.$emit('done')
            this.verifyId = ''
            this.form.resetFields()
            this.$refs.upload.reset()
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
