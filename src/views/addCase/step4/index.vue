<template>
  <div>
    <Sticky :sticky-top="210">
      <div class="enter-X">
        <Button type="green" class="mr-2.5" @click="prev">上一步</Button>
        <Button type="blue4" @click="submit">确定</Button>
      </div>
    </Sticky>
    <Description
      ref="description1"
      :is-skeleton="isSkeleton"
      class="enter-X mt-2.5 "
      :schema="schema"
      :column="2"
      :detail-data="detailData"
      :is-edit="true"
      :rules="rules"
    />
    <Next ref="next" :select-key="[{lawCaseId:getLawCaseId}]" :next-list="nextList" @done="done" @cancel="cancel" />
    <Freeze ref="free" :select-key="[{lawCaseId:getLawCaseId}]" @done="done1" @cancel="cancel" />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { addPreCasePartInfo, queryPreCaseInfo, getApplySerial, getNewSerial } from '@/api/addCase/index.js'
import CaseNo from '@/components/CaseNo'
import { trialFieldType, trialFieldType1 } from '@/type/index.js'
import Next from '@/components/NextStep'
import Freeze from '@/views/acceptCase/readyCase/components/free'
import { Button } from 'ant-design-vue'
import Sticky from '@/components/Sticky/index.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Description,
    Button,
    CaseNo,
    Sticky,
    Next,
    Freeze
  },
  props: {

  },
  data() {
    return {
      lawData: {}, // 案件详情
      schema: [
        {
          field: 'serialNumber',
          label: '申请流水号'
        },
        {
          field: 'preCaseNo',
          label: '预案号',
          type: 'other',
          content: (<div class='box'>
            <CaseNo ref='caseNo' isNeedUnUsedNums={true} inputDisabled={false} vModel={this.caseNo} class='case-no'></CaseNo>
          </div>)
        },
        {
          field: 'brief',
          label: '案由'
        },
        {
          field: 'receivePeople',
          label: '收案登记人'
        },
        {
          field: 'approvedPeopleId',
          label: '预立案审批人',
          type: 'judge',
          userType: 6,
          required: true
        },
        {
          field: 'assistantJudgeId',
          label: '法官助理',
          type: 'judge',
          userType: 3,
          required: true
        },
        {
          field: 'recorderId',
          label: '速录员',
          type: 'judge',
          userType: 5,
          required: true
        }
        // {
        //   field: '',
        //   label: '通知当事人方式',
        //   type: 'checkbox',
        //   span: 2,
        //   options: [
        //     {
        //       value: 1,
        //       label: '微信'
        //     },
        //     {
        //       value: 2,
        //       label: '短信'
        //     }
        //   ],
        //   change: this.change
        // },
        // {
        //   field: '',
        //   label: '通知内容',
        //   type: 'textArea',
        //   span: 2
        // }
      ],
      nextList: [
        {
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 2,
          label: '诉前程序'
        },
        {
          value: 3,
          label: '待正式立案'
        },
        {
          value: 4,
          label: '诉前销案'
        },
        {
          value: 5,
          label: '不予受理'
        }
      ],
      caseNo: '',
      detailData: {
      },
      rules: {
        'serialNumber': [
          {
            type: 'required',
            msg: '流水号不能为空'
          }
        ],
        'approvedPeopleId': [
          {
            type: 'required',
            msg: '预立案审批人不能为空'
          }
        ],
        'assistantJudgeId': [
          {
            type: 'required',
            msg: '法官助理不能为空'
          }
        ],
        'recorderId': [
          {
            type: 'required',
            msg: '速录员不能为空'
          }
        ]
      },
      isSkeleton: false,
      maxNumberId: '', // 最大流水号id
      preLawCaseId: '' // 预立案id
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.addCaseInfo = JSON.parse(localStorage.getItem('addCaseInfo'))
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    async init() {
      this.isSkeleton = true
      await this.getCaseDetail()
      if (!this.preLawCaseId) {
        await getApplySerial().then(({ code, data }) => {
          if (code === 200) {
            this.detailData.serialNumber = data.serialNumber
          }
        })
      }
      this.isSkeleton = false
      this.$nextTick(() => {
        this.$refs.caseNo.setCaseNo(this.detailData.preCaseNo)
        this._getNewSerial(this.detailData.preCaseNo)
      })
    },
    // 获取预立案件详情
    async getCaseDetail(id) {
      if (!this.getLawCaseId) {
        return
      }
      const fieldType1 = this.schema.map(item => item.field)
      await queryPreCaseInfo({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          const obj = {
            ...data
          }
          fieldType1.forEach(item => {
            this.detailData[item] = obj[item]
          })
          this.preLawCaseId = data.preLawCaseId
        }
      })
    },
    submit() {
      const obj = this.$refs.description1.getDate()
      if (!obj.flag) {
        return
      }
      const params = { ...obj.data }
      params.lawCaseId = this.getLawCaseId
      params.preLawCaseId = null
      delete params.brief
      delete params.receivePeopleId
      const caseNo = this.$refs.caseNo.getCaseNo()
      params.preCaseNo = caseNo?.caseNo
      params.number = this.$refs.caseNo.num ? this.$refs.caseNo.num + '' : ''
      params.maxNumberId = caseNo?.maxNumberId
      params.preLawCaseId = this.preLawCaseId
      addPreCasePartInfo(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.init()
          if (params.number) {
            const path = '/collectCase/readyCase'
            // this.$router.push(path)
            this.$store.dispatch('DelTags', path)
            this.$store.commit('ADD_TAGVIEWLIST', path)
            if (this.addCaseInfo) { // 如果需要诉讼保全
              this.$refs.free.show(1, this.addCaseInfo.canSendDate)
              return
            }
            if (this.addCaseInfo) { // 如果需要司法鉴定
              this.$refs.free.show(2)
              return
            }
            this.$refs.next.show()
          } else {
            const path = '/collectCase/waitReview'
            this.$router.push(path)
            this.$store.dispatch('DelTags', path)
            this.$store.commit('ADD_TAGVIEWLIST', path)
          }
        }
      })
    },
    // 上一步
    prev() {
      const path = '/addCase/step3'
      this.$router.push(path)
      this.$store.dispatch('DelTags', path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    change(e) {
      console.log(e)
    },
    // 获取流水号
    _getNewSerial(precaseNo) {
      if (!precaseNo) {
        return
      }
      const obj = this.setCaseNo(precaseNo)
      if (!obj.num) {
        const params = {
          year: obj.year,
          prefix: obj.typeLabel
        }
        getNewSerial(params).then(({ code, data }) => {
          if (code === 200) {
            this.$nextTick(() => {
              this.$refs.caseNo.num = data.maxNumber
              this.$refs.caseNo.maxNumberId = data.maxNumberId
            })
          }
        })
      }
    },
    // 案号赋值
    setCaseNo(value) {
      const defaultvalue = value || this.defaultValue
      if (!defaultvalue) {
        return
      }
      const trialField = [...trialFieldType, ...trialFieldType1]
      const obj = trialField.find(item => {
        return defaultvalue.indexOf(item.value) !== -1
      })
      if (!obj || !obj.label) {
        return
      }
      const obj1 = {}
      obj1.typeLabel = obj.label
      const list = defaultvalue.split(obj.label)
      if (list && list.length > 0) {
        obj1.year = list[0].replace(/[^0-9]/ig, '')
        if (list[1]) {
          obj1.num = list[1].indexOf('号') !== -1 ? list[1].split('号')[0] : list[1]
        } else {
          obj1.num = ''
        }
      }
      return obj1
    },
    // 转下一流程提交成功后触发
    done(params) {
      let path = 'collectCase/readyCase'
      if (params.process === '送达中待指派') {
        path = '/servedManage/reassigned'
      } else if (params.process === '诉前程序') {
        path = '/caseHandle/preientation'
      } else if (params.process === '待正式立案') {
        path = '/collectCase/waitCase'
      } else {
        path = '/caseManage/wholecaseline'
      }
      // else if (params.process === '诉前销案') {

      // } else if (params.process === '不予受理') {

      // }
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/addCase/step4')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    // 冻结案件成功后触发
    done1(type) {
      if (type == 1) { // 保全成功
        if (this.addCaseInfo.judicialExpertise) { // 如果需要司法鉴定
          setTimeout(() => {
            this.$refs.free.show(2)
          }, 200)
          return
        }
        const path = '/caseManage/savecase'
        this.$router.push(path)
        this.$store.dispatch('DelTags', '/addCase/step4')
        this.$store.commit('ADD_TAGVIEWLIST', path)
      } else { // 鉴定成功
        const path = '/caseManage/appraisalcase'
        this.$router.push(path)
        this.$store.dispatch('DelTags', '/addCase/step4')
        this.$store.commit('ADD_TAGVIEWLIST', path)
      }
    },
    // 取消
    cancel() {
      const path = '/collectCase/readyCase'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/addCase/step4')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    }
  }
}
</script>

<style scoped lang="less">
.box {
  display: flex;
  .btn {
    margin: 0 10px;
  }
}
.case-no {
  /deep/.ant-input {
    width: 50px!important;
  }
}
</style>
