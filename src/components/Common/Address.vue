<template>
  <!-- 当事人地址 -->
  <FormItem ref="formItem" :label="label">
    <Select v-decorator="[field, formOption]" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.address">{{ item.address }}</SelectOption>
    </Select>
  </FormItem>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { queryLitInfo } from '@/api/addCase/index'

import { mapGetters } from 'vuex'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {
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
      default: ''
    },
    isNoReset: { // 切换当事人的时候不需要情况以有的选择
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
      if (!this.getLitigantId) {
        return
      }
      // 获取当事人地址
      queryLitInfo({ litigantId: this.getLitigantId }).then(({ code, data }) => {
        if (!this.isNoReset) {
          this.form.setFieldsValue({
            [this.field]: undefined
          })
        }
        if (code === 200) {
          this.list = data.litigantAddresses
        }
      })
    },
    change(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
