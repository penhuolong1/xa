<template>
  <div>
    <Modal
      v-model="visible"
      title="电子送达"
      style="width:600px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <FormItem label="受送达人">
          <Select
            v-decorator="['litigantId', { rules: [{ required: true,message:'请选择受送达人' }],initialValue:isEdit? record.litigantName:''}]"
            placeholder="请选择受送达人"
            :disabled="isEdit"
            @change="changelitigantId"
          >
            <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="送达方式">
          <Select
            v-decorator="['type', { rules: [{ required: true,message:'请选择送达方式' }],initialValue:isEdit? record.type:''}]"
            placeholder="请选择送达方式"
            :disabled="isEdit"
            @change="changeSend"
          >
            <SelectOption v-for="item in sendTypeList" :key="item.value" :value="item.value">{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="sendType===1||isEdit" label="发送号码">
          <Select
            v-decorator="['goal', { rules: [{ required: true,message:'请选择送达方式' }],initialValue:isEdit? record.goal:''}]"
            :disabled="isEdit"
            placeholder="请选择发送号码"
          >
            <SelectOption v-for="item in phoneList" :key="item" :value="item">{{ item }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="sendType===2" label="电子邮箱">
          <Input
            v-decorator="['goal', { rules: [{ required: true,message:'请输入邮箱号码' }],initialValue:litigantInfo.email}]"
            :disabled="isEdit"
            placeholder="请输入"
          />
        </FormItem>
        <FormItem label="发送内容" class="required">
          <Button type="primary" :disabled="isEdit" @click="chooseDocument">选择文书</Button>
          <div v-if="!isEdit">
            <div v-if="caseFile">
              <div v-for="(item,index) in caseFile" :key="item.id" class="caseFile">
                <a class="file-name" @click="preview(item)">{{ item.name }}</a>
                <Icon type="delete" @click="delFile(item,index)" />
              </div>
            </div>
          </div>
          <div v-if="isEdit" class="fileDel">
            <div>
              <div v-for="(item,index) in recordFile" :key="item.id" class="caseFile">
                <a class="file-name" @click="preview(item)">{{ item.fileName }}</a>
                <!-- <Icon type="delete" @click="delFile(item,index)" /> -->
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="发送时间">
          <DatePicker
            v-decorator="['sendTime', { rules: [{ required: true,message:'请选择发送时间' }],initialValue:isEdit? record.sendTime:'' }]"
            placeholder="请选择"

            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled="isEdit"
          />
        </FormItem>
        <FormItem label="送达结果">
          <Select
            v-decorator="['result',
                          { rules: [{ required: true, message: '请选择联动类型' }], initialValue:isEdit? record.result:''}]"
            placeholder="请选择送达结果"
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
          <TextArea v-decorator="['remark']" placeholder="备注 " />
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
    <Preview ref="preview" :file-list="casefileList" />

  </div>
</template>
<script>
import { Modal, Form, Input, Button, Radio, Checkbox, Select, DatePicker, Icon } from 'ant-design-vue'
import { listShortInfo } from '@/api/sfAddcase/index.js'
import { editSend } from '@/api/freeze/index.js'
import { mapGetters } from 'vuex'
import Document from './document.vue'
import Preview from '@/components/Preview/index'
import { getInfoById } from '@/api/sfAddcase/index.js'
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
    Preview
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
      // isEdit: false,
      form: this.$form.createForm(this, { name: 'form' }),
      phoneList: [],
      recordFile: [], // 记录中的文件
      caseFile: [], // 选中的文书
      fileIds: [], // 文书id
      litigantList: [], // 当事人列表
      casefileList: [], // 预览
      sendTypeList: [
        {
          value: 1,
          label: '短信送达'
        },
        {
          value: 2,
          label: '邮件送达'
        },
        {
          value: 3,
          label: '微信送达'
        }
      ],
      sendType: 0,
      goalChoose: '', // 手机号码/邮件送达,
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
      litigantId: '',
      disabled: false,
      result: '',
      record: {},
      litigantInfo: {}, // 当事人信息
      recordStatues: {
        '短信送达': 1,
        '邮件送达': 2,
        '小程序送达': 3,
        '现场领取': 4
      }
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
    changelitigantId(e) {
      console.log(e)
      this.litigantId = e
      getInfoById({ sfLitigantId: e }).then(({ code, data }) => {
        if (code === 200) {
          data.phoneList.map(item => {
            this.phoneList = []
            this.phoneList.push(item.phone)
          })
          this.litigantInfo = data
        }
      })
    },
    show(record) {
      console.log(this.isEdit)
      console.log(record)
      if (record) {
        this.recordFile = record.sendFileList
      }
      this.record = record
      this.visible = true
      listShortInfo({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
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
      console.log(this.fileIds)
    },
    // 删除选中的文书
    delFile(item, index) {
      console.log(item)
      this.$confirm({
        title: '是否删除该条文书信息',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.caseFile.splice(index, 1)
          this.fileIds = []
          this.caseFile.map(item => {
            this.fileIds.push(item.id)
          })
          console.log(this.fileIds)
        },
        onCancel() {}
      })
    },
    // delFile(item, index) {
    //   console.log(index)
    //   if (this.record) {
    //     this.recordFile = this.record.sendFileList
    //   }
    //   // 发送内容文书
    //   this.$confirm({
    //     title: '是否删除该条文书信息',
    //     okText: '确定',
    //     cancelText: '取消',
    //     onOk: () => {
    //       this.caseFile.splice(index, 1)
    //       this.fileIds = []
    //       this.caseFile.map(item => {
    //         this.fileIds.push(item.id)
    //       })
    //       console.log(this.caseFile)
    //     },
    //     onCancel() {}
    //   })
    // },
    // 预览
    preview(item) {
      console.log(item)
      this.casefileList = []
      this.$refs.preview.show(item.filePath, this.casefileList)
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        this.loading = true
        const params = {
          ...this.form.getFieldsValue(),
          fileIds: []
        }
        params.litigantId = this.litigantId
        console.log(this.caseFile)
        if (!this.isEdit) {
          if (this.caseFile && this.caseFile.length > 0) {
            this.caseFile.map(item => {
              params.fileIds.push(item.id)
            })
          }
        }

        if (this.isEdit) {
          params.litigantId = this.record.litigantId

          params.id = this.record.id
          params.result = this.result ? this.result : this.record.result
          // params.type = this.recordStatues[this.record.type]
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
        }
        editSend(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.visible = false
            this.form.resetFields()
            setTimeout(() => {
              this.$emit('refresh')
            }, 500)
            this.$message.success(msg)
            this.caseFile = []
            params.fileIds = []
          }
        })
      })
    }

  }

}
</script>

<style scoped lang="less">
.caseFile{
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/.anticon{
    margin-left:10px ;
  }
}
.file-name {
  display: block;
  #ellipsis();
}
</style>
