<template>
  <Modal
    v-model="visible"
    title="添加记录"
    class="modal"
    :mask-closable="false"
    @cancel="visible=false"
  >
    <Form v-if="isForm" :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <FormItem label="调解方式">
        <Select
          v-decorator="['preMediateTypeValue',{initialValue:detail.preMediateTypeValue, rules: [{ required: true,message:'请选择调解方式' }]}]"
          placeholder="请选择调解方式"
          @change="getType"
        >
          <SelectOption v-for="item in preMediateTypeList" :key="item.id" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <!-- 电话调解 -->
      <FormItem v-if="type=='电话调解'" label="拨号当事人">
        <Select v-decorator="['callLitigantId',{rules: [{ required: true,message:'请选择拨号当事人' }], initialValue:detail.callLitigantId}]" placeholder="请选择拨号当事人" @change="getLit">
          <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type=='电话调解'" label="外拨">
        <Select v-decorator="['callPhone', {initialValue:detail.callPhone}]" placeholder="请选择">
          <SelectOption :value="9">外线(9)</SelectOption>
          <SelectOption :value="90">外地(90)</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type=='电话调解'" class="call-wrapper" label="电话号码">
        <Select v-decorator="['phone', {initialValue:detail.phone}]" placeholder="请选择">
          <SelectOption v-for="item in phoneList" :key="item.id" :value="item.phone">{{ item.phone }}</SelectOption>
        </Select>
        <a class="call" @click="call()">拨号</a>
      </FormItem>
      <FormItem v-if="type=='电话调解'" class="required" label="呼叫记录">
        <Audio ref="audio" :type="2" />
      </FormItem>
      <FormItem label="参与当事人">
        <Select
          v-decorator="['partIds',{initialValue:detail.partIds,rules: [{ required: true,message:'请选择参与当事人' }]}]"
          mode="multiple"
          placeholder="请选择参与当事人"
        >
          <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="调解/调查时间">
        <DatePicker
          v-decorator="['mediateTime', {initialValue:detail.mediateTime, rules: [{ required: true,message:'请选择调解/调查时间' }] }]"
          type="date"
          show-time
          now
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <FormItem v-if="type!='诉前调查'" label="结果">
        <Select v-decorator="['mediateResult',{initialValue:detail.mediateResult,rules: [{ required: true,message:'请选择结果' }]}]" placeholder="请选择调解方式">
          <SelectOption value="调解成功">调解成功</SelectOption>
          <SelectOption value="调解失败">调解失败</SelectOption>
          <SelectOption value="无结果">无结果</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type==='诉前调查'" label="诉前文书">
        <Select v-decorator="['dipIds',{initialValue:detail.dipIds}]" mode="multiple" placeholder="请选择诉前文书">
          <SelectOption v-for="item in preDipList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="备注">
        <TextArea v-decorator="['remark',{initialValue:detail.remark}]" />
      </FormItem>
      <FormItem v-if="type == '异步调解'" label="附件">
        <Upload
          ref="upload"
          action="/api/court/freeFile/uploadFreeFile"
          show-type="path"
          :default-file-list="fileList"
        />
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
import { Modal, Form, Select, Input, Button, Radio, DatePicker } from 'ant-design-vue'
import { litigantNameByCaseId } from '@/api/schedule/index.js'
import { editRecord, queryLitInfo } from '@/api/addCase/index.js'
import { listPreDipRecord } from '@/api/book/index.js'
import { mapGetters } from 'vuex'
import Audio from '@/components/Audio/index'
import Upload from '@/components/Upload/index.vue'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    TextArea: Input.TextArea,
    Audio,
    Input,
    Upload,
    Button,
    DatePicker
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
      litigantList: [],
      preMediateTypeList: [
        {
          value: '电话调解',
          label: '电话调解'
        },
        {
          value: '现场调解',
          label: '现场调解'
        },
        {
          value: '异步调解',
          label: '异步调解'
        },
        {
          value: '诉前调查',
          label: '诉前调查'
        }
      ],
      type: '',
      isForm: false,
      fileList: [],
      preDipList: [],
      detail: {},
      phoneList: []
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
    show(info) {
      this.isForm = true
      this.visible = true
      this.getData(info)
      this.getListPreDipRecord()
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
        params.lawCaseId = this.getLawCaseId
        params.recordId = this.detail.id
        if (this.$refs?.upload) {
          params.fileIds = this.$refs?.upload.fileList && this.$refs?.upload.fileList.length ? this.$refs.upload.fileList.map(item => item.id) : null
        }
        if (params.preMediateTypeValue === '电话调解') {
          console.log(this.$refs.audio)
          params.recordAddress = this.$refs.audio.url || ''
          if (!params.recordAddress) {
            this.$message.error('请先上传语音文件')
            return
          }
        }
        this.loading = true
        editRecord(params).then(({ code, msg }) => {
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
    getData(info) {
      this.isForm = false
      litigantNameByCaseId({ caseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.isForm = true
          if (!data || data.length === 0) {
            this.litigantList = []
            return
          }
          this.litigantList = data.filter(item => !item.agentFlag)
          if (info && info.id) {
            this.detail.preMediateTypeValue = info.preMediateType
            this.type = info.preMediateType
            this.detail.mediateTime = info.mediateTime
            this.detail.mediateResult = info.mediateResult
            this.detail.remark = info.remark
            this.detail.id = info.id
            this.detail.partIds = info.litigantInfos.map(item => item.id)
            this.fileList = info.fileInfos && info.fileInfos.length > 0 ? info.fileInfos.map(item => {
              item.uid = item.id
              item.url = item.path
              return item
            }) : []
            if (this.detail.preMediateTypeValue === '电话调解') {
              this.detail.callPhone = info.callInfo ? info.callInfo.callPhone : undefined
              this.detail.callLitigantId = info.callInfo ? info.callInfo.callLitigant : undefined
              this.detail.phone = info.callInfo ? info.callInfo.phone : undefined
              if (info.callInfo.recordAddress) {
                this.$nextTick(() => {
                  this.$refs.audio.setData(info.callInfo.recordAddress)
                }, 200)
              }
            }
            if (this.detail.preMediateTypeValue === '诉前调查') {
              this.detail.dipIds = info.dipInfos && info.dipInfos.length > 0 ? info.dipInfos.map(item => {
                return item.id
              }) : []
            }
          } else {
            this.detail = {}
          }
        }
      })
    },
    // 获取当事人
    getLit(e) {
      if (!e) {
        return
      }
      queryLitInfo({ litigantId: e }).then(({ code, data }) => {
        if (code === 200) {
          if (!data.litigantPhones || data.litigantPhones.length === 0) {
            this.phoneList = []
            return
          }
          this.phoneList = data.litigantPhones
        }
      })
    },
    // 获取调解方式
    getType(e) {
      this.type = e
    },
    // 获取诉前文书
    getListPreDipRecord() {
      const params = {
        lawCaseId: this.getLawCaseId,
        pageSize: 1000
      }
      listPreDipRecord(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data.rows || data.rows.length === 0) {
            return
          }
          this.preDipList = data.rows.map(item => {
            return {
              id: item.dipId,
              name: item.dipName
            }
          })
        }
      })
    },
    // 拨打电话
    call() {
      const form = this.form.getFieldsValue()
      if (!form.phone) {
        this.$message.error('请先选择电话号码')
        return
      }
      const phone = form.callPhone + form.phone
      document.getElementById('callFrame').contentWindow.TV_StartDial(0, phone)
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
.call-wrapper {
  position: relative;
  a {
    position: absolute;
    right: -40px;
  }
}
</style>
