<template>
  <div>
    <Modal
      v-model="isapplication"
      title="申请联动"
      :mask-closable="false"
      style="width:600px"
    >
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem label="是否本院调解">
          <RadioGroup v-decorator="['orCadre', { rules: [{ required: true,message:'请选择是否本院联动' }], initialValue: false }]" :options="options" @change="getOrCadre" />
        </FormItem>
        <Judge v-if="orCadre" field="judgeId" label="联动员" :form-option="{ rules: [{ required: true,message:'请选择联动人员' }]}" />
        <SfDepCount
          v-if="!orCadre"
          field="unitId"
          codes="11,12,13"
          label="联动单位"
          @change="getUnitId"
        />
        <SfDepCount
          v-if="!orCadre"
          field="orgId"
          :form="form"
          :is-need-parent-id="true"
          :ancestor-id="ancestorId"
          codes="14"
          label="联动组织"
          @change="getOrgId"
        />

        <SfMediator
          v-if="!orCadre"
          field="mediatorId"
          :form="form"
          :dept-id="depId"
          label="联动员"
          @change="getMedId"
        />
        <FormItem label="联动类型">
          <Select
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '请选择联动类型' }]},
            ]"
            @change="getType"
          >
            <SelectOption :value="1">协助调解</SelectOption>
            <SelectOption :value="2">咨询</SelectOption>
          </Select>
        </FormItem>
        <FormItem v-if="type === 2" label="完成天数">
          <Input
            v-model="days"
            type="number"
            suffix="天"
          />
        </FormItem>
        <FormItem label="联动事由">
          <TextArea
            v-decorator="[
              'reason',
              { rules: [{ required: true, message: '请输入联动事由' }]},
            ]"
          />
        </FormItem>
        <FormItem label="通知内容">
          <TextArea
            v-decorator="[
              'notificationMessage',
              { initialValue:notificationMessage},
            ]"
            disabled
          />
        </FormItem>
      </Form>
      <span class="notify">注意：单位/组织/联动员必选一样填写</span>
      <template slot="footer">
        <Button key="back" @click="isapplication=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="submit">
          确定
        </Button>
      </template>
    </Modal>
  </div>
</template>
<script>
import { Button, Col, Form, Select, Input, Radio, Modal } from 'ant-design-vue'
import { pointCase, addTeam, updateTeam } from '@/api/sfAddcase/index.js'
import { collaborativeMessage } from '@/api/freeze/index.js'
import SfDepCount from '@/components/Common/SfDepCount.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import Judge from '@/components/Common/Judge.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Form,
    FormItem: Form.Item,
    Button,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Col,
    Modal,
    Judge,
    SfMediator,
    Input,
    TextArea: Input.TextArea,
    Select,
    SelectOption: Select.Option,
    SfDepCount
  },
  props: {
    isNeedAddBtn: { // 是否需要新增按钮
      type: Boolean,
      default: true
    },
    id: { // 联动id
      type: String,
      default: ''
    }
  },
  data() {
    return {
      resultState: undefined,
      isapplication: false,
      list: [{
        unitId: undefined,
        orgId: undefined,
        mediatorId: undefined,
        type: undefined,
        days: '',
        reason: ''
      }
      ],
      num: 1,
      days: null,
      nowIndex: 0,
      options: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      schema1: [
        {
          label: '办结理由',
          type: 'select',
          field: 'resultState',
          formOption: { rules: [{ required: true, message: '请选择办结理由' }] },
          options: [
            {
              value: 2,
              label: '当事人撤回调解请求'
            },
            {
              value: 99,
              label: '其他'
            }
          ]
        },
        {
          label: '理由',
          type: 'textArea',
          field: 'opinion',
          formOption: { rules: [{ required: true, message: '请输入理由' }] },
          vIf: () => {
            return this.resultState === 99
          }
        }
      ],
      form: this.$form.createForm(this, { name: 'form' }),
      ancestorId: '',
      isMediator: false,
      notificationMessage: '', // 短信模板
      accept: true,
      menuIndex: 0,
      orCadre: false, // 是否本院调解
      type: undefined,
      depId: '',
      idList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo'])
  },

  watch: {
    days(newVal) {
      console.log(this.form.getFieldsValue().mediatorId)
      this.getMessage(newVal)
      return newVal
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    changeDays(e) { console.log(e) },
    show(ids) {
      console.log(ids)
      this.idList = ids
      this.isapplication = true
    },
    getType(e) {
      this.type = e
    },
    getUnitId(e) {
      this.ancestorId = e
      this.getMessage(this.days)
    },
    getOrgId(e) {
      this.depId = e
      this.getMessage(this.days)
    },
    getMedId(e) {
      console.log(e)
      if (e) {
        this.isMediator = true
      } else {
        this.isMediator = false
      }
      this.getMessage(this.days)
    },
    // 获取是否本院调解
    getOrCadre(e) {
      this.orCadre = e.target.value
    },
    // 申请联动
    submit() {
      // 分配案件
      this.form.validateFields(err => {
        if (err) {
          this.$message.error('请先完善当前信息')
          return
        }
        const obj = { ...this.form.getFieldsValue() }
        if (!obj.orCadre) {
          if (!obj.mediatorId && !obj.orgId && !obj.unitId) {
            this.$message.error('联动单位、联动组织、联动员至少选择一个')
            return
          }
        }
        obj.sfLawCaseId = this.idList[0].lawCaseBean ? this.idList[0].lawCaseBean.id : this.idList[0].id
        obj.days = this.days
        const params = [obj]
        addTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.form.resetFields()
            this.$emit('done')
            this.isapplication = false
          }
        })
      })
    },
    // 获取短信模板
    getMessage(days) {
      const type = this.isMediator ? 'mediator' : 'dept'
      collaborativeMessage(this.idList[0].lawCaseBean.id, type, { mediateDuration: days || null }).then(({ code, msg }) => {
        if (code === 200) {
          this.notificationMessage = msg
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.notify{
  margin-left:25%
}
</style>
