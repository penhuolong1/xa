<template>
  <div>
    <Modal
      v-model="visible"
      title="修改文书标题"
      style="width:600px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <div>
        <div class="form">
          <div class="label">文书名:</div>
          <Input v-model="title" class="input" placeholder="请输入" />
        </div>
      </div>
      <template slot="footer">
        <Button @click="visible=false">
          取消
        </Button>
        <Button type="primary" :loading="loading" @click="onConfirm">
          确认
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Modal, Button, Input } from 'ant-design-vue'
import { updatePreDipRecord } from '@/api/book/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Modal,
    Button,
    Input
  },
  props: {

  },
  data() {
    return {
      visible: false,
      type: [],
      loading: false,
      info: {},
      title: ''
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    show(e) {
      this.info = e
      this.title = e.dipName
      this.visible = true
    },
    onConfirm() {
      const params = {
        dipId: this.info.dipId,
        // preMediateTypeValue: this.type,
        name: this.title
      }
      this.loading = true
      updatePreDipRecord(params).then(({ code, msg }) => {
        this.loading = false
        if (code === 200) {
          this.$message.success(msg)
          this.$emit('done')
          this.visible = false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.item {
  margin-bottom: 10px;
}
.form {
  display: flex;
  .label {
    line-height: 32px;
    margin-right: 10px;
  }
  .input {
    width: 300px;
  }
}
</style>
