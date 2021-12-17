<template>
  <div class="wrapper">
    <div class="header enter-X">
      <Button type="org" @click="addEvidence">添加</Button>
      <Button type="danger" @click="del">删除</Button>
      <Button type="green">进入调解室</Button>
    </div>
    <div class="sub-header">
      <div class="text">
        举证: {{ obj.startDateJz }} 截止日期: {{ obj.endDateJz }}
      </div>
      <Button v-if="!obj.endFlag" type="primary" @click="endFlag">结束质证</Button>
    </div>
    <Table
      v-if="isTable"
      class="enter-X"
      :row-key="(record,index)=>{return record.id}"
      :columns="columns"
      :row-selection="rowSelection"
      :data-source="list"
      :scroll="{x: 1400}"
      :loading="loading"
      :pagination="false"
    >
      <div slot="expandedRowRender" slot-scope="record">
        <div class="sub-content">
          <Empty v-if="!record.qtwInfos || record.qtwInfos.length === 0" />
          <div v-for="item1 in record.qtwInfos" :key="item1.id">
            <div class="sub-title">
              <div class="name">{{ item1.operator }}</div>
              <div class="time">{{ item1.updateTime }}</div>
            </div>
            <Table
              :row-key="(record,index)=>{return record.id}"
              :columns="columns1"
              class="mb-5"
              :data-source="[item1]"
              :loading="loading"
              :pagination="false"
            >
              <div slot="truth" slot-scope="record1">
                <span :class="record1.truth ? 'agree':'noAgree'">{{ record1.truth ? '认可':'不认可' }}</span>
              </div>
              <div slot="legality" slot-scope="record1">
                <span :class="record1.legality ? 'agree':'noAgree'">{{ record1.legality ? '认可':'不认可' }}</span>
              </div>
              <div slot="relevance" slot-scope="record1">
                <span :class="record1.relevance ? 'agree':'noAgree'">{{ record1.relevance ? '认可':'不认可' }}</span>
              </div>
              <div slot="reason" slot-scope="record1">
                {{ record1.reason }}
                <a v-for="(file, idx) in record1.freeFileInfo" :key="idx" @click="preview1(file.filePath, record1)">{{ file.fileName }}</a>
              </div>
              <div slot="operate" slot-scope="record1">
                <a class="edit-btn mr-2.5" @click="edit(item1)">编辑</a>
                <a class="del-btn" @click="delVerification(record1)">删除</a>
              </div>
            </Table>
          </div>
        </div>
      </div>
      <div slot="path" slot-scope="record">
        <div v-if="record.fileInfos && record.fileInfos.length > 0">
          <a v-for="(item, index) in record.fileInfos" :key="index" @click="preview(item, record)">
            {{ item ? item.fileName : '' }}
            <br>
          </a>
        </div>
      </div>
      <div slot="review" slot-scope="record">
        <div>{{ record.result }}</div>
        <a v-if="!obj.endFlag" type="primary" @click="addReview(record)">{{ record.result ? '重新审核':'审核' }}</a>
      </div>
      <div slot="operate" slot-scope="record">
        <div>{{ record.peoples }}人已质证</div>
        <a v-if="!obj.endFlag" type="primary" @click="addVerification(record)">提醒意见</a>
      </div>
    </Table>
    <AddEvidence ref="addEvidence" @done="getList" />
    <Verification ref="verification" @done="getList" />
    <Review ref="review" @done="getList" />
    <Preview ref="preview" :file-list="fileList" />

  </div>
</template>

