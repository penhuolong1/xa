<template>
  <div>
    <FormItem :label="label">
      <div class="wrapper">
        <DatePicker
          v-decorator="[field, formOption]"
          :placeholder="placeholder"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 240px"
          @change="changetime"
        />
        <div class="word">才能送达</div>
      </div>
    </FormItem>
  </div>
</template>

<script>
import { DatePicker, Form } from 'ant-design-vue'

export default {
  components: {
    DatePicker,
    FormItem: Form.Item
  },
  props: {
    label: {
      type: String,
      default: '保全期至'
    },
    field: {
      type: String,
      default: ''
    },
    formOption: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
  },
  methods: {
    changetime(e) {
      this.$emit('time', e)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper{
  // min-width: 300px;
  display: flex;
.word{
  min-width: 70px;
  margin-left: 10px;
  display: inline-flex;
}
}
</style>
