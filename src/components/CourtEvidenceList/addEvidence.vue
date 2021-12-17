<template>
  <Modal
    v-model="visible"
    title="添加记录"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <Litigant
        label="举证人"
        field="litigantId"
        :form-option="{rules: [{ required: true,message:'请选择举证人' }],initialValue: detailObj ? detailObj.litigantId:undefined}"
        placeholder="请选择举证人"
      />
      <FormItem label="证据名称">
        <Input v-decorator="['name', {rules: [{ required: true,message:'请输入证据名称' }], initialValue: detailObj ? detailObj.name:''}]" type="text" placeholder="请输入证据名称" />
      </FormItem>
      <FormItem label="证明对象">
        <Input v-decorator="['eviProve', {rules: [{ required: true,message:'请输入证明对象' }], initialValue: detailObj ? detailObj.eviProve:''}]" type="text" placeholder="请输入证明对象" />
      </FormItem>
      <FormItem label="证据来源">
        <Input v-decorator="['eviSource', {rules: [{ required: true,message:'请输入证据来源' }], initialValue: detailObj ? detailObj.eviSource: ''}]" type="text" placeholder="请输入证据来源" />
      </FormItem>
      <FormItem label="页数">
        <Input v-decorator="['eviPage',{ initialValue:detailObj ? detailObj.eviPage :'' }]" type="number" placeholder="请输入页数" />
      </FormItem>
      <FormItem label="是否有原件">
        <RadioGroup v-decorator="['original', {initialValue: detailObj ? detailObj.original: ''}]" :options="options" />
      </FormItem>
      <FormItem label="附件">
        <Upload ref="upload" :is-edit="isEdit" action="/api/sf/file/uploadSfFile" :default-file-list="defaultFileList" show-type="filePath" />
      </FormItem>
    </Form>
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button v-if="isEdit" type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
  </Modal>
</template>
<script>
import { Modal, Form, Input, Button, Radio } from 'ant-design-vue'
import { saveMaterialInfo } from '@/api/sfAddcase/index.js'
import Litigant from '@/components/Common/Litigant.vue'
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
    Upload,
    Litigant
  },
  props: {
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
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
      defaultFileList: [],
      detailObj: {}
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show(e) {
      this.$nextTick(() => {
        this.detailObj = e
        if (e.fileList && e.fileList.length > 0) {
          this.defaultFileList = e.fileList.map(item => {
            return {
              uid: item.fileId,
              id: item.fileId,
              name: item.fileName,
              url: item.fileUrl
            }
          })
        }
      })
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
        params.fileIds = this.$refs.upload.fileList && this.$refs.upload.fileList.length ? this.$refs.upload.fileList.map(item => item.id) : null
        params.sfLawCase = this.getSfLawCaseId
        params.fileCode = 1
        params.id = this.detailObj?.id
        this.loading = true
        saveMaterialInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
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
