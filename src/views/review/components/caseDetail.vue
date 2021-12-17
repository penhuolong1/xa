<template>
  <Description
    ref="description"
    :schema="schema"
    :detail-data="detailData"
    :is-edit="true"
    :is-skeleton="isSkeleton"
  />
</template>

<script>
import Description from '@/components/Description'
import { sfCaseInfoById } from '@/api/sfAddcase/index.js'
import { queryById } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/format.js'

export default {
  components: {
    Description
  },
  props: {

  },
  data() {
    return {
      detailData: {},
      schema: [
        {
          field: 'serialNumber',
          label: '流水号',
          type: 'input'
        },
        {
          field: 'litigationScene',
          label: '诉讼场景'
        },
        {
          label: ''
        },
        {
          field: 'caseType',
          label: '案件类型'
        },
        {
          field: 'briefName',
          label: '立案案由'
        },
        {
          field: 'applyDate',
          label: '申请日期'
        },
        {
          field: 'subjectAmount',
          label: '起诉标的金额'
        },
        {
          field: 'preservation',
          label: '是否诉讼保全'
        },
        {
          field: 'judicialExpertise',
          label: '是否司法鉴定'
        },
        {
          field: 'claim',
          label: '诉讼请求',
          span: 3
        },
        {
          field: 'factReason',
          label: '事实与理由',
          span: 3
        }
      ],
      isSkeleton: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.isSkeleton = true
      sfCaseInfoById({ sfLawCaseId: this.$route.query.id }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_SFCASEINFO', data)
        }
      })
      queryById({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          const list = this.schema.map(item => {
            return item.field
          })
          list.forEach(item => {
            this.detailData[item] = data.lawCase[item]
          })
          this.detailData.briefName = data.brief
          this.detailData.serialNumber = data.serialNumber
          this.detailData.applyDate = data.applyDate
          this.detailData.preservation = this.detailData.preservation ? '是' : '否'
          this.detailData.judicialExpertise = this.detailData.judicialExpertise ? '是' : '否'
          this.detailData.applyDate = this.detailData.applyDate ? this.$moment(this.detailData.applyDate).format('YYYY-MM-DD HH:mm:ss') : ''
          this.isSkeleton = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
