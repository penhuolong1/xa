<template>
  <!-- 调解相关得组织单位人员 -->
  <span class="w-full">
    <FormItem v-if="isForm" ref="formItem" :label="label">
      <Select v-decorator="[field, formOption]" :placeholder="placeholder" :filter-option="filterOption" :disabled="disabled" allow-clear show-search @change="change">
        <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
      </Select>
    </FormItem>
    <Select v-else v-model="value1" :default-value="defaultValue" :placeholder="placeholder" :disabled="disabled" :filter-option="filterOption" allow-clear show-search @change="change">
      <SelectOption v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</SelectOption>
    </Select>
  </span>
</template>

<script>
import { Select, Form } from 'ant-design-vue'
import { listDeptListByArgs, listByDept } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    FormItem: Form.Item,
    Select,
    SelectOption: Select.Option
  },
  props: {
    medType: {
      type: String, // unit单位 organization组织 people调解员 unitAndOrg 单位和组织
      default: 'unit'
    },
    isForm: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => {}
    },
    ancestorId: { // 上级单位id
      type: String,
      default: ''
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
    }
  },
  data() {
    return {
      list: [],
      value1: undefined
    }
  },
  computed: {
    ...mapGetters(['getUnit', 'getOrgId'])
  },
  watch: {
    getUnit() {
      if (this.medType !== 'unit') {
        this.value1 = undefined
        this.list = []
        if (this.medType === 'organization') {
          this.getOrg()
        }
      }
    },
    getOrgId() {
      if (this.medType === 'people') {
        this.value1 = undefined
        this.list = []
        this.getPeo()
      }
    },
    value() {
      if (!this.value) {
        this.value1 = this.value
      }
    }
  },
  created() {
    this.getData()
    this.value1 = this.value
  },
  mounted() {

  },
  methods: {
    getData() {
      if (this.medType === 'people') { // 调解员
        this.getPeo()
      }
      if (this.medType === 'unit') { // 调解单位
        this.getUnitList()
      }
      if (this.medType === 'organization') { // 调解组织
        this.getOrg()
      }
      if (this.medType === 'unitAndOrg') { // 单位和组织
        this.getUnitAndOrg()
      }
    },
    // 获取单位和组织
    getUnitAndOrg() {
      const params = {
        codes: '10,11,12,13,14',
        ancestorId: this.ancestorId || ''
      }
      listDeptListByArgs(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              id: item.deptId,
              name: item.deptName
            }
          })
        }
      })
    },
    // 获取调解单位
    getUnitList() {
      const params = {
        codes: '10,11,12,13',
        ancestorId: this.ancestorId || ''
      }
      listDeptListByArgs(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              id: item.deptId,
              name: item.deptName
            }
          })
        }
      })
    },
    // 获取调解组织
    getOrg() {
      const params = {
        codes: '14',
        ancestorId: this.getUnit || ''
      }
      listDeptListByArgs(params).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              id: item.deptId,
              name: item.deptName
            }
          })
        }
      })
    },
    // 获取调解员
    getPeo() {
      const params = {
        deptId: this.getOrgId || this.getUnit
      }
      listByDept(params).then(({ code, data }) => {
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
      console.log(e)
      if (this.medType === 'unit') {
        this.$store.commit('SET_UNITID', e)
      }
      if (this.medType === 'organization') {
        this.$store.commit('SET_ORGID', e)
      }
      this.$emit('change', e)
      this.$emit('input', e)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
