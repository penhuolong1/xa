<template>
  <!-- 当事人电话 -->
  <FormItem ref="formItem" class="call-wrapper" :label="label">
    <Select v-if="isNeedCall" v-model="pre" allow-clear :class="isNeedCall ? 'pre':''" placeholder="请选择">
      <SelectOption value="9">9</SelectOption>
      <SelectOption value="90">90</SelectOption>
    </Select>
    <Select v-decorator="[field, formOption]" :class="isNeedCall ? 'pre-content':''" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.phone">{{ item.phone }}</SelectOption>
    </Select>
    <a v-if="isNeedCall" class="call-btn" @click="call">拨号</a>
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
    preValue: {
      type: String,
      default: '9'
    },
    isNeedCall: { // 是否需要拨打电话
      type: Boolean,
      default: false
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
      list: [],
      pre: '9',
      phone: ''
    }
  },
  computed: {
    ...mapGetters(['getLitigantId'])
  },
  watch: {
    getLitigantId() {
      this.getData()
    },
    preValue() {
      this.pre = this.preValue
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.pre = this.preValue
  },
  methods: {
    getData() {
      if (!this.getLitigantId) {
        return
      }
      // 获取当事人电话
      queryLitInfo({ litigantId: this.getLitigantId }).then(({ code, data }) => {
        if (!this.isNoReset) {
          this.form.setFieldsValue({
            [this.field]: undefined
          })
        }
        if (code === 200) {
          this.list = data.litigantPhones
        }
      })
    },
    change(e) {
      this.phone = e
      this.$emit('change', e)
    },
    // 拨打电话
    call() {
      if (!this.phone) {
        this.$message.error('请先选择电话号码')
        return
      }
      const phone = this.pre + this.phone
      // 调用iframe里面的方法进行拨打电话
      document.getElementById('callFrame').contentWindow.TV_StartDial(0, phone)
    }
  }
}
</script>

<style scoped lang="less">
.pre {
  width: 60px;
}
.pre-content {
  width: calc(100% - 60px)
}
.call-wrapper {
  position: relative;
  .call-btn {
    position: absolute;
    right: -40px;
  }
}
</style>
