<!-- 基本信息 -->
<template>
  <Description
    ref="description"
    :schema="schema"
    :detail-data="detailData"
    :is-edit="true"
    :is-skeleton="isSkeleton"
    :rules="rules"
    @change="changeType"
  />
</template>

<script>
import Description from '@/components/Description'
import { sexType, idCardType, politicalStatus, marriage, capacity, economics, disease, unitProperties, partyType } from '@/type/index.js'
import { nation } from '@/type/nation.js'
import { addOrUpdateLitigant, getDetail } from '@/api/addCase/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    Description
  },
  props: {
    lawCase: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      naturalSchema: [ // 自然人
        {
          field: 'type',
          label: '当事人类型',
          type: 'radio',
          span: 2,
          options: partyType,
          required: true
        },
        {
          field: 'name',
          label: '当事人',
          type: 'input',
          required: true
        },
        {
          field: 'area',
          label: '国家或地区',
          type: 'input'
        },
        {
          field: 'nation',
          label: '民族',
          type: 'select',
          options: nation
        },
        {
          field: 'idCardType',
          label: '证件类型',
          type: 'select',
          required: true,
          options: idCardType
        },
        {
          field: 'idCard',
          label: '证件号码',
          type: 'input',
          required: true
        },
        {
          field: 'sex',
          label: '性别',
          type: 'select',
          options: sexType
        },
        {
          field: 'birthday',
          label: '出生日期',
          type: 'date'
        },
        {
          field: 'overseasChinese',
          label: '是否涉侨',
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
          field: 'floatPopulation',
          label: '是否流动人口',
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
          field: 'nativePlace',
          label: '籍贯',
          type: 'input'
        },
        {
          field: 'marriage',
          label: '婚姻状况',
          type: 'select',
          options: marriage
        },
        {
          field: 'politicalStatus',
          label: '政治面貌',
          type: 'select',
          options: politicalStatus
        },
        {
          field: 'capacity',
          label: '行为能力',
          type: 'select',
          options: capacity
        },
        {
          field: 'economics',
          label: '家庭经济情况',
          type: 'radio',
          options: economics
        },
        {
          label: '',
          span: 4
        },
        {
          field: 'disease',
          label: '特殊生理或疾病',
          type: 'checkbox',
          options: disease

        }
      ],
      legalSchema: [ // 法人字段
        {
          field: 'type',
          label: '当事人类型',
          type: 'radio',
          span: 2,
          options: partyType
        },
        {
          field: 'name',
          label: '当事人',
          type: 'input',
          required: true

        },
        {
          field: 'idCard',
          label: '组织机构代码/统一社会信用代码',
          type: 'input',
          required: true
        },
        {
          field: 'area',
          label: '国家或地区',
          type: 'input'
        },
        {
          field: 'unitProperties',
          label: '单位性质',
          type: 'select',
          options: unitProperties
        },
        {
          field: 'lawsuitTarget',
          label: '诉讼对象',
          type: 'input'
        },
        {
          field: 'legalMan',
          label: '法定代表人或经营者 ',
          type: 'input',
          required: true,
          span: 4
        },
        {
          field: 'legalCardType',
          label: '证件类型',
          type: 'select',
          required: true,
          options: idCardType
        },
        {
          field: 'legalCard',
          label: '证件号码',
          type: 'input',
          required: true
        },

        {
          field: 'duty',
          label: '职务',
          type: 'input'
        },
        {
          field: 'capacity',
          label: '行为能力',
          type: 'select',
          options: capacity
        },
        {
          field: 'marriage',
          label: '婚姻状况',
          type: 'select',
          options: marriage

        }
      ],
      schema: [],
      detailData: {},
      rules: {},
      isSkeleton: false,
      naturalRules: {
        'type': [
          {
            type: 'required',
            msg: '当事人类型不能为空'
          }
        ],
        'name': [
          {
            type: 'required',
            msg: '当事人不能为空'
          }
        ],
        'idCardType': [
          {
            type: 'required',
            msg: '证件类型不能为空'
          }
        ],
        'idCard': [
          {
            type: 'required',
            msg: '证件号码不能为空'
          }
        ]
      },
      legalRules: {
        'type': [
          {
            type: 'required',
            msg: '当事人类型不能为空'
          }
        ],
        'name': [
          {
            type: 'required',
            msg: '当事人不能为空'
          }
        ],
        'idCard': [
          {
            type: 'required',
            msg: '统一社会信用代码不能为空'
          }
        ],
        'legalMan': [
          {
            type: 'required',
            msg: '法定代表人不能为空'
          }
        ],
        'legalCardType': [
          {
            type: 'required',
            msg: '证件类型不能为空'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.schema = this.naturalSchema
    this.rules = this.naturalRules
  },
  mounted() {
  },
  methods: {
    changeType({ type, value }) {
      if (type === 'type') {
        if (value == 0) {
          this.schema = this.naturalSchema
          this.rules = this.naturalRules
        } else {
          this.schema = this.legalSchema
          this.rules = this.legalRules
        }
        this.$emit('changeType', value)
      }
    },
    reset() {
      this.detailData = {}
      this.schema = this.naturalSchema
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 提交
    submit() {
      const obj = this.$refs.description.getDate()
      const params = { ...obj.data }
      params.disease = params.disease && params.disease.length > 0 ? params.disease.join(',') : ''
      params.idCardTypeDescription = params.idCardType ? idCardType.find(item => params.idCardType === item.value).label : ''
      params.legalCardTypeDescription = params.legalCardType ? idCardType.find(item => params.legalCardType === item.value).label : ''

      delete params.idCardType
      delete params.legalCardType
      if (!obj.flag) { // 验证不通过
        return { flag: true }
      } else {
        return params
      }
    },
    // 赋值
    setData(data) {
      let fieldType = []
      this.isSkeleton = true
      this.$emit('changeType', data.type)
      if (data.type === 0) {
        this.schema = this.naturalSchema
        this.rules = this.naturalRules
        fieldType = this.naturalSchema.map(item => item.field)
      } else {
        this.schema = this.legalSchema
        this.rules = this.legalRules
        fieldType = this.legalSchema.map(item => item.field)
      }
      fieldType.forEach(item => {
        this.detailData[item] = data[item]
      })
      this.detailData.disease = this.detailData.disease ? this.detailData.disease.split(',') : []
      setTimeout(() => {
        this.isSkeleton = false
      }, 500)
      console.log(this.detailData)
    }
  }
}
</script>

<style scoped lang="less">

</style>
