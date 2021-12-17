<template>
  <div>
    <Sticky :sticky-top="210">
      <div class="enter-X btn-wrapper">
        <Button type="green" @click="submit">下一步</Button>
        <Button type="blue4" class="ml-2.5" @click="cancel">取消</Button>
      </div>
    </Sticky>
    <Description
      ref="description1"
      class="enter-X mt-2.5"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
      title="案件详情"
    />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { Button } from 'ant-design-vue'
import { schema } from './schema'
import { addSfLawCase, sfCaseInfoById } from '@/api/sfAddcase/index.js'
import { getApplySerial } from '@/api/addCase/index.js'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky/index.vue'

export default {
  components: {
    Description,
    Button,
    Sticky
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
        serialNumber: [
          {
            type: 'required',
            msg: '申请流水号不能为空'
          }
        ],
        caseSourceStr: [
          {
            type: 'required',
            msg: '案件来源不能为空'
          }
        ],
        caseType: [
          {
            type: 'required',
            msg: '案件类型不能为空'
          }
        ],
        brief: [
          {
            type: 'required',
            msg: '立案案由不能为空'
          }
        ],
        applyDate: [
          {
            type: 'required',
            msg: '申请日期不能为空'
          }
        ],
        subjectAmount: [
          {
            type: 'required',
            msg: '起诉标的金额不能为空'
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
          this.$router.push('/sfaddCase/step2')
          const path = '/sfaddCase/step2'
          this.$router.push(path)
          this.$store.dispatch('DelTags', '/sfaddCase/step1')
          this.$store.commit('ADD_TAGVIEWLIST', path)
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
          fieldType1.forEach(item => {
            this.detailData[item] = data[item]
          })
          this.detailData.caseSourceStr = this.detailData.caseSourceStr || '单位登记'
          this.detailData.briefName = data.briefName
        }
      })
    },
    cancel() {
      this.$router.push('/sfCaseManage/addCaseList')
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  background-color: #fff;
  margin-bottom: 10px;
}
</style>
