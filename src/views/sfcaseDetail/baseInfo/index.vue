<template>
  <div>
    <div class="mb-2.5 enter-X">
      <Button type="green" @click="submit">保存</Button>
    </div>
    <Description
      ref="description1"
      class="enter-X"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
      title="案件详情"
    />
    <div class="my-2.5 enter-X">
      <Button type="green" @click="addEvidence">新增证据</Button>
    </div>
    <EvidenceList ref="evidenceList" class="mb-2.5 enter-X" />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { Button } from 'ant-design-vue'
import { addSfLawCase, sfCaseInfoById } from '@/api/sfAddcase/index.js'
import { getApplySerial } from '@/api/addCase/index.js'
import EvidenceList from '@/components/SfEvidenceList/index'
import { caseType } from '@/type/index.js'

import { mapGetters } from 'vuex'
const schema = [ // 案件详情数据
  {
    field: 'serialNumber',
    label: '申请流水号',
    type: 'input',
    disabled: true,
    required: true
  },
  {
    field: 'caseSource',
    label: '纠纷来源',
    type: 'input',
    disabled: true,
    required: true
  },
  {
    field: 'caseType',
    label: '纠纷类型',
    type: 'select',
    required: true,
    options: caseType
  },
  {
    field: 'caseNo',
    label: '案号',
    type: 'label'
  },
  {
    field: 'registerDate',
    label: '立案时间',
    type: 'label'
  },
  {
    field: 'initialCaseNo',
    label: '原案号',
    type: 'input'
  },
  {
    field: 'brief',
    label: '申请事由',
    type: 'brief',
    required: true
  },
  {
    field: 'applyDate',
    label: '申请日期',
    type: 'date',
    showTime: true,
    required: true
  },
  {
    field: 'subjectAmount',
    label: '纠纷金额',
    inputType: 'number',
    type: 'input'
  },
  {
    field: 'mediateDate',
    label: '预约调解时间',
    type: 'date',
    showTime: true,
    required: true
  },
  {
    field: 'mediationPlace',
    label: '调解地点',
    type: 'mediationPlace'
  },
  {
    field: 'state',
    label: '案件状态'
  },
  {
    field: 'claim',
    label: '请求事项',
    span: 3,
    type: 'textArea'
  },
  {
    field: 'factReason',
    label: ' 事实与理由',
    span: 3,
    type: 'textArea'
  },
  {
    field: '',
    label: '解纷方案'
  }
]
export default {
  components: {
    Description,
    EvidenceList,
    Button
  },
  props: {

  },
  data() {
    return {
      schema: schema,
      detailData: {
        caseSourceStr: '单位登记',
        applyDate: this.format(new Date(), 'YYYY-MM-DD H:m:s')
      },
      rules: {
        'serialNumber': [
          {
            type: 'required',
            msg: '申请流水号不能为空'
          }
        ],
        'caseSourceStr': [
          {
            type: 'required',
            msg: '案件来源不能为空'
          }
        ],
        'caseType': [
          {
            type: 'required',
            msg: '案件类型不能为空'
          }
        ],
        'brief': [
          {
            type: 'required',
            msg: '立案案由不能为空'
          }
        ],
        'applyDate': [
          {
            type: 'required',
            msg: '申请日期不能为空'
          }
        ]

      },
      isSkeleton: false,
      lawCaseId: ''
    }
  },
  //
  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },
  watch: {
    getSfLawCaseId() {
      this.init()
    }
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
      await getApplySerial().then(({ code, data }) => {
        if (code === 200) {
          this.detailData.serialNumber = data.serialNumber
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
      const params = {
        ...obj.data
      }
      params.id = this.getSfLawCaseId
      console.log(params)
      addSfLawCase(params).then(({ code, msg, data }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.$store.commit('SET_SFLAWCASE', data.sfLawCaseId)
        }
      })
    },
    // 获取案件详情
    async getCaseDetail(id) {
      if (!this.getSfLawCaseId) {
        return
      }
      const fieldType1 = this.schema.map(item => item.field)
      await sfCaseInfoById({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_CASEINFO', data)
          fieldType1.forEach(item => {
            this.detailData[item] = data[item]
          })
          if (data.registerDate) {
            const time = (new Date(data.registerDate)).getTime() + 24 * 30 * 60 * 60 * 1000
            const endDate = this.format(new Date(time), 'YYYY-MM-DD')
            data.registerDate = this.format(new Date(data.registerDate), 'YYYY-MM-DD')
            this.detailData.registerDate = data.registerDate + '|调解截止' + endDate
          }
          this.detailData.briefName = data.briefName
          this.$store.commit('SET_SFCASEINFO', data)
        }
      })
    },
    // 添加证据
    addEvidence() {
      this.$refs.evidenceList.addEvidence()
    }
  }
}
</script>

<style scoped lang="less">

</style>
