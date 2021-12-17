<template>
  <div class="case-handle-wrapper">
    <div class="case-handle-wrapper-left">
      <h3 class="title" />
      <CaseHandleForm v-if="getSfCaseInfo.state==='待审核' && getIsDeal === 0 && getUserInfo.loginRole.roleKey !== roleTypeMap['调解员']" :is-deal="isDeal" @done="getInfo" />
      <AssignContent v-if="getSfCaseInfo.state==='待指派调解' && getIsDeal === 0 && getUserInfo.loginRole.roleKey !== roleTypeMap['调解员']" :is-deal="isDeal" @done="getInfo" />
      <MediationForm v-if="getSfCaseInfo.state==='调解中' && getIsDeal === 0" :is-deal="isDeal" @done="getInfo" />  <!-- 待接收 -->
      <MediationForm1 v-if="getSfCaseInfo.state==='调解中' && getIsDeal === 1" :is-deal="isDeal" @done="getInfo" /> <!-- 已接收 -->
      <MoveCourt v-if="getSfCaseInfo.state==='调解中' && getIsDeal === 2" :is-deal="isDeal" @done="getInfo" /> <!-- 赋强 -->
      <MoveCourtSuccess v-if="getSfCaseInfo.state==='申请司法确认' || getSfCaseInfo.state === '申请立案'" :is-deal="isDeal" @done="getInfo" /> <!-- 移送法院成功 -->
      <Empty v-if="getSfCaseInfo.state==='已结案'" class="empty" description="已结案" />
      <Empty v-if="getSfCaseInfo.state==='待指派调解' && getUserInfo.loginRole.roleKey === roleTypeMap['调解员']" class="empty" description="已退回" /> <!-- 调解员退回显示 -->
      <Empty v-if="getSfCaseInfo.state==='调解中' && getUserInfo.loginRole.roleKey !== roleTypeMap['调解员']" class="empty" description="已指派" /> <!-- 单位或者组织下发了调解员显示 -->
      <Empty v-if="getSfCaseInfo.state==='待审核' && getIsDeal === 5" class="empty" description="已下发" />
    </div>
    <div class="case-handle-wrapper-right">
      <h3 class="title">办理日志</h3>
      <CaseHandleLog />
    </div>
  </div>
</template>

<script>
import CaseHandleForm from './caseHandleForm/index.vue'
import AssignContent from './assignContent/index.vue'
import MediationForm from './mediationForm/index.vue'
import MediationForm1 from './mediationForm1/index.vue'
import CaseHandleLog from './caseHandleLog/index.vue'
import MoveCourt from './moveCourt/index.vue'
import MoveCourtSuccess from './moveCourtSuccess/index.vue'
import { roleTypeMap } from '@/type/index.js'
import { Empty } from 'ant-design-vue'
import { getHandleOfCase, operateLogOfCase } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    CaseHandleForm,
    AssignContent,
    MediationForm,
    MoveCourtSuccess,
    MediationForm1,
    CaseHandleLog,
    MoveCourt,
    Empty
  },
  props: {

  },
  data() {
    return {
      isDeal: 0,
      roleTypeMap
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId', 'getSfCaseInfo', 'getUserInfo', 'getIsDeal'])
  },
  created() {
    this.getInfo()
  },
  mounted() {

  },
  methods: {
    getInfo() {
      this.$store.dispatch('GetHandleOfCase')
      this.$store.dispatch('GetOperateLogOfCase')
    }
  }
}
</script>

<style scoped lang="less">
.case-handle-wrapper {
  display: flex;
  .case-handle-wrapper-left {
    flex: 1;
    padding-right: 20px;
  }
  .case-handle-wrapper-right {
    flex: 1;
    min-height: 600px;
    padding-left: 20px;
    border-left: 1px solid #e8e8e8;
  }
  .title {
    color: @theme-color;
    font-size: 16px;
    font-weight: bolder;
  }
}
.empty {
  margin-top: 50px;
  margin-bottom: 50px;
}
.empty-wrapper {
  width: 100%;
  border: 1px solid #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
