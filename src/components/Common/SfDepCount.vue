<template>
  <!-- 据参数查询对应部门 -->
  <span class="w-full">
    <FormItem v-if="isForm" ref="formItem" :label="label">
      <Select v-decorator="[field, formOption]" :placeholder="placeholder" :filter-option="filterOption" :disabled="disabled" allow-clear show-search @change="change">
        <SelectOption v-for="item in list" :key="item.deptId" :value="item.deptId">{{ item.deptName }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else :default-value="defaultValue" :placeholder="placeholder" :filter-option="filterOption" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.deptId" :value="item.deptId">{{ item.deptName }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { listDeptListByArgs } from '@/api/sfAddcase/index'

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
    },
    value: {
      type: String,
      default: undefined
    },
    codes: {
      type: String,
      default: '' // 10中心11单位12街道13组织 多个逗号隔开
    },
    ancestorId: { // 上级部门id
      type: String,
      default: ''
    },
    isNeedParentId: { // 是否需要上级部门id
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
  },
  watch: {
    ancestorId() {
      this.getData()
      if (this.isForm) {
        this.form.setFieldsValue({
          [this.field]: undefined
        })
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      // 获取下级部门
      if (this.isNeedParentId && !this.ancestorId) {
        this.list = []
        return
      }
      this.list = []
      listDeptListByArgs({ ancestorId: this.ancestorId, codes: this.codes }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
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
