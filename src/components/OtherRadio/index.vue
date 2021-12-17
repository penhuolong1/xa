<template>
  <div class="radio-wrapper" :class="className">
    <div class="label">{{ label }}:</div>
    <RadioGroup v-model="val" :default-value="defaultValue" @change="select">
      <RadioButton v-for="(item, index) in list" :key="index" :value="item.value">
        {{ item.label }}
      </RadioButton>
    </RadioGroup>
  </div>
</template>

<script>
import { Radio } from 'ant-design-vue'
export default {
  components: {
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button
  },
  props: {
    defaultValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: null
    },
    className: {
      type: String,
      default: 'form-tiem'
    }
  },
  data() {
    return {
      val: null
    }
  },
  watch: {
    val() {
      this.$emit('input', this.val)
    },
    defaultValue() {
      this.val = this.defaultValue
    },
    value() {
      this.val = this.value
    }
  },
  created() {
    this.val = this.defaultValue
  },
  mounted() {
  },
  methods: {
    select(e) {
      this.$emit('input', e.target.value)
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style scoped lang="less">
@radio-color: #65B7F3;
.radio-wrapper {
  display: inline-flex;
  margin-right: 20px;
  align-items: center;
  margin-top: @space-default;
  &.form-item-1 {
     width: 240px;
  }
  &.form-item-2 {
    width: 500px;
  }
  &.form-item-3 {
    width: 760px;
  }
  &.form-item-4 {
    width: 1000px;
  }
  &.form-item-5 {
    width: 100%;
  }
  .label {
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-size: 15px;
  }
  /deep/.ant-radio-group {
    display: flex;
  }
  /deep/.ant-radio-button-wrapper {
    display: flex;
    align-items: center;
    border: none;
  }
  /deep/.ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent;
  }
  /deep/.ant-radio-button-wrapper {
    height: 28px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.8);
  }
  /deep/.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: #fff;
    background-color: @theme-color;
    border-radius: 2px;
    box-shadow: -1px 0 0 0 @theme-color;
  }
}
</style>
