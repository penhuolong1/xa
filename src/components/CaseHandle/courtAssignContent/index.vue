<template>
  <div class="form-wrapper">
    <div class="form-left">
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="menuIndex === index ? 'active':''" @click="menuIndex = index">{{ item.name }}</li>
      </ul>
    </div>
    <div class="form-right">
      <div class="form">
        <span v-if="getIsDeal === 0 || menuIndex === 1">
          <Form1 v-if="menuIndex === 0" ref="form" :label-col="4" :schema="schema" @change="change" />
          <Col v-if="menuIndex !== 1" ref="form1" :span="4" />
          <Col v-if="menuIndex !== 1"><Button type="primary" :loading="loading" @click="submit">保存</Button></Col>
        </span>
        <Empty v-if="getIsDeal !== 0 && menuIndex !== 1" description="已处理" />
      </div>
    </div>
  </div>
</template>

<script>
import Form1 from '@/components/Form'
import { Button, Col, Form, Empty } from 'ant-design-vue'
import { pointCase, assignChildOfCheck, caseClosed } from '@/api/sfAddcase/index.js'
import CollaborateForm from '../collaborateForm.vue'
import { roleTypeMap } from '@/type/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Form1,
    FormItem: Form.Item,
    CollaborateForm,
    Button,
    Empty,
    Col
  },
  props: {

  },
  data() {
    return {
      roleTypeMap,
      menuList: [
        {
          value: 1,
          name: '案件分配'
        }
      ],
      resultState: undefined,
      accept: true,
      menuIndex: 0,
      depId: '',
      doType: 5,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo', 'getIsDeal', 'getUserInfo']),
    schema() {
      return [
        {
          label: '是否接收',
          type: 'radio',
          field: 'doType',
          formOption: { rules: [{ required: true, message: '请选择是否接收' }], initialValue: 5 },
          options: [
            {
              value: 5,
              label: '是'
            },
            {
              value: 4,
              label: '否'
            }
          ]
        },
        {
          label: '调解组织',
          type: 'childUnit',
          field: 'goalDeptId',
          codes: '14',
          formOption: { rules: [{ required: true, message: '请选择调解组织' }] },
          vIf: () => {
            return this.doType === 5 && this.getUserInfo.loginRole.roleKey !== roleTypeMap['调解组织']
          }
        },
        {
          label: '调解员',
          type: 'sfMediator',
          field: 'goalMediatorId',
          formOption: this.getUserInfo.loginRole.roleKey === roleTypeMap['调解组织'] ? { rules: [{ required: true, message: '请选择调解员' }] } : {},
          deptId: this.depId,
          vIf: () => {
            return this.doType === 5
          }
        },
        {
          label: '退回意见',
          type: 'textArea',
          field: 'opinion',
          formOption: {},
          vIf: () => {
            return this.doType === 4
          }
        }
      ]
    }
  },
  created() {
    if (this.getUserInfo.loginRole.roleKey === roleTypeMap['调解组织']) {
      this.depId = this.getUserInfo.user.deptId
    }
  },
  mounted() {

  },
  methods: {
    change(e) {
      if (e.field === 'doType') {
        this.doType = e.value.doType
      }
      if (e.field === 'goalDeptId') {
        this.depId = e.value.goalDeptId
      }
      if (e.field === 'accept') {
        this.accept = e.value.accept
      }
      if (e.field === 'resultState') {
        this.resultState = e.value.resultState
      }
    },
    // 提交
    submit() {
      // 分配案件
      if (this.menuIndex === 0) {
        this.$refs.form.getFieldsValue().then(res => {
          const params = {
          }
          params.doType = res.doType
          params.opinion = res.opinion
          params.goalDeptId = res.goalDeptId
          params.goalMediatorId = res.goalMediatorId
          if (this.getUserInfo.loginRole.roleKey === roleTypeMap['调解组织']) {
            params.goalDeptId = this.depId
          }
          params.sfLawCaseId = this.getSfCaseInfo.id
          delete params.accept
          pointCase(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$refs.form.resetFields()
              // this.depId = ''
              this.$store.dispatch('GetSfCaseInfo')
              this.$store.dispatch('GetHandleOfCase')
              this.$store.dispatch('GetOperateLogOfCase')
            }
          })
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.form-wrapper {
  width: 100%;
  display: flex;
  min-height: 400px;
  border: 1px solid rgba(0,0,0,0.10);
  margin-top: 20px;
  .form-left {
    width: 150px;
    border-right: 1px solid rgba(0,0,0,0.10);
    li {
      line-height: 40px;
      text-align: center;
      color: rgba(0,0,0,0.20);
      font-size: 16px;
      cursor: pointer;
      &.active {
        background-color: #e0f0ff;
        color: @theme-color;
      }
    }
  }
  .form-right {
    flex: 1;
    padding: 30px 20px;
  }
  .form {
    width: 600px;
    margin: 0 auto;
  }
}
</style>
