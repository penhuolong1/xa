
<template>
  <div>
    <Modal
      v-model="ischange"
      title="修改"
      :mask-closable="false"
      width="480px"
    >
      <template slot="footer">
        <Button key="back" @click="ischange=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="changeConfirm()">
          确定
        </Button>
      </template>
      <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <FormItem label="联动事由">
          <TextArea
            v-decorator="[
              'reason',
            ]"
            :placeholder="placeholder"
          />
        </FormItem>
        <!-- <FormItem v-if="historyFile&&historyFile.length!=0" label="历史文件">
          <div v-for="item in historyFile" :key="item.path">
            <div v-if="item!=''" class="file">
              <a @click="preview(item)">{{ item.split('/').splice(-1).toString() }}</a>
              <Icon type="close-circle" @click="del(item)" />
            </div>

          </div>

        </FormItem> -->
        <!-- <FormItem label="上传文件">
          <Upload
            ref="uploadShow"
            v-decorator="[
              'reasonFilePath',
            ]"
            :data="params"
            :file-list="defaultFileList"
            :default-file-list="defaultFileList"
            action="/api/court/freeFile/uploadFreeFile"
            show-type="path"
          />
        </FormItem> -->
      </Form>
    </Modal>
    <Preview ref="preview" :file-list="fileList" />

  </div>
</template>
<script>
import { Button, Modal, Form, Input, Icon } from 'ant-design-vue'
import Upload from '@/components/Upload/index.vue'
import { updateTeam } from '@/api/sfAddcase/index.js'
import Preview from '@/components/Preview/index'

export default {
  components: {
    Button,
    Modal,
    Form,
    FormItem: Form.Item,
    Upload,
    TextArea: Input.TextArea,
    Icon,
    Preview
  },
  props: {
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ischange: false,
      placeholder: '',
      historyFile: [],
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultFileList: [],
      collaborativeCases: [],
      fileList: [],
      isFile: false,
      params: {
        index: 1
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.ischange = true
    },
    // 预览
    preview(path) {
      this.fileList = []
      this.$refs.preview.show(path, this.fileList)
    },
    // 删除历史文件
    del(item) {
      this.$confirm({
        title: '是否删除该文件',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.historyFile.splice(item, 1)
          console.log(this.historyFile)
        },
        onCancel() {}
      })
    },
    changeConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const form = this.form.getFieldsValue()
        const params = {
          ...form,
          id: this.selectedRows[0].teamId
        }
        this.loading = true
        updateTeam(params).then(({ code, msg }) => {
          this.loading = false
          if (code === 200) {
            this.$message.success(msg)
            this.ischange = false
            this.$emit('refresh')
            this.form.resetFields()
            this.$refs.uploadShow.reset()
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.file{
  display: flex;
  justify-content: center;
  align-items: center;
  a{
    display:block;
    min-width: 200px;
    #ellipsis();
  }
  /deep/.anticon {
    margin-left: 5px;
  }
}
</style>
