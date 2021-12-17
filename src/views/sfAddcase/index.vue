<template>
  <div>
    <Sticky :sticky-top="119">
      <div class="step-box">
        <Steps class="step enter-X" progress-dot :current="current">
          <Step title="纠纷基本信息" />
          <Step title="当事人基本信息" />
          <Step title="卷宗信息" />
          <Step title="确认申请" />
        </Steps>
        <Divider />
      </div>
    </Sticky>
    <router-view />
  </div>
</template>

<script>
import { Steps, Divider } from 'ant-design-vue'
import Sticky from '@/components/Sticky/index.vue'
export default {
  components: {
    Steps,
    Step: Steps.Step,
    Divider,
    Sticky
  },
  props: {

  },
  data() {
    return {
      current: 0,
      addCaseType: 0 // 0正常添加案件  1 已立案待送达添加案件
    }
  },
  watch: {
    '$route.name': {
      handler() {
        const stepMap = {
          'sfAddCaseStep1': 0,
          'sfAddCaseStep2': 1,
          'sfAddCaseStep3': 2,
          'sfAddCaseStep4': 3
        }
        this.current = stepMap[this.$route.name]
      }
    }
  },
  created() {
    const stepMap = {
      'sfAddCaseStep1': 0,
      'sfAddCaseStep2': 1,
      'sfAddCaseStep3': 2,
      'sfAddCaseStep4': 3
    }
    this.current = stepMap[this.$route.name]
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
/deep/.ant-steps {
  margin-top: 24px;
}
.step {
  background-color: #fff;
}
.step-box {
  background-color: #fff;
  overflow: hidden;
}
</style>
