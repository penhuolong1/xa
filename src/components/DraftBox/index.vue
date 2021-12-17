<template>
  <div>
    <Modal
      title="草稿箱"
      :visible="visible"
      width="80%"
      :mask-closable="false"
      @cancel="visible = false"
    >
      <div class="content">
        <div class="mb-2.5">
          <Button type="primary" class="mr-2.5" @click="addCase">添加案件</Button>
          <Button type="danger" @click="del(2)">删除</Button>
        </div>
        <Table
          :loading="loading"
          :scroll="{x:1400}"
          :columns="columns"
          :data-source="tabledata"
          :row-key="(record,index)=>{return record.lawCaseId}"
          :row-selection="{selectedRowKeys: selectKey, onChange: onSelectChange}"
          :pagination="{
            total: total,
            showTotal: total => {
              return `共计${total}条`
            },
            current: searchParams.pageNum,
            showSizeChanger: true,
            showQuickJumper: true,
          }"
          @change="changePage"
        >
          <div slot="operation" slot-scope="record">
            <div class="box">
              <a class="mr-5" @click="edit(record)">编辑</a>
              <a class="mr-5" @click="del(1, record)">删除</a>
            </div>
          </div>
        </Table>
      </div>
      <div slot="footer" class="footer">
        <Button @click="visible = false">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Modal, Button, Table } from 'ant-design-vue'
import { queryUnCompleteCase, delCaseList } from '@/api/collectCase/index.js'
export default {
  components: {
    Modal,
    Table,
    Button
  },
  props: {
  },
  data() {
    return {
      visible: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          customRender: (text, row, index) => {
            return index + 1
          }
        },
        {
          title: '案由',
          dataIndex: 'brief',
          key: 'brief'
        },
        {
          title: '原告',
          dataIndex: 'plaintiff',
          key: 'plaintiff'
        },
        {
          title: '被告',
          dataIndex: 'defendant',
          key: 'defendant'
        },
        {
          title: '暂存时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      searchParams: {
        pageNum: 1,
        pageSize: 10
      },
      tabledata: [],
      total: 0,
      loading: false,
      selectKey: [],
      formal: 0
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    async show(formal) {
      await this.getList()
      this.formal = formal
      this.visible = true
    },
    onSelectChange(e) {
      this.selectKey = e
    },
    // 下一页触发
    changePage(e) {
      this.searchParams.pageNum = e.current
      this.getList()
    },
    // 获取列表
    async getList(isDel) {
      const params = {
        formal: this.formal,
        ...this.searchParams
      }
      this.loading = true
      await queryUnCompleteCase(params).then(({ code, data }) => {
        this.loading = false
        if (code === 200) {
          this.total = data.total
          this.tabledata = data.rows
          if (!data.rows || data.rows.length === 0) {
            if (!isDel) {
              this.addCase()
            }
          }
        }
      })
    },
    // 编辑
    edit(e) {
      this.$store.commit('SET_LAWCASE', e.lawCaseId)
      localStorage.setItem('addCaseType', this.formal)
      localStorage.removeItem('addCaseInfo') // 去除浏览器存的部分立案的信息
      const path = '/addCase/step1'
      this.$router.push(path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    // 删除
    del(type, e) {
      if (type === 2) {
        if (!this.selectKey || this.selectKey.length === 0) {
          this.$message.error('请先选择案件')
          return
        }
      }
      this.$confirm({
        title: '是否确认删除',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          if (type === 1) { // 单个删除
            const params = {
              lawCaseIds: e.lawCaseId
            }
            delCaseList(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.getList()
              }
            })
          } else { // 多个删除
            const params = {
              lawCaseIds: this.selectKey.join(',')
            }
            delCaseList(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.getList(true)
              }
            })
          }
        },
        onCancel() {}
      })
    },
    // 添加案件
    addCase() {
      this.$store.commit('SET_LAWCASE', '')
      localStorage.setItem('addCaseType', this.formal)
      localStorage.removeItem('addCaseInfo') // 去除浏览器存的部分立案的信息
      const path = '/addCase/step1'
      this.$router.push(path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    }
  }
}
</script>

<style scoped lang="less">

</style>
