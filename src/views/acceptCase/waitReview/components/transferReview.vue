<template>
  <Modal
    v-model="visible"
    title="移交审查"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
      <!-- <FormItem label="移交给">
        <Select
          v-decorator="['judgeId', { rules: [{ required: true,message:'移交人员不能为空'}] }] "
          placeholder="请选择"
        >
          <SelectOption v-for="item in judgeList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem> -->
      <Judge
        form
        label="移交给"
        field="judgeId"
        :type="6"
        :form-option="{rules: [{ required: true,message:'移交人员不能为空'}]}"
        placeholder="请选择"
      />
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
import { Modal, Form, Select, Button } from 'ant-design-vue'
import { transferCase } from '@/api/collectCase'
import { queryJudge } from '@/api/addCase/index'
import Judge from '@/components/Common/Judge.vue'
export default {
  components: {
    Modal,
    Form,
    Judge,
    FormItem: Form.Item,
    Button,
    Select,
    SelectOption: Select.Option
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      judgeList: [], // 法官列表
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  created() {
    this.getData()
  },
  mounted() {
  },
  methods: {
    show() {
      this.visible = true
    },
    // 获取相关数据
    getData() {
      queryJudge().then(({ code, data }) => {
        if (code === 200) {
          this.judgeList = data
        }
      })
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          preCaseId: this.selectKey[0].id,
          ...this.form.getFieldsValue()
        }
        this.loading = true
        transferCase(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.form.resetFields()
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