<script>
import { Button, Table, Empty } from 'ant-design-vue'
import AddEvidence from './addEvidence.vue'
import Verification from './verification.vue'
import Review from './review.vue'
import { queryQtwTime, endQtw, listQtwInfo, delListInfo, delQtwVerifyInfo } from '@/api/addCase/index.js'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    rowkey: 'index'
  },
  {
    title: '举证人',
    dataIndex: 'litigantName',
    rowkey: 'litigantName'
  },
  {
    title: '诉讼地位',
    dataIndex: 'litigantStatus',
    rowkey: 'litigantStatus'
  },
  {
    title: '证据名称',
    dataIndex: 'eviName',
    rowkey: 'eviName'
  },
  {
    title: '附件',
    width: 200,
    scopedSlots: { customRender: 'path' }
  },
  {
    title: '证明对象',
    dataIndex: 'eviProve',
    rowkey: 'eviProve'
  },
  {
    title: '证据来源',
    dataIndex: 'eviSource',
    rowkey: 'eviSource'
  },
  {
    title: '页数',
    dataIndex: 'eviPage',
    rowkey: 'eviPage'
  },
  {
    title: '是否有原件',
    dataIndex: 'original',
    rowkey: 'original'
  },
  {
    title: '提交举证时间',
    dataIndex: 'createTime',
    rowkey: 'createTime'
  },
  {
    title: '审核意见',
    scopedSlots: { customRender: 'review' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operate' }
  }
]
const columns1 = [
  {
    title: '真实姓',
    width: 100,
    scopedSlots: { customRender: 'truth' }
  },
  {
    title: '合法性',
    width: 100,
    scopedSlots: { customRender: 'legality' }
  },
  {
    title: '关联性',
    width: 100,
    scopedSlots: { customRender: 'relevance' }
  },
  {
    title: '原因',
    scopedSlots: { customRender: 'reason' }
  },
  {
    title: '其他意见',
    dataIndex: 'otherReason',
    rowkey: 'otherReason'
  },
  {
    title: '操作',
    width: 150,
    scopedSlots: { customRender: 'operate' }
  }
]
export default {
  components: {
    Button,
    Table,
    AddEvidence,
    Verification,
    Review,
    Preview,
    Empty
  },
  props: {

  },
  data() {
    return {
      columns,
      selectKey: [],
      columns1,
      list: [],
      isTable: true,
      loading: false,
      obj: {},
      fileList: []
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectKey)
        }
      }
    },
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getDate()
    this.getList()
  },
  mounted() {
  },
  methods: {
    addEvidence() {
      this.$refs.addEvidence.show()
    },
    // 获取数据
    getDate() {
      queryQtwTime({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.obj = data
        }
      })
    },
    // 获取列表数据
    getList() {
      this.isTable = false
      listQtwInfo({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        this.isTable = true
        if (code === 200) {
          this.list = data.rows && data.rows.length > 0 ? data.rows.map((item, index) => {
            item.index = index + 1
            item.createTime = this.format(item.createTime, 'YYYY-MM-DD H:m:s')
            item.litigantName = item.litigantInfo.name
            item.litigantStatus = item.litigantInfo.litigantStatus
            item.eviName = item.evidenceInfo.eviName
            item.eviProve = item.evidenceInfo.eviProve
            item.eviSource = item.evidenceInfo.eviSource
            item.eviPage = item.evidenceInfo.eviPage
            item.original = item.evidenceInfo.original ? '是' : '否'
            item.fileInfos = item.evidenceInfo.eviFileInfo
            return item
          }) : []
        }
      })
    },
    // 结束质证
    endFlag() {
      endQtw({ lawCaseId: this.getLawCaseId }).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.getDate()
        }
      })
    },
    // 添加提醒意见
    addVerification(data) {
      this.$refs.verification.show(data.id)
    },
    // 审核
    addReview(data) {
      this.$refs.review.show(data.id)
    },
    del() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择举证记录')
        return
      }
      const listIds	= this.selectKey.map(item => item.id)
      this.$confirm({
        title: '是否删除该举证记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          delListInfo({ listIds }).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 预览
    preview(e, record) {
      const list = record.fileInfos.map(item => item.fileUrl)
      this.$refs.preview.show(e.fileUrl, list)
    },
    preview1(e, record) {
      const list = record.freeFileInfo.map(item => item.filePath)
      this.$refs.preview.show(e, list)
    },
    // 编辑
    edit(e) {
      this.$refs.verification.edit(e)
    },
    // 删除质证
    delVerification(e) {
      this.$confirm({
        title: '是否删除该质证记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          delQtwVerifyInfo({ verifyId: e.id }).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less" src="../index.less"></style>
<style scoped lang="less">
.sub-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  button {
    margin-left: 10px;
  }
}
.agree {
  color: green;
}
.noAgree {
  color: red;
}
/deep/.ant-table-expanded-row {
  &>td:first-child {
    // display: none;
  }
}
.sub-content {
  background-color: #fff;
  border: 1px solid @theme-color;
  border-radius: 5px;
  padding: 10px 20px;
  .sub-title {
    color: @theme-color;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .name {
      margin-right: 10px;
    }
  }
}
/deep/.ant-table-expanded-row {
  background-color: #fff!important;
}
</style>
