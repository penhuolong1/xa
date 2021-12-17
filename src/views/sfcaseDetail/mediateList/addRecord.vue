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
          v-decorator="['type',{initialValue:detail.type, rules: [{ required: true,message:'请选择调解方式' }]}]"
          placeholder="请选择调解方式"
          :disabled="!!detail.type"
          @change="getType"
        >
          <SelectOption v-for="item in preMediateTypeList" :key="item.id" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <!-- 电话调解 -->
      <FormItem v-if="type==1" label="拨号当事人">
        <Select
          v-model="litigantId"
          placeholder="请选择拨号当事人"
        >
          <SelectOption v-for="item in litigantList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type==1" label="外拨">
        <Select v-model="telephoneType" placeholder="请选择">
          <SelectOption :value="9">外线(9)</SelectOption>
          <SelectOption :value="90">外地(90)</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type==1" label="电话号码">
        <Select v-decorator="['phone']" placeholder="请选择">
          <SelectOption v-for="item in preMediateTypeList" :key="item.id" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="type==1" label="呼叫记录" />
      <FormItem label="参与当事人">
        <Select
          v-decorator="['litigantIds',{initialValue:detail.partIds,rules: [{ required: true,message:'请选择参与当事人' }]}]"
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
      <FormItem label="结果">
        <Select v-decorator="['resultType',{initialValue:detail.mediateResult,rules: [{ required: true,message:'请选择结果' }]}]" placeholder="请选择调解方式">
          <SelectOption :value="1">调解成功</SelectOption>
          <SelectOption :value="2">调解失败</SelectOption>
          <SelectOption :value="0">无结果</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="备注">
        <TextArea v-decorator="['remark',{initialValue:detail.remark}]" />
      </FormItem>
      <FormItem v-if="type == 3" label="附件">
        <Upload
          ref="upload"
          action="/api/sf/file/uploadSfFile"
          show-type="filePath"
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
import { editRecord, listShortInfo } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
import Upload from '@/components/Upload/index.vue'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    TextArea: Input.TextArea,
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
      telephoneType: undefined,
      litigantId: undefined,
      phone: '',
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
        // {
        //   value: '1',
        //   label: '电话调解'
        // },
        {
          value: '2',
          label: '现场调解'
        },
        {
          value: '3',
          label: '异步调解'
        }
      ],
      type: '',
      isForm: true,
      fileList: [],
      detail: {}
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
    show(info) {
      this.visible = true
      this.getData(info)
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
        params.lawCase = this.getSfLawCaseId
        params.id = this.detail.id
        if (this.type == 3) {
          params.materialIds = this.$refs?.upload.fileList && this.$refs?.upload.fileList.length ? this.$refs.upload.fileList.map(item => item.id) : null
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
      listShortInfo({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            this.litigantList = []
            this.isForm = true
            return
          }
          this.litigantList = data.filter(item => !item.agentFlag)
          if (info && info.id) {
            this.detail.type = this.preMediateTypeList.find(item => item.label == info.type).value
            this.type = this.detail.type
            this.detail.mediateTime = info.mediateTime
            this.detail.mediateResult = info.mediateResult
            this.detail.remark = info.remark
            this.detail.id = info.id
            this.detail.partIds = info.litigantInfo && info.litigantInfo.length > 0 ? info.litigantInfo.map(item => item.id) : []
            this.fileList = info.materialFiles && info.materialFiles.length > 0 ? info.materialFiles.map(item => {
              item.uid = item.id
              item.url = item.path
              return item
            }) : []
          } else {
            this.detail = {}
          }
          this.isForm = true
        }
      })
    },
    // 获取调解方式
    getType(e) {
      this.type = e
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
