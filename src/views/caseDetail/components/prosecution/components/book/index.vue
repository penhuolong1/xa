<template>
  <div class="wrapper">
    <div class="header enter-X">
      <Button type="org" @click="addFile('诉前调查笔录')">添加诉前调查笔录</Button>
      <Button type="primary" @click="addFile('诉前调查报告')">添加诉前调查报告</Button>
      <Button type="blue4" @click="addFile('诉前调解笔录')">添加调解笔录</Button>
      <Button type="blue3" @click="addFile('诉前调解协议')">添加调解协议</Button>
      <Button type="danger" @click="del">删除</Button>
      <Button type="green" @click="toRtc">进入调解室</Button>
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return record.dipId}"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :data-source="list"
      :loading="loading"
      :pagination="{
        total: total,
        showTotal: total => {
          return `共计${total}条`
        },
        current: pageNumber,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      @change="changePage"
    >
      <div slot="dipName" slot-scope="record">
        <a class="operation_btn" @click="previw(record)">{{ record.dipName }}</a>
      </div>
      <div slot="operation" slot-scope="record">
        <div><a class="operation_btn" @click="updateFile(record)">修改文书标题</a></div>
        <div><a class="operation_btn" @click="edit(record)">编辑文书</a></div>
      </div>
    </Table>

    <!-- 上传文书 -->
    <AddFile ref="addFile" @done="getList" />
    <!-- 预览 -->
    <Preview ref="preview" :file-list="[]" />
    <UpdateTitle ref="updateFile" @done="getList" />
  </div>
</template>

<script>
import { Button, Table } from 'ant-design-vue'
import AddFile from './addFile.vue'
import UpdateTitle from './updateTitle.vue'
import { listPreDipRecord, delPreDipRecord } from '@/api/book/index.js'
import { getPreviewUrl } from '@/api/common/index.js'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'
import { intoRoom } from '@/api/rtc/index.js'

const columns = [
  { title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 80,
    customRender: (text, row, index) => {
      return index + 1
    }
  },
  {
    title: '文书',
    align: 'center',
    scopedSlots: { customRender: 'dipName' }
  },
  {
    title: '创建人',
    dataIndex: 'userName',
    key: 'userName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '最后编辑时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, align: 'center' }
]
export default {
  components: {
    Button,
    Table,
    UpdateTitle,
    Preview,
    AddFile
  },
  props: {

  },
  data() {
    return {
      columns,
      selectedRowKeys: [],
      list: [],
      total: 0,
      pageNumber: 1,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    addFile(title) {
      this.$refs.addFile.show(title)
    },
    // 编辑文件名
    updateFile(e) {
      this.$refs.updateFile.show(e)
    },
    // 删除
    del(e) {
      if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
        this.$message.error('请先选择文书')
        return
      }
      const params = {
        dipId: this.selectedRowKeys.join(',')
      }
      delPreDipRecord(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.selectedRowKeys = []
          this.getList()
        }
      })
    },
    // 预览
    previw(e) {
      this.$refs.preview.show(e.dipPath, [])
    },
    // 选择文书
    onSelectChange(e) {
      this.selectedRowKeys = e
    },
    // 列表
    getList() {
      const params = {
        lawCaseId: this.getLawCaseId,
        pageNum: this.pageNumber
      }
      this.loading = true
      listPreDipRecord(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.total = data.total
          this.list = data.rows
        }
      })
    },
    // 获取页码
    changePage(e) {
      this.pageNumber = e.current
      this.getList()
    },
    // 进入调解室
    toRtc() {
      intoRoom({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
          this.$store.commit('SET_RTCTOKEN', data.result)
          let chatRoomId = ''
          let type = null
          chatRoomId = this.getLawCaseId
          this.$store.commit('SET_LAWCASE', this.getLawCaseId)
          type = 1 // 法院
          this.$router.push(`/rtc?chatRoomId=` + chatRoomId + '&type=' + type)
        }
      })
    },
    // 编辑
    edit(record) {
      const url = record.dipPath
      const type = url.split('.').pop()
      const canEditFileTyps = ['doc', 'docx']
      if (url && canEditFileTyps.findIndex(item => item === type) === -1) {
        this.$message.error('只有doc,docx的文件可以在线编辑')
        return
      }
      getPreviewUrl(url, 'write').then(res => {
        if (res.code === 200) {
          window.open('/editlawsuitbook?id=' + res.data.token + '&depId=' + record.dipId)
          this.fileId = res.data.token
          localStorage.setItem(res.data.token, res.data.wpsUrl)
        }
      })
    }
  }
}
</script>

<style scoped lang="less" src="../index.less"></style>
