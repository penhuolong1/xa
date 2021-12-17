<template>
  <div class="wrapper">
    <div class="header enter-X">
      <Button type="org" @click="addRecord">添加记录</Button>
      <Button type="danger" @click="del">删除</Button>
      <Button type="green" @click="toRtc">进入调解室</Button>
    </div>
    <Table
      class="enter-X"
      :row-key="(record,index)=>{return index}"
      :columns="columns"
      :scroll="{x: 1400}"
      :row-selection="rowSelection"
      :data-source="list"
      :loading="loading"
      :pagination="false"
    >
      <div slot="operate" slot-scope="record">
        <a type="primary" @click="edit(record)">编辑</a>
      </div>
      <div slot="file" slot-scope="record">
        <div v-if="record.preMediateType !== '电话调解'">
          <div v-if="record.fileInfos && record.fileInfos.length > 0">
            <a v-for="(item, index) in record.fileInfos" :key="index" class="mr-2.5" @click="preview(item, record)">
              {{ item ? item.name : '' }}
              <br>
            </a>
          </div>
        </div>
        <div v-if="record.preMediateType === '诉前调查'">
          <div v-if="record.dipInfos && record.dipInfos.length > 0">
            <a v-for="(item, index) in record.dipInfos" :key="index" class="mr-2.5" @click="preview(item, record)">
              {{ item ? item.name : '' }}
              <br>
            </a>
          </div>
        </div>
        <div v-if="record.preMediateType === '电话调解'">
          <audio v-if="record.callInfo && record.callInfo.recordAddress" controls :src="record.callInfo.recordAddress" />
        </div>
      </div>
    </Table>
    <AddRecord ref="addRecord" @done="getList" />
    <Preview ref="preview" :file-list="fileList" />

  </div>
</template>

<script>
import { Button, Table } from 'ant-design-vue'
import AddRecord from './addRecord.vue'
import { listPreRecordInfo, delRecord } from '@/api/addCase/index.js'
import Preview from '@/components/Preview/index'
import { mapGetters } from 'vuex'
import { intoRoom } from '@/api/rtc/index.js'

const columns = [
  {
    title: '序号',
    width: 70,
    dataIndex: 'index',
    rowkey: 'index'
  },
  {
    title: '方式',
    width: 100,
    dataIndex: 'preMediateType',
    rowkey: 'preMediateType'
  },
  {
    title: '调解/调查时间',
    dataIndex: 'mediateTime',
    rowkey: 'mediateTime',
    width: 150
  },
  {
    title: '本次结果',
    width: 100,
    dataIndex: 'mediateResult',
    rowkey: 'mediateResult'
  },
  {
    title: '附件',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '参与当事人',
    width: 150,
    dataIndex: 'litigantName',
    rowkey: 'litigantName'
  },
  {
    title: '创建人',
    width: 100,
    dataIndex: 'userName',
    rowkey: 'userName'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    rowkey: 'createTime',
    width: 150
  },
  {
    title: '最后编辑时间',
    dataIndex: 'updateTime',
    rowkey: 'updateTime',
    width: 150
  },
  {
    title: '操作',
    width: 100,
    scopedSlots: { customRender: 'operate' }
  }
]
export default {
  components: {
    Button,
    Table,
    Preview,
    AddRecord
  },
  props: {

  },
  data() {
    return {
      columns,
      selectKey: [],
      list: [],
      fileList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId']),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectKey = selectedRows
          console.log(this.selectKey)
        }
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    addRecord() {
      this.$refs.addRecord.show()
    },
    getList() {
      listPreRecordInfo({ lawCaseId: this.getLawCaseId }).then(({ code, data, msg }) => {
        if (code === 200) {
          this.list = []
          if (!data.rows || data.rows.length === 0) {
            return
          }
          this.list = data.rows.map((item, index) => {
            item.index = index + 1
            item.litigantName = item.litigantInfos.map(item => {
              return item.name
            }).join(',')
            item.mediateTime = item.mediateTime ? this.$moment(item.mediateTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.createTime = item.createTime ? this.$moment(item.createTime).format('YYYY-MM-DD') : ''
            item.updateTime = item.updateTime ? this.$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
            return item
          })
        }
      })
    },
    // 编辑
    edit(record) {
      this.$refs.addRecord.show(record)
    },
    // 预览
    preview(e, record) {
      const list = record.fileInfos.map(item => item.path)
      this.$refs.preview.show(e.path, list)
    },
    // 删除
    del() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择诉前记录')
        return
      }
      const ids	= this.selectKey.map(item => item.id)
      this.$confirm({
        title: '是否删除该诉前记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          delRecord({ ids }).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getList()
            }
          })
        },
        onCancel() {}
      })
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
    }
  }
}
</script>

<style scoped lang="less" src="../index.less"></style>
