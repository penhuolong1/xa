<template>
  <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
    <FormItem label="发起者">
      <Input />
    </FormItem>
    <FormItem label="发起时间">
      <DatePicker
        v-decorator="[
          'date',
          { rules: [{ required: false, message: '请选择调解时间' }] },
        ]"
        :show-time="{ format: 'HH:mm' }"
      />
    </FormItem>
    <FormItem label="答复">
      <TextArea
        v-decorator="[
          'answer',
          { rules: [{ required: true, message: '请输入答复内容' }] },
        ]"
        :show-time="{ format: 'HH:mm' }"
      />
      <Upload :data="param" :file-list="defaultFileList" :default-file-list="defaultFileList" action="/api/court/evidence/uploadProof.jhtml" />

    </FormItem>
  </Form>
</template>
<script>
import { Form, Input, DatePicker } from 'ant-design-vue'
import Upload from '@/components/Upload/index.vue'

export default {
  components: {
    Form,
    FormItem: Form.Item,
    Input,
    TextArea: Input.TextArea,
    DatePicker,
    Upload

  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    litigants: {
      type: Array,
      default: () => []
    },
    param: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultFileList: [],
      litigant: ''

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
</style>
