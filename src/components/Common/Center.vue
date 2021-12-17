<template>
  <!-- 分流中心信息 -->
  <span class="w-full">
    <FormItem v-if="isForm" :label="label">
      <Select v-decorator="[field, formOption]" :placeholder="placeholder" :disabled="disabled" allow-clear show-search mode="multiple" @change="change">
        <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else :default-value="defaultValue" :placeholder="placeholder" :disabled="disabled" allow-clear mode="multiple" show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { agency } from '@/api/team/index.js'
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
    multiple: { // 是否可多选
      type: Boolean,
      default: true
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
      default: '请选择分流中心'
    },
    defaultValue: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      // 获取分流中心数据
      agency().then(({ code, data }) => {
        if (code === 200) {
          this.list = []
          this.generateList(data)
        }
      })
    },
    change(e) {
      this.$emit('change', e)
      this.$emit('input', e)
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const id = node.id
        this.list.push({ id, name: node.name })
        if (node.containDepartment) {
          this.generateList(node.containDepartment)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
