<template>
  <!-- 诉非调解员 -->
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
import { listByDept } from '@/api/sfAddcase/index'
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
    },
    value: {
      type: String,
      default: undefined
    },
    deptId: { // 上级id
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
    ...mapGetters(['getUserInfo'])
  },
  watch: {
    deptId() {
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
      if (this.isForm) {
        this.form.setFieldsValue({
          [this.field]: undefined
        })
      }
      const userId = this.deptId || this.getUserInfo.user.deptId
      // 获取调解员
      this.list = []
      listByDept({ deptId: userId }).then(({ code, data }) => {
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

<style scoped lang="scss">

</style>
