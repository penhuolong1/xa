<!-- 基本信息 -->
<template>
  <span>
    <Description
      ref="description"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
      @change="changeType"
    />
    <Description
      v-if="type == 0"
      ref="description1"
      class="mt-2.5"
      :schema="schema1"
      :detail-data="detailData1"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      @change="changeType"
    />
  </span>
</template>

<script>
import Description from '@/components/Description'
import { litigationStatus, sexType, idCardType, politicalStatus, marriage, capacity, economics, disease, partyType, unitProperties, education, specialStatus, job } from '@/type/index.js'
import { addOrUpdateLitigant } from '@/api/addCase/index'
import { nation } from '@/type/nation.js'
import { getCardInfo } from '@/utils/getCardInfo.js'
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
          field: 'litigationStatusId',
          label: '一审诉讼地位',
          type: 'radio',
          span: 2,
          required: true,
          options: litigationStatus
        },
        {
          field: 'countercharge',
          label: '提出反诉',
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
          field: 'age',
          label: '涉诉时年龄',
          type: 'input'
        },
        {
          field: 'area',
          label: '国籍',
          type: 'input'
        },
        {
          field: 'overseasChinese',
          label: '涉侨',
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
          field: 'nation',
          label: '民族',
          type: 'select',
          options: nation
        },
        {
          field: 'marriage',
          label: '婚姻状况',
          type: 'select',
          options: marriage
        },
        {
          field: 'nativePlace',
          label: '籍贯',
          type: 'input'
        },
        {
          field: 'politicalStatus',
          label: '政治面貌',
          type: 'select',
          options: politicalStatus
        },
        {
          field: 'floatPopulation',
          label: '流动人员',
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
        // {
        //   field: 'phone',
        //   label: '登陆手机号码',
        //   type: 'input'
        // },
        {
          label: ''
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
          field: 'litigationStatusId',
          label: '一审诉讼地位',
          type: 'radio',
          span: 2,
          required: true,
          options: litigationStatus
        },
        {
          field: 'countercharge',
          label: '提出反诉',
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
          field: 'idCard',
          label: '组织机构代码/统一社会信用代码',
          type: 'input',
          required: true
        },
        {
          field: 'area',
          label: '国籍',
          type: 'input'
        },
        {
          field: 'unitProperties',
          label: '单位性质',
          type: 'select',
          options: unitProperties
        },
        {
          field: 'legalMan',
          label: '法定代表人或经营者 ',
          type: 'input',
          required: true
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
          type: 'input'
        },
        {
          field: 'capacity',
          label: '行为能力',
          type: 'select',
          options: capacity
        },
        {
          field: 'duty',
          label: '职务',
          type: 'input'
        },
        {
          field: 'lawsuitTarget',
          label: '诉讼对象',
          type: 'input'
        },
        {
          field: 'phone',
          label: '登陆手机号码',
          type: 'input'
        }
      ],
      schema1: [
        {
          field: 'job',
          label: '职业',
          type: 'select',
          options: job
        },
        {
          field: 'education',
          label: '文化程度',
          type: 'select',
          options: education
        },
        {
          field: 'company',
          label: '所在单位',
          type: 'input'
        },
        {
          field: 'duty',
          label: '职位',
          type: 'input'
        },
        {
          field: 'specialStatus',
          label: '特殊身份',
          type: 'checkbox',
          span: 2,
          options: specialStatus
        }
      ],
      schema: [],
      detailData: {
        type: 0,
        idCardType: 1,
        area: '中国',
        nation: '汉族'
      },
      detailData1: {

      },
      rules: {},
      type: '',
      isSkeleton: false,
      naturalRules: {
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
        ],
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
        'litigationStatusId': [
          {
            type: 'required',
            msg: '诉讼地位不能为空'
          }
        ]
      },
      legalRules: {
        'idCard': [
          {
            type: 'required',
            msg: '统一信用代码不能为空'
          }
        ],
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
        'litigationStatusId': [
          {
            type: 'required',
            msg: '诉讼地位不能为空'
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
    changeType({ type, value, data }) {
      if (type === 'type') {
        if (value == 0) {
          this.schema = this.naturalSchema
          this.rules = this.naturalRules
        } else {
          this.schema = this.legalSchema
          this.rules = this.legalRules
        }
        this.type = value
        this.$emit('changeType', value)
      }
      if (type === 'idCard') { // 输入证件号
        if (data.idCardType === 1) { // 如果证件类型是身份证号
          if (value.length === 15 || value.length === 18) { // 如果长度为15位或者18位时触发方法查询对应信息
            console.log('身份证号码计算123')
            const info = getCardInfo(value)
            this.detailData.birthday = info.birthday
            this.detailData.age = info.age
            this.detailData.sex = info.sex
            this.detailData.nativePlace = info.province
            this.detailData = { ...this.detailData }
          }
        }
      }
    },
    reset() {
      this.detailData = {
        type: 0,
        idCardType: 1,
        area: '中国',
        nation: '汉族'
      }
      this.detailData1 = {}
      this.schema = this.naturalSchema
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 提交
    submit() {
      const obj = this.$refs.description.getDate()
      let params = { ...obj.data }
      if (this.$refs.description1) {
        const obj1 = this.$refs.description1 && this.$refs.description1.getDate()
        params = {
          ...params,
          ...obj1.data
        }
      }
      params.specialStatus = params.specialStatus && params.specialStatus.length > 0 ? params.specialStatus.join(',') : ''
      params.disease = params.disease && params.disease.length > 0 ? params.disease.join(',') : ''
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
      const fieldType1 = this.schema1.map(item => item.field)
      fieldType1.forEach(item => {
        this.detailData1[item] = data[item]
        if (item === 'specialStatus') {
          this.detailData1[item] = data[item] ? data[item].split(',') : []
        }
      })
      this.detailData.litigationStatusId = Number(data.litigationStatus.id)
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
