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
import { litigationStatusSf, sexType, idCardType, partyType, unitProperties } from '@/type/index.js'
import { addOrUpdateLitigant } from '@/api/addCase/index'
import { nation } from '@/type/nation.js'
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
      schema: [],
      detailData: {
        idCardType: 1,
        litigationStatusId: 4,
        type: 0,
        area: '中国'
      },
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
        'litigationStatusId': [
          {
            type: 'required',
            msg: '诉讼地位不能为空'
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
        'litigationStatusId': [
          {
            type: 'required',
            msg: '诉讼地位不能为空'
          }
        ],
        'idCard': [
          {
            type: 'required',
            msg: '组织机构代码/统一社会信用代码不能为空'
          }
        ]
      },
      naturalSchema: [ // 自然人
        {
          field: 'litigationStatusId',
          label: '诉讼地位',
          type: 'radio',
          options: litigationStatusSf,
          required: true
        },
        {
          field: 'type',
          label: '当事人类型',
          type: 'radio',
          options: partyType,
          required: true
        },
        {
          field: 'name',
          label: '姓名',
          type: 'input',
          required: true
        },
        {
          field: 'idCardType',
          label: '证件类型',
          type: 'select',
          options: idCardType,
          required: true
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
          field: 'postalCode',
          label: '邮政编码',
          type: 'input'
        },
        {
          field: 'wx',
          label: '微信',
          type: 'input'
        },
        {
          field: 'qq',
          label: 'QQ',
          type: 'input'
        },
        {
          field: 'email',
          label: '电子邮箱',
          type: 'input'
        },
        {
          field: 'otherContact',
          label: '其他联系方式',
          type: 'input'
        }
        // {
        //   field: 'phone',
        //   label: '默认登录账号',
        //   type: 'input'
        // }
      ],
      legalSchema: [ // 法人
        {
          field: 'litigationStatusId',
          label: '诉讼地位',
          type: 'radio',
          options: litigationStatusSf,
          required: true
        },
        {
          field: 'type',
          label: '当事人类型',
          type: 'radio',
          options: partyType,
          required: true
        },
        {
          field: 'name',
          label: '名称',
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
          field: 'legalMan',
          label: '法定代表人',
          type: 'input'
        },
        {
          field: 'legalCardType',
          label: '证件类型',
          type: 'select',
          options: idCardType
        },
        {
          field: 'legalCard',
          label: '证件号码',
          type: 'input'
        },
        {
          field: 'wx',
          label: '微信',
          type: 'input'
        },
        {
          field: 'qq',
          label: 'QQ',
          type: 'input'
        },
        {
          field: 'email',
          label: '电子邮箱',
          type: 'input'
        },
        {
          field: 'otherContact',
          label: '其他联系方式',
          type: 'input'
        }
        // {
        //   field: 'phone',
        //   label: '默认登录账号',
        //   type: 'input'
        // }
      ]
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
      this.detailData = {
        idCardType: 1,
        litigationStatusId: 4,
        type: 0,
        area: '中国'
      }
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
      this.detailData.litigationStatusId = Number(data.litigationStatusId)
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
