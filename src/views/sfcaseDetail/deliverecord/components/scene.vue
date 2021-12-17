<template>
  <div>
    <Modal
      v-model="visible"
      title="现场领取"
      style="width:600px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <FormItem label="受送达人">
          <Select
            v-decorator="['litigantId', { rules: [{ required: true,message:'请选择受送达人' }],initialValue:isEdit?record.litigantName:''}]"
            :disabled="isEdit"
          >
            <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="发送内容" class="required">
          <Button type="primary" :disabled="isEdit" @click="chooseDocument">选择文书</Button>
          <div v-if="record">
            <div v-for="(item,index) in record.sendFileList" :key="item.id" class="file">
              <a class="file-name" @click="preview(item)">{{ item.fileName }}</a>
              <!-- <Icon type="delete" @click="delFile(item,index)" /> -->
            </div>
          </div>
          <div v-if="caseFile">
            <div v-for="(item,index) in caseFile" :key="item.id" class="file">
              <a class="file-name" @click="preview(item)">{{ item.name }}</a>
              <Icon type="delete" @click="delFile(item,index)" />
            </div>
          </div>
        </FormItem>
        <FormItem label="预约时间">
          <DatePicker
            v-decorator="['sendTime', { rules: [{ required: true,message:'请选择发送时间' }],initialValue:isEdit?record.sendTime:'' }]"
            :disabled="isEdit"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem label="回执时间">
          <DatePicker
            v-decorator="['receiptTime', { initialValue:isEdit?record.receiptTime:'' }]"
            placeholder="请选择回执时间"

            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem label="送达回执">
          <Upload
            ref="upload"
            :file-list="fileList"
            :default-file-list="fileList"
            action="/api/sf/file/uploadSfFile"
            @preview="preview"
          />
          <div v-if="isEdit" class="fileDel">
            <div v-for="item in record.materialFileList" :key="item.id" class="file">
              <a class="file-name" @click="preview(item)">{{ item.fileName }}</a>
              <!-- <Icon type="delete" @click="delFile(item,index)" /> -->
            </div>
          </div>
        </FormItem>

        <FormItem label="送达结果">
          <Select
            v-decorator="['result', { rules: [{ required: true,message:'请选择送达结果' }],initialValue:isEdit?record.result:''}]"
            placeholder="请选择送达方式"
            @change="changeResult"
          >
            <SelectOption
              v-for="item in resultList"
              :key="item.value"

              :value="item.value"
            >{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <TextArea v-decorator="['remark']" />
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
    <Document ref="documentShow" @selectedBox="getFile" />
    <Preview ref="preview" :file-list="fileList" />
  </div>
</template>
<script>
import { Modal, Form, Input, Button, Radio, Checkbox, Select, DatePicker, Icon } from 'ant-design-vue'
import { listShortInfo } from '@/api/sfAddcase/index.js'
import { editSend } from '@/api/freeze/index.js'
import { mapGetters } from 'vuex'
import Document from './document.vue'
import Preview from '@/components/Preview/index'
import Upload from '@/components/Upload/index.vue'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Input,
    Button,
    DatePicker,
    RadioGroup: Radio.Group,
    CheckboxGroup: Checkbox.Group,
    Checkbox,
    Select,
    SelectOption: Select.Option,
    Document,
    Icon,
    Preview,
    Upload
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      result: '',
      form: this.$form.createForm(this, { name: 'form' }),
      record: {},
      fileList: [],
      recordFile: [], // 详情返回的文书
      caseFile: [], // 选中的文书
      fileIds: [], // 文书id
      litigantList: [], // 当事人列表
      casefileList: [], // 预览
      sendTypeList: [
        {
          value: '1',
          label: '短信送达'
        },
        {
          value: '2',
          label: '邮件送达'
        },
        {
          value: '3',
          label: '微信送达'
        },
        {
          value: '4',
          label: '现场领取'
        }
      ],
      sendType: '0',
      resultList: [
        {
          value: 0,
          label: '送达中'
        },
        {
          value: 1,
          label: '送达成功'
        },
        {
          value: 2,
          label: '送达失败'
        },
        {
          value: 3,
          label: '未送达'
        }
      ],
      materialFileIdList: []// 回执凭证文书
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
    changeSend(e) {
      this.sendType = e
    },
    changeResult(e) {
      this.result = e
    },
    show(record) {
      this.record = record
      this.visible = true
      const params = {
        sfLawCaseId: this.getSfLawCaseId
      }
      listShortInfo(params).then(({ code, data }) => {
        if (code === 200) {
          this.litigantList = data
        }
      })
    },
    chooseDocument() {
      this.$refs.documentShow.show(this.getSfLawCaseId)
    },
    // 获取选中的文书
    getFile(e) {
      this.caseFile = e
      this.fileIds = []
      this.caseFile.map(item => {
        this.fileIds.push(item.id)
      })
      console.log('选择', this.fileIds)
    },
    // 删除选中的文书
    delFile(item, index) {
      console.log(index)
      if (this.record) {
        this.recordFile = this.record.sendFileList
      }
      this.$confirm({
        title: '是否删除该条文书信息',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          console.log(this.casefileList)
          this.caseFile.splice(index, 1)
          this.fileIds = []
          this.caseFile.map(item => {
            this.fileIds.push(item.id)
          })
          console.log('删除', this.fileIds)
        },
        onCancel() {}
      })
    },
    // 预览
    preview(item) {
      console.log(item)
      console.log(this.fileList)
      this.casefileList = []
      this.$refs.preview.show(item.filePath, this.casefileList)
    },
    onConfirm() {
      // return
      this.materialFileIdList = []
      this.$refs.upload.$data.fileList.map(item => {
        this.materialFileIdList.push(item.data.id)
      })
      console.log(this.materialFileIdList)
      // return
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue(),
          type: 4
        }
        if (this.fileIds && this.fileIds.length != 0) {
          params.fileIds = this.fileIds
        }
        if (this.materialFileIdList && this.materialFileIdList != 0) {
          params.materialFileIdList = this.materialFileIdList
        }
        if (this.isEdit) {
          params.litigantId = this.record.litigantId
          params.id = this.record.id
          params.result = this.result ? this.result : this.record.result
        }
        params.fileIds = []
        if (this.record && this.record.sendFileList && this.record.sendFileList.length > 0) {
          this.record.sendFileList.map(item => {
            params.fileIds.push(item.id)
          })
        }
        if (this.caseFile && this.caseFile.length > 0) {
          this.caseFile.map(item => {
            params.fileIds.push(item.id)
          })
        }

        console.log(params.fileIds)
        editSend(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.form.resetFields()
            this.$emit('refresh')
            this.$refs.upload.reset()
            this.caseFile = []
            setTimeout(() => {
              this.$emit('refresh')
            }, 500)
          }
        })
      })
    }

  }

}
</script>

<style scoped lang="less">
.file{
  width: 300px;
  display: flex;
  align-items: center;
}
.file-name{
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>
