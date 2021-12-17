<template>
  <div>
    <NextMediating ref="NextMediatingShow" />
    <NextReAssignSeverd ref="NextReAssignSeverdShow" />
    <NextServicing ref="NextServicing" />
  </div>
</template>
<script>
import { Modal } from 'ant-design-vue'
import NextMediating from '@/views/mediating/Companents/NextProcess'
import NextReAssignSeverd from '@/views/SeverdManage/reAssignSeverd/components/next.vue'
import NextServicing from '@/views/SeverdManage/servicing/components/next.vue'
import NextPreientation from '@/components/NextStep'
export default {
  components: {
    Modal,
    NextMediating, // 调解中转下一流程
    NextReAssignSeverd, // 待指派送达员转下一流程
    NextServicing, // 送达中转下一流程
    NextPreientation // 诉前调查中转下一流程

  },
  props: {
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
</style>
