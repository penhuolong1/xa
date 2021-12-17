<template>
  <div>
    <div class="header-box">
      <h1 class="header">审查</h1>
      <Button type="primary" @click="review">审查</Button>
    </div>
    <Description
      ref="description"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
    />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { Button } from 'ant-design-vue'
import { examineAdd } from '@/api/collectCase/index.js'
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
      detailData: {},
      schema: [
        {
          field: 'result',
          label: '审查结果',
          type: 'radio',
          required: true,
          options: [
            {
              value: '同意受理',
              label: '同意受理'
            },
            {
              value: '补充材料',
              label: '补充材料'
            },
            {
              value: '不予受理',
              label: '不予受理'
            }
          ],
          span: 3
        },
        {
          field: 'remark',
          label: '审查意见',
          type: 'textArea',
          required: true,
          span: 3
        }
      ],
      isSkeleton: false,
      rules: {
        'result': [
          {
            type: 'required',
            msg: '审查结果不能为空'
          }
        ],
        'remark': [
          {
            type: 'required',
            msg: '审查意见不能为空'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 审查
    review() {
      const obj = this.$refs.description.getDate()
      if (!obj.flag) {
        return
      }
      const params = {
        ...obj.data
      }
      params.preCaseId = this.$route.query.preId
      examineAdd(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          if (params.result === '同意受理') {
            const path = '/addCase/step1'
            this.$router.push(path)
            this.$store.dispatch('DelTags', this.$route.fullPath)
            this.$store.commit('ADD_TAGVIEWLIST', path)
          } else {
            this.$router.push('/collectCase/waitReview')
          }
        }
      })
      console.log(obj)
    }
  }
}
</script>

<style scoped lang="less">
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
.header {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
