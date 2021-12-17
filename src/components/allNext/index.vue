<template>
  <div>
    <!-- 调解中 -->
    <NextMediating ref="NextMediatingShow" :is-whole="true" @done="getlist" />
    <!-- 待指派送达员 -->
    <NextReAssignSeverd ref="NextReAssignSeverdShow" :is-whole="true" :selected-rows="selectedRows" @refresh="getlist" />
    <!-- 送达中 -->
    <NextServicing ref="NextServicingShow" :is-whole="true" @done="getlist" />
    <!-- 诉前调查中、已立案待送达、预立案 -->
    <NextPreientation ref="NextPreientationShow" :is-whole="true" :select-key="selectedRows" @done="getlist" />
    <!-- 诉前调查中 -->
    <NextPreientation ref="next" :select-key="selectedRows" :is-whole="true" :next-list="nextList" @done="getlist" />
    <!-- 待正式立案 -->
    <NextWaitCase ref="NextWaitCaseShow" :select-key="selectedRows" @done="getList" />

  </div>
</template>
<script>

import NextMediating from '@/views/mediating/Companents/NextProcess'
import NextReAssignSeverd from '@/views/SeverdManage/reAssignSeverd/components/next.vue'
import NextServicing from '@/views/SeverdManage/servicing/components/next.vue'
import NextPreientation from '@/components/NextStep'
import NextWaitCase from '@/views/acceptCase/waitCase/components/addCaseNo.vue'

export default {
  components: {
    NextMediating, // 调解中
    NextReAssignSeverd, // 待指派送达员
    NextServicing, // 送达中
    NextPreientation, // 诉前调查中、已立案待送达、预立案
    NextWaitCase // 待正式立案

  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    },
    caseType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nextList: [
        {
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 7,
          label: '结案'
        }
      ]
    }
  },
  created() {
  },
  mounted() {
    this.getNextList()
  },
  methods: {
    // 转下一流程
    getNextList() {
      // 预立案
      if (this.caseType == '预立案') {
        this.nextList = [
          {
            value: 1,
            label: '送达中待指派'
          },
          {
            value: 2,
            label: '诉前程序'
          },
          {
            value: 3,
            label: '待正式立案'
          },
          {
            value: 4,
            label: '诉前销案'
          },
          {
            value: 5,
            label: '不予受理'
          }
        ]
      }
      // 已立案待送达
      if (this.caseType == '已立案待送达') {
        this.list = [{
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 7,
          label: '结案'
        }]
      }
    },
    getlist() {
      this.$emit('done')
    }
  }
}
</script>

<style scoped lang="less">
</style>
