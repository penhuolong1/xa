<template>
  <div class="case-handle-wrapper">
    <!-- 联动 -->
    <div class="case-handle-wrapper-left">
      <RadioGroup v-model="nowIndex" @change="changeColl">
        <RadioButton v-for="(item, index) in getTeamList" :key="index" :value="index">联动{{ index+1 }}</RadioButton>
      </RadioGroup>
      <ApplyCollForm v-if="getTeamList[0].orInitiator" />
      <AcceptCollForm v-if="!getTeamList[0].orInitiator" />
    </div>
    <div class="case-handle-wrapper-right">
      <h3 class="title">联动日志</h3>
      <CollLog />
    </div>
  </div>
</template>

<script>
import { Radio } from 'ant-design-vue'
import { operateLogOfCase } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
import ApplyCollForm from './applyCollForm/index.vue'
import CollLog from './collLog/index.vue'
import AcceptCollForm from './acceptCollForm/index.vue'
export default {
  components: {
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    ApplyCollForm,
    AcceptCollForm,
    CollLog
  },
  props: {

  },
  data() {
    return {
      nowIndex: 0
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId', 'getSfCaseInfo', 'getTeamList'])
  },
  created() {
    console.log(this.getTeamList)
  },
  mounted() {

  },
  methods: {
    changeColl(e) {
      const val = e.target.value
      this.$store.commit('SET_TEAMINFO', this.getTeamList[val])
      this.$store.commit('SET_TEAMNUM', val)
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
