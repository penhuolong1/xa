<template>
  <div>
    <Description
      ref="description1"
      class="enter-X"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
      title="案件详情"
      @change="change"
    />
    <Description
      ref="description2"
      class="enter-X mt-5"
      :schema="schema1"
      :detail-data="detailData1"
      :is-edit="true"
      :rules="rules1"
      :is-skeleton="isSkeleton"
      title="案件分配"
    />
    <Description
      ref="description3"
      class="enter-X mt-5"
      :schema="schema2"
      :detail-data="detailData2"
      :is-edit="true"
      :rules="rules2"
      :is-skeleton="isSkeleton"
      title="其他要素"
    />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { Button } from 'ant-design-vue'
import { caseCategory, caseType, caseSource, litigationScene } from '@/type/index.js'
import { schema2 } from './schema'
import { addOrUpdateCase, queryById, queryDepartment } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Description,
    Button
  },
  props: {

  },
  data() {
    return {
      caseNo: '',
      schema: [ // 案件详情数据
        {
          field: 'caseNo',
          label: '案号',
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'filingDate',
          label: '立案日期',
          type: 'date',
          required: true,
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'preCaseNo',
          label: '预案号'
        },
        {
          field: 'plaintDate',
          label: '收到诉状日期',
          type: 'date',
          required: true
        },
        {
          field: 'preFilingDate',
          label: '预立案日期',
          type: 'date',
          required: this.caseNo
        },
        {
          field: 'caseType',
          label: '案件类型',
          type: 'select',
          options: caseType
        },
        {
          field: 'caseCategory',
          label: '新案件类别',
          type: 'select',
          required: true,
          options: caseCategory
        },
        {
          field: 'caseSource',
          label: '新案件来源',
          type: 'select',
          options: caseSource
        },
        {
          field: 'brief',
          label: '立案案由',
          type: 'brief',
          showSearch: true,
          required: true
        },
        {
          field: 'subjectAmount',
          label: '起诉标的金额',
          type: 'input'
        },
        {
          field: 'costs',
          label: '诉讼费缴交金额',
          type: 'input'
        },
        {
          field: 'preservation',
          label: '诉讼保全',
          type: 'radio',
          disabled: true,
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
          field: 'canSendDate',
          label: '可启用送达日期',
          hidden: true,
          type: 'date',
          required: false,
          disabled: true
        },
        {
          field: 'judicialExpertise',
          label: '司法鉴定',
          type: 'radio',
          disabled: true,
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
          field: 'applicableProcedures',
          label: '适用程序',
          type: 'radio',
          options: [
            {
              value: '小额案件',
              label: '小额案件'
            },
            {
              value: '简易程序',
              label: '简易程序'
            },
            {
              value: '普通程序',
              label: '普通程序'
            }
          ]
        },
        {
          field: 'preMediate',
          label: '诉前调解',
          type: 'radio',
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
          label: '',
          vIf: () => {
            return !this.caseNo
          }
        },
        {
          field: 'litigationScene',
          label: '诉讼场景',
          type: 'select',
          options: litigationScene
        },
        {
          field: 'jurisdictionBasis',
          label: '管辖依据',
          type: 'select'
        },
        {
          label: '',
          vIf: () => {
            return !this.caseNo
          }
        },
        {
          field: 'claim',
          label: '诉讼请求',
          span: 3,
          type: 'textArea'
        },
        {
          field: 'factReason',
          label: ' 事实与理由',
          span: 3,
          type: 'textArea'
        }
      ],
      schema1: [ // 案件分配
        {
          field: 'receiveDepartmentId',
          label: '收案部门',
          type: 'select',
          type1: 'department'
        },
        {
          field: 'receivePeopleId',
          label: '收案登记人',
          type: 'judge',
          userType: 7
        },
        {
          field: 'registerDepartmentId',
          label: '立案部门',
          type: 'select',
          type1: 'department',
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'takingDepartmentId',
          label: '承办部门',
          type: 'select',
          type1: 'department',
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'tribunal',
          label: '承办法庭',
          type: 'input',
          disabled: true,
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'judgeId',
          label: '承办人',
          type: 'judge',
          userType: 1,
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'presidingJudgeId',
          label: '审判长',
          type: 'judge',
          userType: 11,
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'approvedPeopleId',
          label: '预立案审批人',
          type: 'judge',
          userType: 6,
          required: false,
          vIf: () => {
            return !this.caseNo
          }
        },
        {
          field: 'clerkId',
          label: '书记员',
          type: 'judge',
          userType: 2,
          required: false,
          vIf: () => {
            return this.caseNo
          }
        },
        {
          field: 'assistantJudgeId',
          label: '法官助理',
          type: 'judge',
          userType: 3,
          required: false
        },
        {
          field: 'recorderId',
          label: '速录员',
          type: 'judge',
          userType: 5,
          vIf: () => {
            return !this.caseNo
          }
        },
        {
          field: 'courtSend',
          label: '是否本院送达',
          type: 'radio',
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
          field: 'sendDepartmentId',
          label: '案件送达部门',
          type: 'select',
          type1: 'department'
        },
        {
          field: 'postalSender',
          label: '邮政送达员',
          type: 'input',
          disabled: true
        },
        {
          field: 'notarySender',
          label: '公证送达员',
          type: 'input',
          disabled: true
        }
      ],
      schema2: schema2,
      detailData: {
        preservation: false,
        judicialExpertise: false
      },
      detailData1: {

      },
      detailData2: {

      },
      rules: {
        plaintDate: [
          {
            type: 'required',
            msg: '收到诉状日期不能为空'
          }
        ],
        // preFilingDate: [
        //   {
        //     type: 'required',
        //     msg: '预立案日期不能为空'
        //   }
        // ],
        caseCategory: [
          {
            type: 'required',
            msg: '新案件类别不能为空'
          }
        ],
        brief: [
          {
            type: 'required',
            msg: '立案案由不能为空'
          }
        ]
        // 'phone': [
        //   {
        //     type: 'required',
        //     msg: '手机号不能为空'
        //   },
        //   {
        //     type: 'phone',
        //     msg: '手机号码格式不正确'
        //   }
        // ]
      },
      rules1: {
      },
      rules2: {
      },
      isSkeleton: false,
      lawCaseId: ''
    }
  },
  //
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    async init() {
      this.isSkeleton = true
      await queryDepartment().then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          const list = data.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.schema1.forEach((item, index) => {
            if (item.type1 === 'department') {
              item.options = list
            }
          })
        }
      })
      await this.getCaseDetail()
      this.isSkeleton = false
    },
    submit() {
      const obj = this.$refs.description1.getDate()
      if (!obj.flag) {
        return
      }
      const obj1 = this.$refs.description2.getDate()
      if (!obj1.flag) {
        return
      }
      const obj2 = this.$refs.description3.getDate()
      if (!obj2.flag) {
        return
      }
      const params = {
        ...obj.data,
        ...obj1.data,
        ...obj2.data,
        formal: this.formal
      }
      params.lawCaseId = this.getLawCaseId
      console.log(params)
      this.addCaseInfo = {
        judicialExpertise: params.judicialExpertise,
        preservation: params.preservation,
        canSendDate: params.canSendDate
      }
      addOrUpdateCase(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.$emit('saveSuccess')
        }
      })
    },
    //
    change(obj) {
      if (obj.type === 'preservation') { // 如果诉讼保存发生了改变
        const index = this.schema.findIndex(item => item.field === 'preservation')
        this.schema[index + 1].hidden = !obj.value
        this.detailData['canSendDate'] = obj.value ? this.caseData.lawCase.canSendDate : ''
      }
    },
    done() {
      this.init()
    },
    cancel() {

    },
    // 获取案件详情
    async getCaseDetail(id) {
      if (!this.getLawCaseId) {
        return
      }
      const fieldType1 = this.schema.map(item => item.field)
      const fieldType2 = this.schema1.map(item => item.field)
      const fieldType3 = this.schema2.map(item => item.field)
      await queryById({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.caseData = data
          this.$store.commit('SET_CASEINFO', data)
          if (data.lawCase) {
            fieldType1.forEach(item => {
              this.detailData[item] = data.lawCase[item]
            })
          }
          this.detailData.briefName = data.brief
          if (data.lawCaseOther && data.lawCaseOther !== '{}') {
            fieldType3.forEach(item => {
              this.detailData2[item] = data.lawCaseOther[item]
            })
          }
          if (data.lawCasePart && data.lawCasePart !== '{}') {
            fieldType2.forEach(item => {
              this.detailData1[item] = data.lawCasePart[item]
            })
          }
          this.caseNo = data.lawCase.caseNo
          if (this.detailData.preservation) { // 如果需要诉讼保全
            const index = this.schema.findIndex(item => item.field === 'preservation')
            this.schema[index + 1].hidden = false
          }
          this.formal = data.lawCase.formal
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
