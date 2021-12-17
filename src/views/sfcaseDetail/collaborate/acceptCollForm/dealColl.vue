<template>
  <div>
    <span v-if="getTeamInfo.handle === 0 || getTeamInfo.handle === 1">
      <Form v-if="getTeamInfo.type === 2 && getTeamInfo.handle === 1" :form="form1" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem label="回复内容">
          <TextArea v-decorator="['content', { rules: [{ required: true,message:'请输入回复内容' }] }]" placeholder="回复内容" />
        </FormItem>
      </Form>
      <Form v-else :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <div v-if="getUserInfo.loginRole.roleKey === roleTypeMap['调解员']" style="margin-top: 50px;">
          <Col :span="6" />
          <Col>
            <div class="mb-5">是否接收本次发起的协助调解事项?</div>
          </Col>
        </div>
        <FormItem
          label="办理"
        >
          <RadioGroup
            v-decorator="['type', { rules: [{ required: true,message:'请选择' }],initialValue: 1 }]"
            @change="getType"
          >
            <Radio :value="1">接收</Radio>
            <Radio v-if="getUserInfo.loginRole.roleKey !== roleTypeMap['调解员']" :value="2">指派</Radio>
          </RadioGroup>
        </FormItem>
        <SfDepCount
          v-if="type === 2 && getUserInfo.loginRole.roleKey === roleTypeMap['调解单位']"
          field="orgId"
          :form="form"
          :is-need-parent-id="true"
          :ancestor-id="getUserInfo.user.deptId"
          codes="14"
          label="组织"
          @change="getOrgId"
        />
        <SfMediator
          v-if="type === 2"
          field="mediatorId"
          :form="form"
          :dept-id="depId"
          label="调解员"
        />
        <FormItem v-if="type === 2" label="指派意见">
          <TextArea v-decorator="['opinion']" placeholder="指派意见" />
        </FormItem>
      </Form>
      <Col :span="6" />
      <Button type="primary" :loading="loading" @click="handleTeam">
        确认
      </Button>
    </span>
    <Empty v-else description="已处理" />
  </div>
</template>

<script>
import { Button, Col, Form, Radio, Input, Empty } from 'ant-design-vue'
import SfDepCount from '@/components/Common/SfDepCount.vue'
import SfMediator from '@/components/Common/SfMediator.vue'
import { roleTypeMap } from '@/type/index.js'
import { handleTeam, replyTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Form,
    SfDepCount,
    SfMediator,
    FormItem: Form.Item,
    TextArea: Input.TextArea,
    Radio,
    Empty,
    RadioGroup: Radio.Group,
    Col
  },
  props: {

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
    console.log(this.getTeamInfo)
    this.depId = this.getUserInfo.user.deptId
  },
  mounted() {

  },
  methods: {
    getType(e) {
      const val = e.target.value
      this.type = val
    },
    getOrgId(e) {
      this.depId = e
    },
    handleTeam() {
      if (this.getTeamInfo.handle === 1) {
        this.form1.validateFields(err => {
          if (err) {
            return
          }
          const params = {
            ...this.form1.getFieldsValue()
          }
          params.id = this.getTeamInfo.id
          replyTeam(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$store.dispatch('GetListTeamInfo')
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
        params.handleType = params.type === 2 ? 3 : 1
        params.id = this.getTeamInfo.id
        delete params.type
        handleTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.$store.dispatch('GetListTeamInfo')
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  text-align: center;
  padding-top: 50px;
}
</style>
