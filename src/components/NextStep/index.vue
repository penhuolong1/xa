<template>
  <Modal
    v-model="visible"
    title="转到下一流程"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="cancel"
  >
    <Form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }">
      <FormItem label="下一流程">
        <Select v-decorator="['process', { rules: [{ required: true,message:'请选择是否送达' }] }]" @change="changeNextType">
          <SelectOption v-for="(item, index) in nextList" :key="index" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <!-- 送达中待指派 -->
      <FormItem v-if="nextType == 1" label="送达开始时间">
        <DatePicker
          v-decorator="['startSendTime', { rules: [{ required: true,message:'请选择送达开始时间' }] ,initialValue:nowTime}]"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <!-- 诉前程序 -->
      <div v-if="nextType == 2">
        <FormItem label="送达情况">
          <Select v-decorator="['preSendState', { rules: [{ required: true, message:'请选择送达情况' }] }]">
            <SelectOption v-for="(item, index) in sendResultList" :key="index" :value="item.value">{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="地点">
          <Select v-decorator="['tribunalId', { rules: [{ required: true, message:'请选择地点' }] }]">
            <SelectOption v-for="(item, index) in tribunaList" :key="index" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="预约诉前程序时间">
          <DatePicker
            v-decorator="['schedulingTime', { rules: [{ required: true,message:'请选择预约诉前程序时间'}] }]"
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
        <FormItem label="送达完成时间">
          <DatePicker
            v-decorator="['preSendSuccessTime', { rules: [{ required: true,message:'请选择预送达完成时间' }] }]"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
      </div>
      <!-- 待正式立案 -->
      <FormItem v-if="nextType == 3" label="处理情况">
        <Select v-decorator="['preCloseType', { rules: [{ required: true,message:'请选择处理情况' }] }]">
          <SelectOption v-for="(item, index) in dealResultList" :key="index" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="nextType == 3 || nextType == 4" label="诉前结案时间">
        <DatePicker
          v-decorator="['preCloseDate', { rules: [{ required: true,message:'请选择诉前结案时间' }] }]"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <!-- 正式结案 -->
      <FormItem v-if="nextType == 7" label="处理情况">
        <Select v-decorator="['closeType', { rules: [{ required: true,message:'请选择处理情况' }] }]">
          <SelectOption v-for="(item, index) in closeTypeList" :key="index" :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="nextType == 7" label="结案时间">
        <DatePicker
          v-decorator="['closeDate', { rules: [{ required: true,message:'请选择诉结案时间' }] }]"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </FormItem>
      <FormItem label="备注">
        <TextArea v-decorator="['remark']" />
      </FormItem>
    </Form>
    <template slot="footer">
      <Button @click="cancel">
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
import { queryMediates, mediationAdd, nextProcess } from '@/api/collectCase'
import { listTribunal } from '@/api/schedule/index'
import { allCaseNext } from '@/api/freeze/index.js'
import moment from 'moment'
const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option,
    DatePicker,
    Input,
    TextArea: Input.TextArea,
    Button
  },
  props: {
    selectKey: {
      type: Array,
      default: () => []
    },
    nextList: {
      type: Array,
      default: () => {
        return [
          {
            value: 1,
            label: '送达中待指派'
          },
          {
            value: 2,
            label: '诉前程序'
          },
          {
            value: 3,
            label: '待正式立案'
          },
          {
            value: 4,
            label: '诉前销案'
          },
          {
            value: 5,
            label: '不予受理'
          },
          { // 诉前结案
            value: 6,
            label: '结案'
          },
          { // 正式案件结案
            value: 7,
            label: '结案'
          }
        ]
      }
    },
    isWhole: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowTime,
      visible: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      sendResultList: [ // 送达情况
        {
          value: '诉前送达成功-适宜调解',
          label: '诉前送达成功-适宜调解'
        },
        {
          value: '诉前送达不成功-不适宜调解',
          label: '诉前送达不成功-不适宜调解'
        },
        {
          value: '送达失败',
          label: '送达失败'
        },
        {
          value: '电话送达成功-适宜调解',
          label: '电话送达成功-适宜调解'
        },
        {
          value: '现场送达成功',
          label: '现场送达成功'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      dealResultList: [ // 处理情况
        {
          value: '移送',
          label: '移送'
        },
        {
          value: '调解',
          label: '调解'
        },
        {
          value: '撤诉',
          label: '撤诉'
        }
        // {
        //   value: '其他',
        //   label: '其他'
        // }
      ],
      closeTypeList: [ // 处理情况
        {
          value: '判决',
          label: '判决'
        },
        {
          value: '调解',
          label: '调解'
        },
        {
          value: '撤诉',
          label: '撤诉'
        }
      ],
      nextType: null, // 下一流程
      lawCases: []
    }
  },
  created() {
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    moment,
    show() {
      this.visible = true
      if (this.isWhole) {
        this.lawCases = []
        this.selectKey.map(item => {
          this.lawCases.push(item.caseId)
        })
      }
    },
    cancel() {
      this.visible = false
      this.$emit('cancel')
    },
    // 选择下一流程触发
    changeNextType(e) {
      console.log(e)
      this.nextType = e
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          lawCaseId: this.selectKey[0].lawCaseId,
          ...this.form.getFieldsValue()
        }
        params.process = this.nextList.find(item => item.value === params.process).label
        this.loading = true
        if (!this.isWhole) {
          nextProcess(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done', params)
              this.form.resetFields()
              this.visible = false
            }
          })
        } else {
          params.lawCases = this.lawCases
          delete params.lawCaseId
          allCaseNext(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done', params)
              this.form.resetFields()
              this.visible = false
            }
          })
        }
      })
    },
    // 获取部分信息
    getInfo() {
      queryMediates().then(({ code, data: { unit, organization, people }}) => {
        if (code === 200) {
          this.unit = unit
          this.organization = organization
          this.people = people
        }
      })
      listTribunal({ type: 2 }).then(({ code, data }) => {
        if (code === 200) {
          this.tribunaList = data
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
