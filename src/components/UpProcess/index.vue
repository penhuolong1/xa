<template>
  <!-- 上一流程-->
  <FormItem :label="label">
    <Input :placeholder="placeholder" :disabled="disabled" />
  </FormItem>
</template>

<script>
import { Input, Form } from 'ant-design-vue'
import { stateTop } from '@/api/freeze/index.js'
export default {
  components: {
    FormItem: Form.Item,
    Input: Input
  },
  props: {
    label: {
      type: String,
      default: '上一流程'
    }
  },
  data() {
    return {
      tribunalList: [],
      placeholder: '',
      disabled: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getProcess(id) {
      // 获取调解地点
      stateTop(id).then(({ code, msg }) => {
        if (code === 200) {
          this.placeholder = msg
        } else {
          this.placeholder = ''
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
