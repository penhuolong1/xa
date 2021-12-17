<template>
  <Modal
    title="引用卷宗"
    :visible="visible"
    width="80%"
    :mask-closable="false"
    @cancel="visible = false"
  >
    <Book ref="book" />
    <div slot="footer" class="footer">
      <Button @click="handleCancel">
        取消
      </Button>
      <Button type="primary" @click="handleOk">
        确定
      </Button>
    </div>
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import Book from '@/components/Book/index'
export default {
  components: {
    Modal,
    Book,
    Button
  },
  props: {

  },
  data() {
    return {
      visible: false
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    handleOk() {
      const selectIds = this.$refs.book.$refs.content.checkList
      const files = this.$refs.book.$refs.content.list
      if (!selectIds || selectIds.length === 0) {
        this.$message.error('请先选择文书')
        return
      }
      const typs = ['png', 'jpg', 'pdf']
      const selectFiles = files.filter(item => {
        return selectIds.findIndex(item1 => item1 === item.id) !== -1
      })
      let flag = false
      selectFiles.forEach(item => {
        const fileType = item.path.split('.').pop().toLowerCase()
        if (typs.indexOf(fileType) === -1) {
          flag = true
        }
      })
      if (flag) {
        this.$message.error('只能选择pdf和图片格式的文书')
        return
      }
      const obj = {
        selectIds,
        selectFiles
      }
      this.visible = false
      this.$emit('done', obj)
    },
    handleCancel() {
      this.visible = false
    },
    show() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">

</style>
