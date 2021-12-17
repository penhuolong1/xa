<template>
  <Description
    ref="description"
    :schema="schema"
    :column="2"
    :detail-data="detailData"
    :is-edit="true"
    :is-skeleton="isSkeleton"
  />
</template>

<script>
import Description from '@/components/Description'
import { examineHistory } from '@/api/collectCase/index.js'
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
      detailData: {
      },
      schema: [
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
      examineHistory({ preCaseId: this.$route.query.preId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data && data.length === 0) {
            return
          }
          // this.schema = []
          this.detailData = {}
          data.forEach((item, index) => {
            const list = [
              {
                label: '审查时间',
                field: 'examineTime' + index
              },
              {
                label: '审查人',
                field: 'examinePeople' + index
              },
              {
                label: '审查结果',
                field: 'result' + index
              },
              {
                label: '审查意见',
                field: 'remark' + index
              }
            ]
            this.detailData['examineTime' + index] = item.examineTime ? formatDate(item.examineTime, 'YYYY-MM-DD H:m:s') : ''
            this.detailData['examinePeople' + index] = item.examinePeople
            this.detailData['result' + index] = item.result
            this.detailData['remark' + index] = item.remark
            this.schema = [...this.schema, ...list]
          })
          console.log(this.schema)
          console.log(this.detailData)
          this.isSkeleton = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
