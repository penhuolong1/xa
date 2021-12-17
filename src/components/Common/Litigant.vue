<template>
  <!-- 当事人 -->
  <FormItem :label="label">
    <Select v-decorator="[field, formOption]" :placeholder="placeholder" :disabled="disabled" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </FormItem>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { litigantNameByCaseId } from '@/api/schedule/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {
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
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getData() {
      // 获取当事人信息
      litigantNameByCaseId({ caseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
        }
      })
    },
    change(e) {
      this.$store.commit('SET_LITIGANTID', e)
      this.$emit('change', e)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
