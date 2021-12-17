<template>
  <div>
    <NextMediating ref="NextMediatingShow" :is-whole="true" />
    <NextReAssignSeverd ref="NextReAssignSeverdShow" />
    <NextServicing ref="NextServicingShow" />
    <NextPreientation ref="NextPreientationShow" />
  </div>
</template>
<script>
import NextMediating from '@/views/mediating/Companents/NextProcess'
import NextReAssignSeverd from '@/views/SeverdManage/reAssignSeverd/components/next.vue'
import NextServicing from '@/views/SeverdManage/servicing/components/next.vue'
import NextPreientation from '@/components/NextStep'
export default {
  components: {
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
