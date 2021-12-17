<template>
  <div>
    <div class="flex justify-between items-center header">
      <div>
        <Button class="list-btn-item" type="blue4" @click="eleSendBut">电子送达</Button>
        <Button class="list-btn-item" type="blue4" @click="sceneSend">现场领取</Button>

      </div>
    </div>
    <span v-for="(item, index) in list" :key="index">
      <Header :item="item" />
      <EleSendTable v-if="isTable" ref="elesendShow" :list="item.sendInfo" @refresh="getData" />
      <br>
      <Empty v-if="!item|| item.length === 0" class="empty" />

      <SceneTable v-if="isTable" :list="item.sendInfo" @refresh="getData" />
    </span>
    <Empty v-if="!list || list.length === 0" />
    <Send ref="send" :send-process="type" @done="getData" @delSendRecord="delSendRecord" />
    <EleSend ref="eleSend" @refresh="getData" />
    <Scene ref="SecneShow" @refresh="getData" />
  </div>
</template>
<script>
import { Button, Empty } from 'ant-design-vue'
import { listSendInfo, querySendProcessInfo, delSend, getSendInfo } from '@/api/send/index.js'
import { sflistOfCase } from '@/api/freeze/index.js'
import { mapGetters } from 'vuex'
import Send from './components/send.vue'
import EleSend from './components/eleSend.vue'
import Scene from './components/scene.vue'
import EleSendTable from './components/eleSendTable.vue'
import SceneTable from './components/sceneTable.vue'
import Header from './components/header.vue'

export default {
  components: {
    Button,
    Empty,
    Header,
    Send,
    EleSend,
    Scene,
    EleSendTable,
    SceneTable
  },
  props: {

  },
  data() {
    return {
      type: 1,
      list1: [], // 电子送达列表
      list: [],
      selectedRows: [],
      isTable: true,
      // 送达方式转换
      sendStatus: [{
        1: '短信送达',
        2: '邮件送达',
        3: '小程序送达',
        4: '现场领取'
      }]
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId']),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  watch: {
    list() {
      // this.getData()
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init() {
      this.getData()
    },
    getshowType(e) {
      this.showType = e
      this.getData()
    },
    eleSendBut() {
      this.$refs.eleSend.show()
    },
    sceneSend() {
      this.$refs.SecneShow.show()
    },
    // 修改送达类型
    changeType(e) {
      this.type = e
      this.getData()
    },
    openModel1(str) {
      this.$refs.send.show(str)
    },
    getData() {
      const params = {
        sfLawCaseId: this.getSfLawCaseId
      }
      // this.isTable = false
      sflistOfCase(params).then(({ code, data }) => {
        if (code === 200) {
          this.list = data
          // this.$forceUpdate()
        }
        // this.isTable = true
      })
    },
    delSendRecord(id) {
      this.$confirm({
        title: '是否删除该送达记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            sendId: id
          }
          delSend(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getData()
            }
          })
        },
        onCancel() {}
      })
    },
    next() {
      this.$refs.next.show()
    }
  }
}
</script>

<style scoped lang="less">
.header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}
.tab {
  li {
    padding: 0 20px;
    font-size: 14px;
    cursor: pointer;
    font-weight: bolder;
    i {
      position: relative;
      top: -2px;
    }
    &:first-child {
      border-right: 1px solid #f0f0f0;
    }
    &.active {
      color: @theme-color;
    }
  }
}
.list-btn-item {
  margin-left: 10px;
}
.tab-icon {
  display: flex;
  margin-right: 20px;
  .icon-item {
    #center();
    background-color: rgba(143,146,161,0.05);
    padding: 5px 10px;
    cursor: pointer;
  }
}
.title {
  font-size: 14px;
  font-weight: bolder;
  margin-right: 5px;
}
.send-status {
  li {
    position: relative;
    padding-left: 20px;
    margin-right: 10px;
    &::before {
      content: '';
      width: 14px;
      height: 14px;
      border: 2px solid red;
      border-radius: 50%;
      position: absolute;
      top: 3px;
      left: 4px;
    }
    &.status0 {
      &::before {
        border: 3px solid;
        border-color: #4a99e3;
      }
    }
    &.status1 {
      &::before {
        border: 3px solid;
        border-color: #3bcccc
      }
    }
    &.status2 {
      &::before {
        border: 3px solid;
        border-color: red
      }
    }
    &.status3 {
      &::before {
        border: 3px solid;
        border-color: #ff6c2d
      }
    }
  }
}
.empty {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
