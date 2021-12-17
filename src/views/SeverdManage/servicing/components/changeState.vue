<template>
  <div>
    <Modal
      v-model="istransfer"
      :title="title"
      :mask-closable="false"
      width="500px"
    >
      <template slot="footer">
        <Button key="back" @click="istransfer=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="onConfrim">
          确定
        </Button>
      </template>
      <div class="label">当前操作该案件的{{ label1 }}状态</div>
      <Form :form="form" :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
        <FormItem :label="label">
          <RadioGroup v-decorator="['schedule',{ rules: [{ required: true,message:'请选择' }],initialValue: defaultValue }] ">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { updateCaseSchedule } from '@/api/freeze/index.js'
import { Modal, Form, Radio, Button } from 'ant-design-vue'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Radio,
    RadioGroup: Radio.Group,
    Button
  },

  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      istransfer: false,
      label: '该案件是否可排期/排庭',
      label1: '可排期/排庭',
      title: '修改可排期/排庭状态',
      defaultValue: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      if (this.type === 1) {
        this.title = '修改可排期状态'
        this.label = '该案件是否可排期'
        this.label1 = '可排期'
      } else if (this.type === 2) {
        this.title = '修改可排庭状态'
        this.label = '该案件是否可排庭'
        this.label1 = '可排庭'
      } else {
        this.title = '修改可排期/排庭状态'
        this.label = '该案件是否可排期/排庭'
        this.label1 = '可排期/排庭'
      }
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.error('请先选择案件')
        return
      }
      this.istransfer = true
    },
    onConfrim() {
      const params = {
        ...this.form.getFieldsValue(),
        caseId: this.selectedRows[0].caseId,
        type: this.type
      }
      updateCaseSchedule(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.istransfer = false
          this.$emit('refresh')
          this.defaultValue = true
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.label {
  position: relative;
  left: 10px;
}
</style>
