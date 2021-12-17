<template>
  <div>
    <!-- 办理联动 -->
    <Modal
      v-model="ishandle"
      title="办理联动"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="ischange=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="handleConfirm">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="发起人"
        >
          <Select
            v-decorator="[
              'assignedPeople',
            ]"
          >
            <SelectOption v-for="item in people" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          label="发起时间"
        >
          <DatePicker
            v-decorator="[
              'date',
            ]"
          />
        </FormItem>
        <FormItem
          label="联动事由"
        >{{ CreasonFile }}
        </FormItem>
        <FormItem
          label="答复"
        >
          <TextArea v-decorator="['answerContent', ]" />
          <Upload
            ref="upload"
            :default-file-list="fileList"
            action="/api/court/freeFile/uploadFreeFile"
          />

        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, DatePicker, Select } from 'ant-design-vue'
import Upload from '@/components/Upload/index.vue'
import { answerAdd } from '@/api/freeze/index.js'
export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    DatePicker,
    Select,
    SelectOption: Select.Option,
    Upload,
    TextArea: Input.TextArea
  },
  props: {
    people: {
      type: Array,
      default: () => []
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ishandle: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }), // 退回表单
      typeselect: [],
      fileList: [],
      collaborativeCases: [],
      CreasonFile: ''
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    show() {
      this.ishandle = true
      this.CreasonFile = !this.selectedRows[0].CreasonFile ? this.selectedRows[0].reasonDescription : ''
      this.collaborativeCases = []
      this.selectedRows.map(item => {
        this.collaborativeCases.push(item.id)
      })
    },
    handleConfirm() {
      const params = {
        collaborativeCases: this.collaborativeCases,
        answerContent: this.form.getFieldsValue().answerContent ? this.form.getFieldsValue().answerContent : '',
        answerFilePath: this.$refs.upload.fileList[0] ? this.$refs.upload.fileList[0].data.path : ''
      }
      if (params.answerContent === '' && params.answerFilePath === '') {
        this.$message.error('请至少填写一份联动答复')
        return
      }
      answerAdd(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.form.resetFields()
          this.ishandle = false
          this.$emit('refresh')
          this.$refs.upload.reset()
        }
      })
    },
    changetime() {}
  }
}
</script>

<style scoped lang="less">
</style>
