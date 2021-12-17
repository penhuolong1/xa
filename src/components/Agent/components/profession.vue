<!-- 教育及职业信息 -->
<template>
  <Description
    ref="description"
    :schema="schema"
    :detail-data="detailData"
    :is-edit="true"
    :is-skeleton="isSkeleton"
    :rules="rules"
  />
</template>

<script>
import Description from '@/components/Description'
import { job, education, specialStatus } from '@/type/index.js'
import { addOrUpdateLitigant } from '@/api/addCase/index'
import { mapGetters } from 'vuex'

export default {
  components: {
    Description
  },
  props: {

  },
  data() {
    return {
      schema: [
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
          options: specialStatus
        }
      ],
      detailData: {},
      rules: {},
      isSkeleton: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getLitigantId'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    submit() {
      const obj = this.$refs.description.getDate()
      if (!obj.flag) { // 验证不通过
        return
      }
      const params = { ...obj.data }
      params.specialStatus = params.specialStatus && params.specialStatus.length > 0 ? params.specialStatus.join(',') : ''
      return params
    },
    reset() {
      this.detailData = {}
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 赋值
    setData(data) {
      this.isSkeleton = true
      const fieldType = this.schema.map(item => item.field)
      fieldType.forEach(item => {
        this.detailData[item] = data[item]
        if (item === 'specialStatus') {
          this.detailData[item] = data[item] ? data[item].split(',') : []
        }
      })
      setTimeout(() => {
        this.isSkeleton = false
      }, 500)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
