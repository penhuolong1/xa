<template>
  <div>
    <Modal
      v-model="visible"
      title="办理"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="visible=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="handleTeam()">
          确定
        </Button>
      </template>
      <!-- 联动为咨询(type===2)的时候  并且已经接收(handle===1)了的情况下 -->
      <Form v-if="teamType === 2 && handle === 1" :form="form1" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem label="回复内容">
          <TextArea v-decorator="['content', { rules: [{ required: true,message:'请输入回复内容' }] }]" placeholder="回复内容" />
        </FormItem>
      </Form>
      <Form v-else :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem
          label="办理"
        >
          <RadioGroup
            v-decorator="['type', { rules: [{ required: true,message:'请选择' }],initialValue: 1 }]"
            @change="getType"
          >
            <Radio :value="1">接收</Radio>
            <Radio v-if="getUserInfo.loginRole.roleKey !== roleTypeMap['调解员']" :value="3">指派</Radio>
            <Radio :value="2">退回</Radio>
          </RadioGroup>
        </FormItem>
        <SfDepCount
          v-if="type === 3"
          field="orgId"
          :form="form"
          :is-need-parent-id="true"
          :ancestor-id="getUserInfo.user.deptId"
          codes="14"
          label="组织"
          @change="getOrgId"
        />
        <SfMediator
          v-if="type === 3"
          field="mediatorId"
          :form="form"
          :dept-id="depId"
          label="调解员"
        />
        <FormItem v-if="type === 3" label="指派意见">
          <TextArea v-decorator="['opinion']" placeholder="指派意见" />
        </FormItem>
        <FormItem v-if="type === 2" label="退回理由">
          <TextArea v-decorator="['opinion', { rules: [{ required: true,message:'请输入退回理由' }] }]" placeholder="退回理由" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { Button, Modal, Form, Input, Radio } from 'ant-design-vue'
import { roleTypeMap } from '@/type/index.js'
import SfDepCount from '@/components/Common/SfDepCount.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import { handleTeam, replyTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    SfDepCount,
    SfMediator,
    Form,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Radio,
    RadioGroup: Radio.Group,
    Modal,
    Button
  },
  props: {
    people: {
      type: Array,
      default: () => []
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    teamType: { // 1协助调解 2咨询
      type: Number,
      default: 1
    },
    handle: { //  未处理0，1完成 2退回 3下发 4已回复
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      form: this.$form.createForm(this, { name: 'form' }),
      form1: this.$form.createForm(this, { name: 'form1' }),
      type: 1,
      depId: '',
      roleTypeMap,
      ancestorId: '',
      visible: false,
      options: [
        {
          value: 1,
          label: '接收'
        },
        {
          value: 2,
          label: '指派'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getTeamInfo', 'getUserInfo'])
  },
  created() {
    this.depId = this.getUserInfo.user.deptId
    console.log(roleTypeMap['调解员'])
  },
  mounted() {
  },
  methods: {
    show(id) {
      if (!id) {
        if (!this.selectedRows || this.selectedRows.length === 0) {
          this.$message.error('请选择案件')
          return
        }
      } else {
        this.teamId = id
      }
      this.visible = true
    },
    getType(e) {
      const val = e.target.value
      this.type = val
    },
    getOrgId(e) {
      this.depId = e
    },
    handleTeam() {
      if (this.teamType === 2 && this.handle === 1) {
        this.form1.validateFields(err => {
          if (err) {
            return
          }
          const params = {
            ...this.form1.getFieldsValue()
          }
          params.id = this.teamId || this.selectedRows[0].teamId
          replyTeam(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refresh')
              this.form.resetFields()
            }
          })
        })
        return
      }
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          ...this.form.getFieldsValue()
        }
        params.handleType = params.type
        params.id = this.teamId || this.selectedRows[0].teamId
        delete params.type
        handleTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            if (this.teamType === 2) { // 如果是咨询
              this.$emit('acceptCon') // 接收咨询
              this.form.resetFields()
              return
            }
            this.visible = false
            this.$emit('refresh')
            this.form.resetFields()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
