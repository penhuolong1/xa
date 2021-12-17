<template>
  <!-- 部门信息 -->
  <span class="w-full">
    <FormItem v-if="isForm" ref="formItem" :label="label">
      <Select v-decorator="[field, formOption]" :filter-option="filterOption" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
        <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else :default-value="defaultValue" :filter-option="filterOption" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { queryDepartment } from '@/api/addCase/index'

import { mapGetters } from 'vuex'
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
    form: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
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
      default: '请选择'
    },
    isNoReset: { // 切换当事人的时候不需要情况以有的选择
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getLitigantId'])
  },
  watch: {
    getLitigantId() {
      this.getData()
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      // 获取当事人地址
      queryDepartment().then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    },
    change(e) {
      this.$emit('change', e)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style scoped lang="scss">

</style>
