<template>
  <div>
    <Modal
      v-model="visible"
      :title="'添加'+title"
      style="width:600px"
      :mask-closable="false"
      class="modal"
      @cancel="visible=false"
    >
      <div>
        <!-- <div class="item">是否添加{{ title }}并编辑!</div> -->
        <!-- <div class="item">同步创建诉前程序</div>
        <CheckboxGroup v-model="type">
          <Checkbox v-for="item in typeList" :key="item.id" :value="item.id">{{ item.name }}</Checkbox>
        </CheckboxGroup> -->
        <div class="form">
          <div class="label">文件:</div>
          <Upload ref="upload" :is-edit="true" action="/api/court/preRecord/upPreDipFile" :default-file-list="[]" show-type="data" />
        </div>
      </div>
      <template slot="footer">
        <Button @click="visible=false">
          取消
        </Button>
        <Button type="primary" :loading="loading1" @click="edit">
          编辑
        </Button>
        <Button type="primary" :loading="loading" @click="onConfirm">
          生成
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { Modal, Checkbox, Button } from 'ant-design-vue'
import { addPreDipRecord, updatePreDipRecord } from '@/api/book/index.js'
import { mapGetters } from 'vuex'
import { getPreviewUrl } from '@/api/common/index.js'
import Upload from '@/components/Upload/index.vue'

export default {
  components: {
    Modal,
    Button,
    Upload,
    Checkbox,
    CheckboxGroup: Checkbox.Group
  },
  props: {

  },
  data() {
    return {
      visible: false,
      type: [],
      loading: false,
      loading1: false,
      typeList: [
        {
          id: '现场调解',
          name: '现场调解'
        },
        {
          id: '电话调解',
          name: '电话调解'
        },
        {
          id: '异步调解',
          name: '异步调解'
        },
        {
          id: '视频调解',
          name: '视频调解'
        },
        {
          id: '诉前调查',
          name: '诉前调查'
        }
      ],
      title: '',
      fileId: '',
      isEdit: false
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
    show(title) {
      this.visible = true
      this.isEdit = false
      this.fileId = true
      this.title = title
    },
    onConfirm() {
      if (!this.isEdit) {
        let path = ''
        if (this.$refs.upload.fileList && this.$refs.upload.fileList.length > 0) {
          path = this.$refs.upload.fileList[0].data
        }
        const params = {
          lawCaseId: this.getLawCaseId,
          // preMediateTypeValue: this.type,
          dipName: this.title,
          dipPath: path
        }
        this.loading = true
        addPreDipRecord(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.visible = false
          }
        })
      } else {
        const params = {
          dipId: this.dipId,
          fileId: this.fileId
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
    },
    edit() {
      let path = ''
      if (this.$refs.upload.fileList && this.$refs.upload.fileList.length > 0) {
        path = this.$refs.upload.fileList[0].data
      }
      const params = {
        lawCaseId: this.getLawCaseId,
        // preMediateTypeValue: this.type,
        dipName: this.title,
        dipPath: path
      }
      const type = path.split('.').pop()
      const canEditFileTyps = ['doc', 'docx']
      if (path && canEditFileTyps.findIndex(item => item === type) === -1) {
        this.$message.error('只有doc,docx的文件可以在线编辑')
        return
      }
      this.loading1 = true
      addPreDipRecord(params).then(({ code, msg, data }) => {
        this.loading1 = false
        this.isEdit = true
        if (code === 200) {
          this.$message.success(msg)
          const url = data.path
          this.dipId = data.dipId
          getPreviewUrl(url, 'write').then(res => {
            if (res.code === 200) {
              window.open('/edit?id=' + res.data.token)
              this.fileId = res.data.token
              localStorage.setItem(res.data.token, res.data.wpsUrl)
              this.visible = false
            }
          })
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
}
</style>
