<template>
  <div class="form-wrapper">
    <div class="form-left">
      <ul>
        <li v-for="(item, index) in menuList" :key="index" :class="menuIndex === index ? 'active':''" @click="menuIndex = index">{{ item.name }}</li>
      </ul>
    </div>
    <div class="form-right">
      <div class="form">
        <span v-if="getIsDeal === 0">
          <Form1 v-if="menuIndex === 0" ref="form" :label-col="4" :wrapper-col="16" :brief-name="briefName" :schema="schema" @change="change" />
          <Form1 v-if="menuIndex === 1" ref="form1" :label-col="4" :schema="schema1" @change="change" />
          <Col :span="4" />
          <Col><Button type="primary" :loading="loading" @click="submit">保存</Button></Col>
        </span>
        <Empty v-if="getIsDeal !== 0" description="已办理" />
      </div>
    </div>
  </div>
</template>

<script>
import Form1 from '@/components/Form'
import { Button, Col, Form, Empty } from 'ant-design-vue'
import CaseNo from '@/components/CaseNo'
import { acceptCase, assignChildOfCheck } from '@/api/sfAddcase/index.js'
import { caseType } from '@/type/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Form1,
    FormItem: Form.Item,
    Empty,
    Button,
    Col
  },
  props: {

  },
  data() {
    return {
      menuList: [
        {
          value: 1,
          name: '接收案件'
        },
        {
          value: 2,
          name: '交办下级'
        }
        // {
        //   value: 3,
        //   name: '上报案件'
        // }
      ],
      briefName: '',
      accept: true,
      review: undefined,
      menuIndex: 0,
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
          field: 'accept',
          formOption: { rules: [{ required: true, message: '请选择是否接收' }], initialValue: true },
          options: [
            {
              value: true,
              label: '是'
            },
            {
              value: false,
              label: '否'
            }
          ]
        },
        {
          label: '案件审核',
          type: 'select',
          field: 'review',
          formOption: { rules: [{ required: true, message: '请选择案件审核' }] },
          options: [
            {
              value: 1,
              label: '同意受理'
            },
            {
              value: 2,
              label: '补充材料'
            },
            {
              value: 3,
              label: '不予受理'
            }
          ],
          vIf: () => {
            return this.accept
          }
        },
        {
          type: 'other',
          content: (<FormItem label='案号'>
            <CaseNo typeList={[
              {
                value: '诉非',
                label: '诉非'
              }
            ]} type='3' ref='caseNo' isNeedUnUsedNums={false} inputDisabled={false} class='case-no'></CaseNo>
          </FormItem>),
          vIf: () => {
            return this.accept && this.review === 1
          }
        },
        {
          label: '案由',
          type: 'brief',
          field: 'briefId',
          briefName: this.briefName,
          formOption: { rules: [{ required: true, message: '请选择案由' }], initialValue: this.getSfCaseInfo.brief },
          vIf: () => {
            return this.accept && this.review === 1
          }
        },
        {
          label: '纠纷类型',
          type: 'select',
          field: 'caseType',
          options: caseType,

          formOption: { rules: [{ required: true, message: '请选择纠纷类型' }], initialValue: this.getSfCaseInfo.caseType || undefined },
          vIf: () => {
            return this.accept && this.review === 1 && this.getSfCaseInfo.caseSource === '当事人申请'
          }
        },
        {
          label: this.accept && this.review === 1 ? '审核意见' : '理由',
          formOption: !this.accept ? { rules: [{ required: true, message: '请输入理由' }] } : {},
          type: 'textArea',
          field: 'opinion'
        }
      ]
    },
    schema1() {
      return [
        {
          label: '交办单位',
          type: 'mediates',
          medType: 'unitAndOrg',
          ancestorId: this.getUserInfo.user.deptId,
          field: 'assignDeptId',
          formOption: { rules: [{ required: true, message: '请选择交办单位' }] }
        }
      ]
    }
  },
  created() {

  },
  mounted() {
    if (this.getSfCaseInfo.briefName) {
      this.briefName = this.getSfCaseInfo.briefName
    }
  },
  methods: {
    change(e) {
      if (e.field === 'accept') {
        this.accept = e.value.accept
      }
      if (e.field === 'review') {
        this.review = e.value.review
      }
    },
    // 提交
    submit() {
      // 接收案件
      if (this.menuIndex === 0) {
        this.$refs.form.getFieldsValue().then(res => {
          const params = {
            ...res
          }
          let type = 1
          if (!params.accept) {
            type = 4
          } else {
            type = params.review
          }
          if (type === 1) {
            if (!(this.$refs.caseNo.year && this.$refs.caseNo.num && this.$refs.caseNo.typeLabel)) {
              this.$message.error('请输入完整案号')
              return
            }
            params.year = this.$refs.caseNo.year
            params.number = this.$refs.caseNo.num
            params.caseNo = `(${this.$refs.caseNo.year})${this.$refs.caseNo.typeLabel}${this.$refs.caseNo.num}号`
          }
          params.doType = type
          params.sfLawCaseId = this.getSfCaseInfo.id
          delete params.accept
          delete params.review
          acceptCase(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$refs.form.resetFields()
              this.$emit('done')
              this.$store.dispatch('GetSfCaseInfo')
              this.$store.dispatch('GetOperateLogOfCase')
            }
          })
        })
      }
      // 下发案件
      if (this.menuIndex === 1) {
        this.$refs.form1.getFieldsValue().then(res => {
          const params = {
            ...res
          }
          params.sfLawCaseId = this.getSfCaseInfo.id
          assignChildOfCheck(params).then(({ code, msg }) => {
            this.loading = false
            if (code === 200) {
              this.$message.success(msg)
              this.$refs.form1.resetFields()
              this.$emit('done')
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
