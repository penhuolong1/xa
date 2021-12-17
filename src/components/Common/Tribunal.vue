<template>
  <!-- 调解地点 -->
  <FormItem :label="label">
    <Select v-decorator="[field, formOption]" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in tribunalList" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </FormItem>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { listTribunal } from '@/api/schedule/index.js'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {
    label: {
      type: String,
      default: '调解地点'
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
      default: ''
    },
    type: { // 1开庭地点 2诉前地点
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tribunalList: []
    }
  },
  watch: {
    type() {
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
      // 获取调解地点
      listTribunal({ type: this.type }).then(({ code, data }) => {
        if (code === 200) {
          this.tribunalList = data
        }
      })
    },
    change(e) {
      this.$emit('change', e, this.tribunalList)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
