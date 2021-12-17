<template>
  <div>
    <Sticky :sticky-top="119" :z-index="100">
      <div class="step-box">
        <Steps class="step enter-X" progress-dot :current="current">
          <Step title="案件基本信息" />
          <Step title="当事人基本信息" />
          <Step title="卷宗信息" />
          <Step v-if="addCaseType!= 1" title="确认预立案" />
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
          'addCaseStep1': 0,
          'addCaseStep2': 1,
          'addCaseStep3': 2,
          'addCaseStep4': 3
        }
        this.current = stepMap[this.$route.name]
      }
    }
  },
  created() {
    const stepMap = {
      'addCaseStep1': 0,
      'addCaseStep2': 1,
      'addCaseStep3': 2,
      'addCaseStep4': 3
    }
    this.current = stepMap[this.$route.name]
    this.addCaseType = localStorage.getItem('addCaseType')
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
