<template>
  <!-- 工作人员信息(法官) -->
  <span class="w-full">
    <FormItem v-if="isForm" :label="label">
      <Select v-decorator="[field, formOption]" :filter-option="filterOption" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
        <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else v-model="valueLabel" :default-value="defaultValue" :filter-option="filterOption" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { queryJudge } from '@/api/addCase/index.js'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {
    isForm: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formOption: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    defaultValue: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    type: { // 类型 1法官 2 书记员 3法官助理 4送达员 5速录员 6预立案审批人 7 收案登记人 8 送达组长 9上门送达员 10 统筹员
      type: Number,
      default: null
    },
    isAppoint: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      valueLabel: ''
    }
  },
  watch: {
    value() {
      this.valueLabel = this.value || this.defaultValue
    }
  },
  created() {
    this.getData()
    this.valueLabel = this.value || this.defaultValue
  },
  mounted() {

  },
  methods: {
    getData() {
      // 获取当事人信息
      const params = {
        type: this.type
      }
      queryJudge(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    change(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
