<template>
  <div>
    <Sticky :sticky-top="210">
      <div class="enter-X btn-wrapper">
        <Button type="blue4" class="mr-2.5" @click="prev">上一步</Button>
        <Button type="green" @click="submit">确定</Button>
      </div>
    </Sticky>
    <Description
      ref="description1"
      style="width: 60%;margin: 0 auto;"
      :is-skeleton="isSkeleton"
      class="mt-2.5 enter-X"
      :schema="schema"
      :column="2"
      :detail-data="detailData"
      :is-edit="true"
      :rules="rules"
      @change="change"
    />
  </div>
</template>

<script>
import Description from '@/components/Description'
import { sfCaseInfoById, submitCase, listChildOfUnit } from '@/api/sfAddcase/index.js'
import CaseNo from '@/components/CaseNo'
import { Button } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky/index.vue'

export default {
  components: {
    Description,
    Button,
    CaseNo,
    Sticky
  },
  props: {

  },
  data() {
    return {
      applyType1: 2,
      applyType2: 2,
      schema: [
        {
          field: 'serialNumber',
          label: '申请流水号',
          span: 2
        },
        {
          field: 'applyType1',
          label: '向诉非联动中心申请',
          type: 'select',
          required: true,
          options: [
            {
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }
          ],
          span: 2
        },
        {
          field: 'applyType2',
          label: '交办下级单位',
          type: 'select',
          required: true,
          options: [
            {
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }
          ],
          span: 2,
          vIf: () => {
            return this.applyType1 === 2
          }
        },
        {
          field: 'caseNo',
          label: '案号',
          type: 'other',
          required: true,
          span: 2,
          content: (<div class='box'>
            <CaseNo ref='caseNo' type='3' typeList={[
              {
                value: '诉非',
                label: '诉非'
              }
            ]} isNeedUnUsedNums={false} isNeedReset={false} inputDisabled={false} vModel={this.caseNo} class='case-no'></CaseNo>
          </div>),
          vIf: () => {
            return this.applyType1 === 2 && this.applyType2 === 2
          }
        },
        {
          field: 'brief',
          label: '纠纷案由',
          type: 'brief',
          span: 2
        },
        {
          field: 'childDeptId',
          label: '下级单位',
          type: 'childUnit',
          codes: '11,12,13',
          required: true,
          span: 2,
          vIf: () => {
            return this.applyType2 === 1
          }
        },
        {
          field: 'initialCaseNo',
          label: '原案号',
          type: 'input',
          span: 2
        },
        {
          field: 'receivePeople',
          label: '收案登记人',
          span: 2
        },
        {
          field: '',
          label: '通知当事人方式',
          type: 'checkbox',
          span: 2,
          options: [
            {
              value: 1,
              label: '微信'
            },
            {
              value: 2,
              label: '短信'
            }
          ],
          change: this.change
        },
        {
          field: '',
          label: '通知内容',
          type: 'textArea',
          span: 2
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
        ]
      },
      isSkeleton: false,
      maxNumberId: '', // 最大流水号id
      preLawCaseId: '' // 预立案id
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId', 'getUserInfo'])
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
      if (this.getUserInfo.user.deptId === '110') { // 如果是翔安区诉非联动中心
        this.detailData = {
          applyType2: 1
        }
        this.applyType2 = 1
      }
      await this.getCaseDetail()
      this.isSkeleton = false
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
          this.detailData.briefName = data.briefName
          this.detailData.applyType1 = 2
          this.detailData.applyType2 = 2
          if (this.getUserInfo.user.deptId === '110') { // 如果是翔安区诉非联动中心
            this.detailData.applyType2 = 1
            this.applyType2 = 1
          }
        }
      })
    },
    submit() {
      const obj = this.$refs.description1.getDate()
      if (!obj.flag) {
        return
      }
      const data = obj.data
      let type = 3
      if (this.applyType1 === 1) {
        type = 1
      } else {
        if (this.applyType2 === 1) {
          type = 2
        } else {
          type = 3
        }
      }
      if (type === 3) {
        if (!this.$refs.caseNo.year) {
          this.$message.error('请先选择案号年份')
          return
        }
        if (!this.$refs.caseNo.num) {
          this.$message.error('请先获取案号')
          return
        }
      }
      if (type === 2) {
        if (!data.childDeptId) {
          this.$message.error('请先选择下级单位')
          return
        }
      }
      const params = {
        sfLawCaseId: this.getSfLawCaseId,
        applyType: type
      }
      if (type === 2) {
        params.childDeptId = data.childDeptId
      }
      if (type === 3) {
        params.prefixStr = `(${this.$refs.caseNo.year})${this.$refs.caseNo.typeLabel}`
        params.number = this.$refs.caseNo.num
        params.year = this.$refs.caseNo.year
        params.briefId = data.brief
      }
      params.initialCaseNo = data.initialCaseNo
      submitCase(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          if (type === 3) {
            const path = '/sfCaseManage/assign'
            this.$router.push(path)
            this.$store.dispatch('DelTags', '/sfaddCase/step4')
            this.$store.commit('ADD_TAGVIEWLIST', path)
          } else {
            const path = '/sfCaseManage/review'
            this.$router.push(path)
            this.$store.dispatch('DelTags', '/sfaddCase/step4')
            this.$store.commit('ADD_TAGVIEWLIST', path)
          }
        }
      })
    },
    // 上一步
    prev() {
      const path = '/sfaddCase/step3'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/sfaddCase/step4')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    change(e) {
      if (e.type === 'applyType2') {
        this.applyType2 = e.value
      }
      if (e.type === 'applyType1') {
        this.applyType1 = e.value
      }
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
.btn-wrapper {
  background-color: #fff;
}
</style>
