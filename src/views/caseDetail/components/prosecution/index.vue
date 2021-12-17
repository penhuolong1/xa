<template>
  <div class="prosecution-wrapper">
    <div class="tab-btn-wrapper">
      <RadioGroup v-model="type" @click.stop>
        <RadioButton value="1">文书记录</RadioButton>
        <!-- <RadioButton value="2">举证质证记录</RadioButton> -->
        <RadioButton value="3">诉前程序记录</RadioButton>
        <RadioButton value="4">联动记录</RadioButton>
      </RadioGroup>
    </div>
    <!-- 文书记录 -->
    <Book v-if="type=='1'" />
    <!-- 举证质证记录 -->
    <!-- <Evidence v-if="type=='2'" /> -->
    <!-- 诉前程序记录 -->
    <Prosecution v-if="type=='3'" />
    <!-- 联动记录 -->
    <Collaborate v-if="type=='4'" />
  </div>
</template>

<script>
import Book from './components/book/index.vue'
import Collaborate from './components/collaborate/index.vue'
import Evidence from './components/evidence1/index.vue'
import Prosecution from './components/prosecution/index.vue'
import { Radio } from 'ant-design-vue'
export default {
  components: {
    Book,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button,
    Collaborate,
    Evidence,
    Prosecution
  },
  props: {
  },
  data() {
    return {
      type: '1'
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
.prosecution-wrapper {
  position: relative;
  .tab-btn-wrapper {
    position: absolute;
    z-index: 10;
  }
}
</style>
