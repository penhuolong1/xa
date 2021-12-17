<template>
  <Modal
    v-model="visible"
    title="添加排庭时间"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible=false"
  >
    <div class="pop-wrapper">
      <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
        <FormItem label="排庭状态">
          <RadioGroup v-decorator="['state']">
            <Radio :value="0">预排庭</Radio>
            <Radio :value="1">开庭</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排庭时间">
          <DatePicker
            v-decorator="['startTime', { rules: [{ required: true,message:'预约诉前程序时间不能为空'}] }]"
            type="date"
            :show-today="false"
            :show-time="{
              'minute-step': 30,
              'second-step': 60,
              'disabledHours': () => {
                let hours = []
                for (var i = 0; i < 8; i++) {
                  hours.push(i)
                }
                for (var i = 17; i < 24; i++) {
                  hours.push(i)
                }
                return hours
              },
              defaultValue: moment('00:00', 'mm:ss')
            }"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
        <FormItem label="时长">
          <Input v-decorator="['minutes', { rules: [{ required: true,message:'请输入开庭时长' }]}]" type="number" suffix="分钟" />
        </FormItem>
        <FormItem label="开庭地点">
          <Select v-decorator="['tribunalId', { rules: [{ required: true, message:'请选择开庭地点' }]}]" placeholder="请选择开庭地点">
            <SelectOption v-for="item in tribunalList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="承办部门">
          <span>{{ lawCase ? lawCase.departName : '' }}</span>
        </FormItem>
        <FormItem label="审判长">
          <span>{{ lawCase ? lawCase.presidingJudgeName : '' }}</span>
        </FormItem>
        <FormItem label="承办人">
          <span>{{ lawCase ? lawCase.judgeName : '' }}</span>
        </FormItem>
        <FormItem label="书记员">
          <span>{{ lawCase ? lawCase.clerkName : '' }}</span>
        </FormItem>
      </Form>
    </div>
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
import { Modal, Form, Select, Radio, DatePicker, Input, Button } from 'ant-design-vue'
import { listTribunal, editSchedulingInfo } from '@/api/schedule/index.js'
import { queryJudge } from '@/api/addCase/index.js'
import moment from 'moment'

export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    Radio,
    RadioGroup: Radio.Group,
    DatePicker,
    Button,
    Input
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
      judgeList: [], // 工作人员数据
      tribunalList: [], // 调解地点
      litigantList: [], // 当事人列表
      lawCase: {}, // 案件信息
      form: this.$form.createForm(this, { name: 'form' })
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    moment,
    show(obj) {
      this.visible = true
      this.lawCase = obj
      console.log(obj)

      if (obj.startTime) {
        this.title = '修改排庭'
        this.$nextTick(() => {
          this.form.getFieldDecorator('startTime', { initialValue: obj.startTime + ':00' })
          this.form.getFieldDecorator('minutes', { initialValue: obj.duration / 60 })
          this.form.getFieldDecorator('state', { initialValue: obj.state === '预排庭' ? 0 : 1 })
          this.form.getFieldDecorator('tribunalId', { initialValue: obj.tribunalId })
        })
      } else {
        this.title = '修改排庭'
        this.$nextTick(() => {
          this.form.getFieldDecorator('state', { initialValue: 0 })
        })
      }
      this.getData()
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        if (this.lawCase.relationId) {
          params.relationId = this.lawCase.relationId
          params.queryCaseType = 2
        } else {
          params.lawCaseId = this.lawCase.lawCaseId ? this.lawCase.lawCaseId : this.lawCase.caseId
          params.queryCaseType = 1
        }
        this.loading = true
        editSchedulingInfo(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.visible = false
            this.form.resetFields()
            this.$emit('done')
          }
        })
      })
    },
    // 获取数据
    getData() {
      // 获取调解地点
      listTribunal({ type: 1 }).then(({ code, data }) => {
        if (code === 200) {
          this.tribunalList = data
        }
      })
      queryJudge().then(({ code, data }) => {
        if (code === 200) {
          this.judgeList = data
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
