<template>
  <!-- 案由 -->
  <span class="w-full">
    <FormItem v-if="isForm" ref="formItem" :label="label">
      <Select v-decorator="[field, formOption]" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
        <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else :default-value="defaultValue" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { listPlace } from '@/api/sfAddcase/index'
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
    type: { // 1法院 2诉非
      type: Number,
      default: 2
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
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      listPlace({ type: this.type }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data
        }
      })
    },
    change(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped lang="less">

</style>
