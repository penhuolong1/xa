<template>
  <div />
</template>
<script>
import { changeProcedures } from '@/api/freeze/index.js'

export default {
  components: {

  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      istransfer: false,
      sendProcessIds: [],
      loading: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.sendProcessIds = []
      this.selectedRows.map((item, index) => {
        this.sendProcessIds.push(item.SPid)
      })
      console.log(this.sendProcessIds)
      this.$confirm({
        title: '您确定对选中的案件转普吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sendProcessIds: this.sendProcessIds
          }
          changeProcedures(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.sendProcessIds = []
              this.$emit('refresh')
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
