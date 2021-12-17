<template>
  <div>
    <Sticky :sticky-top="210" z-index="100">
      <div class="enter-X btn-wrapper">
        <Button type="green" class="mr-2.5" @click="submit">下一步</Button>
        <Button type="blue4" class="mr-2.5" @click="cancel">取消</Button>
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
import { schema, schema1, schema2 } from './schema'
import { addOrUpdateCase, queryJudge, queryById, caseRate } from '@/api/addCase/index.js'
import { trialFieldType } from '@/type/index.js'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky/index.vue'
import { formatDate } from '@/utils/format.js'
const nowTime = formatDate(new Date(), 'YYYY-MM-DD H:m:s')
const nowYear = new Date().getFullYear()
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
      schema1: schema1,
      schema2: schema2,
      defaultCaseNo: `(${nowYear})闽0213诉前调`,
      detailData: {
        preservation: false,
        judicialExpertise: false,
        plaintDate: nowTime,
        preFilingDate: nowTime,
        caseSource: '当事人起诉',
        caseCategory: '民事一审',
        caseType: '民事案件',
        applicableProcedures: '简易程序',
        preMediate: true,
        litigationScene: '大厅收案',
        preCaseNo: `(${nowYear})闽0213诉前调`,
        caseNo: `(${nowYear})闽0213民初`
      },
      detailData1: {
        receiveDepartmentId: '1402178906461638658'
      },
      detailData2: {
        publicWelfare: false,
        involveFour: false,
        involveArmy: false,
        bigCase: false,
        courtSend: false,
        area: '中国大陆'
      },
      rules: {
        'plaintDate': [
          {
            type: 'required',
            msg: '收到诉状日期不能为空'
          }
        ],
        'preFilingDate': [
          {
            type: 'required',
            msg: '预立案日期不能为空'
          }
        ],
        'caseCategory': [
          {
            type: 'required',
            msg: '新案件类别不能为空'
          }
        ],
        'brief': [
          {
            type: 'required',
            msg: '立案案由不能为空'
          }
        ],
        'litigationScene': [
          {
            type: 'required',
            msg: '诉讼场景不能为空'
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
        // 'case1': [
        //   {
        //     type: 'required',
        //     msg: '案号1不能为空'
        //   }
        // ]
      },
      rules2: {
        // 'case2': [
        //   {
        //     type: 'required',
        //     msg: '案号2不能为空'
        //   }
        // ]
      },
      isSkeleton: false,
      lawCaseId: ''
    }
  },
  //
  computed: {
    ...mapGetters(['getLawCaseId', 'getUserInfo'])
  },
  created() {
    const type = localStorage.getItem('addCaseType')
    if (type == 1) { // 已立案待送达的收案
      this.schema[0] = {
        field: 'caseNo',
        label: '案号',
        type: 'caseNo',
        isNeedButton: false,
        typeList: [
          {
            value: '闽0213民初',
            label: '闽0213民初'
          },
          {
            value: '闽0213民特',
            label: '闽0213民特'
          },
          {
            value: '闽0213民再',
            label: '闽0213民再'
          }
        ],
        inputDisabled: false,
        required: true
      }
      this.schema1[3].label = '法官助理'
      this.schema[2].field = 'filingDate'
      this.schema[2].label = '立案日期'
      this.detailData.caseNo = `(${nowYear})闽0213民初`
      this.detailData.preCaseNo = ``
      this.detailData.filingDate = nowTime
      this.detailData.preFilingDate = ''
      this.rules = ({
        'filingDate': [
          {
            type: 'required',
            msg: '立案日期不能为空'
          }
        ],
        ...this.rules
      })
      delete this.rules.preFilingDate
    } else {
      this.schema[0] = {
        field: 'preCaseNo',
        label: '预案号',
        type: 'caseNo',
        isNeedButton: false,
        typeList: trialFieldType,
        inputDisabled: true,
        required: true
      }
      this.schema[2].field = 'preFilingDate'
      this.schema[2].label = '预立案日期'
      this.schema1[3].label = '法官助理'
      this.detailData.caseNo = ``
      this.detailData.preCaseNo = `(${nowYear})闽0213诉前调`
      this.detailData.filingDate = ''
      this.detailData.preFilingDate = nowTime
    }
    caseRate()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    async init() {
      this.isSkeleton = true
      let judegId
      await queryJudge({ type: 7 }).then(({ code, data }) => {
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
          this.schema1[1].options = list
          const userId = this.getUserInfo.user.userId
          console.log(data.find(item => item.user == userId))
          judegId = data.find(item => item.user == userId) ? data.find(item => item.user == userId).id : ''
          console.log(judegId)
        }
      })
      await queryJudge({ type: 6 }).then(({ code, data }) => {
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
          this.schema1[2].options = list
        }
      })
      await this.getCaseDetail()
      if (!this.getLawCaseId) { // 假如没有案件详情收案登记人和预立案审批人默认为当前登录角色
        this.detailData1.receivePeopleId = judegId
        this.detailData1.approvedPeopleId = '1450386181357371394' // 预立安审批人默认洪春稻
        await caseRate().then(({ code, data }) => { // 自动委派法官助理和速录员
          this.detailData1.assistantJudgeId = data.assistantJudge ? data.assistantJudge.id : ''
          this.detailData1.recorderId = data.recorder ? data.recorder.id : ''
        })
      }
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
        ...obj2.data
      }
      params.lawCaseId = this.getLawCaseId
      params.formal = localStorage.getItem('addCaseType') == 1
      console.log(params)
      if (params.preservation) {
        if (!params.canSendDate) {
          this.$message.error('请选择可启用送达日期')
          return
        }
      }
      const addCaseInfo = {}
      if (params.preservation) {
        addCaseInfo.preservation = params.preservation
        addCaseInfo.canSendDate = params.canSendDate
        localStorage.setItem('addCaseInfo', JSON.stringify(addCaseInfo))
      }
      if (params.judicialExpertise) {
        addCaseInfo.judicialExpertise = params.judicialExpertise
        localStorage.setItem('addCaseInfo', JSON.stringify(addCaseInfo))
      }
      delete params.judicialExpertise
      delete params.preservation
      delete params.canSendDate
      if (localStorage.getItem('addCaseType') == 1) { // 假如是已立案带送达的登记案件需判断案件的流水号不能为空
        if (!this.$refs.description1.getCaseNoNum()) {
          return this.$message.error('请输入完整案号')
        }
      }
      addOrUpdateCase(params).then(({ code, msg, data }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.$store.commit('SET_LAWCASE', data.lawCaseId)
          const path = '/addCase/step2'
          this.$router.push(path)
          this.$store.dispatch('DelTags', path)
          this.$store.commit('ADD_TAGVIEWLIST', path)
        }
      })
    },
    //
    change(obj) {
      if (obj.type === 'preservation') { // 如果诉讼保存发生了改变
        const index = this.schema.findIndex(item => item.field === 'preservation')
        this.schema[index + 1].hidden = !obj.value
        this.detailData['canSendDate'] = ''
      }
      console.log(obj)
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
          let addCaseInfo = localStorage.getItem('addCaseInfo')
          if (addCaseInfo) {
            addCaseInfo = JSON.parse(addCaseInfo)
            this.detailData.judicialExpertise = addCaseInfo.judicialExpertise || false
            this.detailData.preservation = addCaseInfo.preservation || false
            this.detailData.canSendDate = addCaseInfo.canSendDate || ''
          }
          if (this.detailData.preservation) { // 如果需要诉讼保全
            const index = this.schema.findIndex(item => item.field === 'preservation')
            this.schema[index + 1].hidden = false
          }
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  background-color: #fff;
}
</style>
