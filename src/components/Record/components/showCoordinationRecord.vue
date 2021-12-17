<template>
  <div>
    <Modal
      v-model="recordshow"
      title=""
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
          <template slot="title">
            <span>第{{ index+1 }}次联动</span>
          </template>
          <Descriptions bordered>
            <DescriptionsItem label="发起者">{{ item.askPerson }}</DescriptionsItem>
          </Descriptions>
          <Descriptions bordered>
            <DescriptionsItem label="发起时间">{{ item.askSendTime }}</DescriptionsItem>
          </Descriptions>
          <Descriptions bordered>
            <DescriptionsItem label="联动事由">{{ item.askFile }}</DescriptionsItem>
          </Descriptions>
          <Descriptions bordered>
            <DescriptionsItem label="答复时间">{{ item.answerTime }}</DescriptionsItem>
          </Descriptions>
          <Descriptions bordered>
            <DescriptionsItem label="答复">{{ item.answerContent }}</DescriptionsItem>
          </Descriptions>
        </Collapsepanel>

      </Collapse>
    </Modal>
  </div>
</template>
<script>
import Upload from '@/components/Upload/index.vue'
import { Modal, Button, Form, DatePicker, Input, Collapse, Descriptions } from 'ant-design-vue'
import { viewAnswer } from '@/api/freeze/index.js'

export default {
  components: {
    Upload,
    Modal,
    Button,
    Descriptions,
    DescriptionsItem: Descriptions.Item,
    Collapse,
    CollapsePanel: Collapse.Panel
  },
  props: {
    param: {
      type: Object,
      default: () => {}
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      recordshow: false,
      loading: false,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      defaultFileList: [],
      activeKey: [],
      recordList: []

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show() {
      this.recordshow = true
      const params = {
        pageSize: 20,
        pageNumber: 1
      }
      viewAnswer(params, this.selectedRows[0].id).then(res => {
        this.recordList = res.data.searchResult
      })
    },
    recordConfirm() {},
    showRecord() {}
  }
}
</script>

<style scoped lang="less">
</style>
