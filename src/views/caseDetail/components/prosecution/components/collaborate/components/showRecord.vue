<template>
  <div>
    <Modal
      v-model="recordshow"
      title="查看联动记录"
      :mask-closable="false"
      style="width:600px"
    >
      <template slot="footer">
        <Button key="back" @click="recordshow=false">
          取消
        </Button>
        <Button key="submit" type="primary" :loading="loading" @click="recordConfirm">
          确定
        </Button>
      </template>
      <Collapse v-model="activeKey" accordion>
        <CollapsePanel v-for="(item,index) in recordList" :key="index" :disabled="false">
          <template slot="header">
            <span>第{{ index+1 }}次联动</span>
          </template>
          <Descriptions bordered>
            <DescriptionsItem :span="3" label="发起者">{{ item.askPerson }}</DescriptionsItem>
            <DescriptionsItem :span="3" label="发起时间">{{ item.askSendTime }}</DescriptionsItem>
            <DescriptionsItem :span="3" label="联动事由">
              <a @click="preview(item.answerFile)">
                {{ item.answerFile.split('/').slice(-1).toString() }}
              </a>
            </DescriptionsItem>
            <DescriptionsItem :span="3" label="答复时间">{{ item.answerTime }}</DescriptionsItem>
            <DescriptionsItem :span="3" label="答复">{{ item.answerContent }}</DescriptionsItem>
          </Descriptions>
        </Collapsepanel>

      </Collapse>
    </Modal>
    <Preview ref="preview" :file-list="fileList" />

  </div>
</template>
<script>
// import Upload from '@/components/Upload/index.vue'
import { Modal, Button, Collapse, Descriptions } from 'ant-design-vue'
import { viewAnswer } from '@/api/freeze/index.js'
import moment from 'moment'
import Preview from '@/components/Preview/index'

export default {
  components: {
    // Upload,
    Modal,
    Button,
    Descriptions,
    DescriptionsItem: Descriptions.Item,
    Collapse,
    CollapsePanel: Collapse.Panel,
    Preview
  },
  props: {
    param: {
      type: Object,
      default: () => {}
    },
    selectKey: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      recordshow: false,
      loading: false,
      askSendTime: '',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultFileList: [],
      activeKey: [],
      recordList: [],
      fileList: []
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    preview(file) {
      console.log(file)
      this.fileList = []
      this.$refs.preview.show(file.answerFile, [])
    },
    show(id) {
      console.log(id)
      this.recordshow = true
      const params = {
        pageSize: 20,
        pageNumber: 1
      }
      viewAnswer(params, id).then(res => {
        this.recordList = res.data.searchResult
        this.recordList = res.data.searchResult.map((item, index) => {
          item.askSendTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          item.answerTime = moment(item.answerTime).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
      })
    },
    recordConfirm() {}
  }
}
</script>

<style scoped lang="less">
</style>
