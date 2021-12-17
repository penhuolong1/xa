<template>
  <RangePicker
    v-model="time"
    :mode="['month','month']"
    value-format="YYYY-MM"
    format="YYYY-MM"
    :open="isopen"
    @panelChange="change"
    @openChange="openChange"
  />
</template>

<script>
import { DatePicker } from 'ant-design-vue'
export default {
  components: {
    RangePicker: DatePicker.RangePicker
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      time: null,
      isopen: false
    }
  },
  watch: {
    value() {
      if (this.value && this.value.length > 0) {
        this.time = this.value
      }
    }
  },
  created() {
    if (this.value && this.value.length > 0) {
      this.time = this.value
    }
  },
  mounted() {

  },
  methods: {
    openChange(status) {
      if (status) {
        this.isopen = true
      } else {
        this.isopen = false
      }
    },
    change(val) {
      if (val && val.length > 0) {
        this.time = val.map(item => item.format('YYYY-MM'))
      } else {
        this.time = null
      }
      this.$emit('change', this.time)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
