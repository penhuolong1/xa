<template>
  <div>
    <RadioGroup v-model="type" class="radio" button-style="solid">
      <RadioButton :value="1">涉诉案件</RadioButton>
      <RadioButton :value="2">本次送达关联</RadioButton>
    </RadioGroup>
    <InvolveCase v-show="type === 1" />
    <SendAssociate v-show="type === 2" />
  </div>
</template>

<script>
import InvolveCase from './components/involveCase.vue'
import SendAssociate from './components/sendAssociate.vue'
import { Radio } from 'ant-design-vue'
export default {
  components: {
    InvolveCase,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    SendAssociate
  },
  props: {

  },
  data() {
    return {
      type: 1
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.radio {
  margin-bottom: 10px;
}
</style>
