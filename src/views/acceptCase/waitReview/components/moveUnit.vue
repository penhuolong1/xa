<template>
  <Modal
    v-model="visible"
    title="转单位调解"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
      <FormItem label="单位">
        <Select
          v-decorator="['unit'] "
          placeholder="请选择"
        >
          <SelectOption v-for="item in unit" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="调解组织">
        <Select
          v-decorator="['organization'] "
          placeholder="请选择"
        >
          <SelectOption v-for="item in organization" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="调解员">
        <Select
          v-decorator="['mediator']"
          placeholder="请选择"
        >
          <SelectOption v-for="item in people" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="调解期限">
        <Input v-decorator="['duration', { rules: [{ required: true,message:'调解期限不能为空'}] }]" type="number" suffix="天内" />
      </FormItem>
      <FormItem label="转单位调解时间">
        <DatePicker
          v-decorator="['mediateTime', { rules: [{ required: true,message:'转单位调解时间不能为空'}] }]"
          type="date"
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <span>注意: 单位/组织/调解员必选一项填写！</span>
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
import { Modal, Form, Select, DatePicker, Input, Button } from 'ant-design-vue'
import { queryMediates, mediationAdd } from '@/api/collectCase'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    Input,
    Button
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      unit: [], // 调解单位
      organization: [], // 调解组织
      people: [] // 调解员
    }
  },
  created () {
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    show () {
      this.visible = true
    },
    onConfirm () {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          lawCaseId: this.selectKey[0].lawCase,
          ...this.form.getFieldsValue()
        }
        if (!params.mediator && !params.organization && !params.unit) {
          this.$message.error('单位/组织/调解员必选一项填写')
          return
        }
        params.duration = Number(params.duration)
        this.loading = true
        mediationAdd(params).then(({ code, msg }) => {
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
    // 获取部分信息
    getInfo () {
      queryMediates().then(({ code, data: { unit, organization, people } }) => {
        if (code === 200) {
          this.unit = unit
          this.organization = organization
          this.people = people
        }
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
