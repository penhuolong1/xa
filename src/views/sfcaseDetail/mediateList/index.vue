<template>
  <div class="wrapper">
    <div class="header1 enter-X">
      <Button class="btn" type="danger" @click="del">删除</Button>
      <Button class="btn" type="org" @click="addRecord">添加记录</Button>
      <Button type="green" @click="enterRoom">进入调解室</Button>
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
        <div v-if="record.materialFiles && record.materialFiles.length > 0">
          <a v-for="(item, index) in record.materialFiles" :key="index" class="mr-2.5" @click="preview(item, record)">
            {{ item ? item.name : '' }}
            <br>
          </a>
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
import { listRecord, delRecord } from '@/api/sfAddcase/index.js'
import Preview from '@/components/Preview/index'
import { intoSfRoom } from '@/api/rtc/index.js'
import { mapGetters } from 'vuex'
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
    dataIndex: 'type',
    rowkey: 'type'
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
    dataIndex: 'mediateResultLabel',
    rowkey: 'mediateResultLabel'
  },
  {
    title: '附件',
    scopedSlots: { customRender: 'file' }
  },
  {
    title: '参与当事人',
    width: 150,
    dataIndex: 'litigantNames',
    rowkey: 'litigantNames'
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
    ...mapGetters(['getSfLawCaseId']),
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
    // 进入调解室
    enterRoom() {
      intoSfRoom({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.$store.commit('SET_ISOPEN', data.is_open ? '1' : '')
          this.$store.commit('SET_RTCTOKEN', data.result)
          this.$router.push(`/rtc?chatRoomId=` + this.getSfLawCaseId + '&type=' + 2)
        }
      })
    },
    addRecord() {
      this.$refs.addRecord.show()
    },
    getList() {
      listRecord({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data, msg }) => {
        if (code === 200) {
          this.list = []
          if (!data || data.length === 0) {
            return
          }
          const mediateResultMap = {
            0: '无结果',
            1: '调解成功',
            2: '调解失败'
          }
          this.list = data.map((item, index) => {
            item.index = index + 1
            item.mediate_time = this.format(item.mediate_time, 'YYYY-MM-DD H:m:s')
            item.create_time = this.format(item.create_time, 'YYYY-MM-DD')
            item.update_time = this.format(item.update_time, 'YYYY-MM-DD H:m:s')
            item.mediateResultLabel = mediateResultMap[item.mediateResult]
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
      const list = record.materialFiles.map(item => item.path)
      this.$refs.preview.show(e.path, list)
    },
    // 删除
    del() {
      if (!this.selectKey || this.selectKey.length === 0) {
        this.$message.error('请先选择记录')
        return
      }
      const params = {
        recordIds: this.selectKey.map(item => item.id),
        sfLawCaseId: this.getSfLawCaseId
      }
      this.$confirm({
        title: '是否删除该诉前记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          delRecord(params).then(({ code, msg }) => {
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

<style lang="less" scope>
.header1  {
  display: flex;
  flex-direction: row-reverse;
  .btn {
    margin-left: 10px;
  }
}
</style>
