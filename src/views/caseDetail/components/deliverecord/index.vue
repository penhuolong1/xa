<template>
  <div>
    <div class="flex justify-between items-center header">
      <ul class="flex items-center tab">
        <li :class="type=== 1 ? 'active':''" @click="changeType(1)">
          <Icon v-if="type === 1" type="check" />
          诉前送达
        </li>
        <li :class="type=== 2 ? 'active':''" @click="changeType(2)">
          <Icon v-if="type === 2" type="check" />
          庭前送达
        </li>
      </ul>
      <!-- <Button>诉前送达</Button>
      <Button>庭前送达</Button> -->

      <div>
        <Button class="list-btn-item" type="org" @click="complexSend(1)">推送综合送达平台</Button>
        <Button class="list-btn-item" type="primary" @click="openModel(2)">电话通知</Button>
        <Button class="list-btn-item" type="blue4" @click="openModel1('电子送达')">电子送达</Button>
        <Button class="list-btn-item" type="blue4" @click="openModel1('现场领取')">现场领取</Button>
        <Button class="list-btn-item" type="blue3" @click="openModel1('邮寄送达')">邮寄送达</Button>
        <Button class="list-btn-item" type="blue3" @click="ondoorSend()">上门送达</Button>
        <Button class="list-btn-item" type="blue3" @click="openModel1('委托送达')">委托送达</Button>
        <Button class="list-btn-item" type="blue3" @click="openModel1('公告送达')">公告送达</Button>
        <Button class="list-btn-item" type="org" @click="updateScheuleType()">修改可{{ type === 1 ? '排期':'排庭' }}状态</Button>
        <Button class="list-btn-item" type="green" @click="next">转下一个流程</Button>
      </div>
    </div>
    <div class="flex justify-between items-center my-5">
      <div class="flex items-center">
        <div class="tab-icon">
          <div class="icon-item" @click="getshowType(1)">
            <img src="@/assets/icons/sendType2.png" alt="">
          </div>
          <div class="icon-item" @click="getshowType(2)">
            <img src="@/assets/icons/sendType1.png" alt="">
          </div>
        </div>
        <div class="flex">
          <h3 class="title">送达情况:</h3>
          <span>诉前送达成功-适宜调解</span>
        </div>
      </div>
      <div class="flex">
        <h3 class="title">送达状态:</h3>
        <ul class="flex send-status">
          <li class="status0">送达中</li>
          <li class="status1">送达成功</li>
          <li class="status2">送达失败</li>
          <li class="status3">未送达</li>
        </ul>
      </div>
    </div>
    <span v-if="showType === 1">
      <span v-for="(item, index) in list" :key="index">
        <Header :send-process="type" :item="item" @done="getData" />
        <Steps :item="item" @editSendRecord="editSendRecord" />
      </span>
    </span>
    <span v-if="showType === 2">
      <span v-for="(item, index) in list" :key="index">
        <Header :send-process="type" :item="item" @done="getData" />
        <span v-for="(item1, index1) in item.sendInfo" :key="index1">
          <CallTable v-if="item1.sendType == '电话通知'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" />  <!-- 电话送达 -->
          <SendTable v-if="item1.sendType === '电子送达'" class="mb-5" :item="item1.list" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 电子送达 -->
          <AddressTable v-if="item1.sendType === '上门送达'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 上门送达 -->
          <CourtTable v-if="item1.sendType === '公告送达'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 公告送达 -->
          <EmailTable v-if="item1.sendType === '邮寄送达'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 邮寄送达 -->
          <ServeTable v-if="item1.sendType === '委托送达'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 委托送达 -->
          <PreDataTable v-if="item1.sendType === '现场领取'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" /> <!-- 现场领取 -->
          <IntranetTable v-if="item1.sendType == '推送内网'" class="mb-5" :item="item1" @editSendRecord="editSendRecord" @delSendRecord="delSendRecord" />  <!-- 电话送达 -->
        </span>
        <Empty v-if="!item.sendInfo || item.sendInfo.length === 0" class="empty" />
      </span>
      <Empty v-if="!list || list.length === 0" />
    </span>
    <!-- 推送综合送达平台 -->
    <ComplexSend ref="complexSend" @done="getData" @delSendRecord="delSendRecord" />
    <!-- 电话送达 -->
    <PhoneSend ref="phoneSend" :send-process="type" @done="getData" @delSendRecord="delSendRecord" />
    <!-- 其他送达方式 -->
    <Send ref="send" :send-process="type" @done="getData" @delSendRecord="delSendRecord" />
    <!-- 上门送达 -->
    <OnDoorSend ref="onDoorSend" :send-process="type" @done="getData" @delSendRecord="delSendRecord" />
    <!-- 下一流程 -->
    <Next ref="next" :selected-rows="[{caseId: getLawCaseId }]" :is-leagal="isLeagal" />
    <ChangeState ref="changeState" :type="type" :selected-rows="[{caseId: getLawCaseId }]" />
  </div>
</template>
<script>
import { Button, Icon, Empty } from 'ant-design-vue'
import CallTable from './components/callTable.vue'
import SendTable from './components/sendTable.vue'
import AddressTable from './components/addressTable.vue'
import CourtTable from './components/courtTable.vue'
import ServeTable from './components/serveTable.vue'
import PreDataTable from './components/preDataTable.vue'
import IntranetTable from './components/IntranetTable.vue'
import EmailTable from './components/emailTable.vue'
import Header from './components/header.vue'
import Steps from './components/steps.vue'
import ComplexSend from './components/complexSend.vue'
import PhoneSend from './components/phoneSend.vue'
import Send from './components/send.vue'
import OnDoorSend from './components/onDoorSend.vue'
import { listSendInfo, querySendProcessInfo, delSend, getSendInfo } from '@/api/send/index.js'
import Next from '@/views/SeverdManage/servicing/components/next.vue'
import { mapGetters } from 'vuex'
import { queryById } from '@/api/addCase/index.js'
import ChangeState from '@/views/SeverdManage/servicing/components/changeState.vue'
export default {
  components: {
    Button,
    Empty,
    ComplexSend,
    Icon,
    Steps,
    Header,
    CallTable,
    IntranetTable,
    CourtTable,
    ServeTable,
    EmailTable,
    PreDataTable,
    PhoneSend,
    AddressTable,
    SendTable,
    Send,
    Next,
    ChangeState,
    OnDoorSend
  },
  props: {

  },
  data() {
    return {
      type: 1,
      showType: 1,
      isLeagal: 1, // 判断是否为正式案件
      list1: [], // 电子送达列表
      list: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getCaseInfo']),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        }
      }
    }
  },
  created() {
    if (this.getCaseInfo.lawCase.caseNo) {
      this.type = 2
    }
    this.getData()
  },
  mounted() {
  },
  methods: {
    getshowType(e) {
      this.showType = e
      this.getData()
    },
    // 修改送达类型
    changeType(e) {
      this.type = e
      this.getData()
    },
    home() {
      this.$refs.homeShow.show()
    },
    openModel(type) {
      this.$refs.phoneSend.show()
    },
    openModel1(str) {
      this.$refs.send.show(str)
    },
    editSendRecord({ sendId, litigantId }) {
      const params = {
        lawCaseId: this.getLawCaseId,
        litigantId,
        sendId,
        sendProcess: this.type
      }
      getSendInfo(params).then(({ code, data }) => {
        if (code === 200) {
          if (data[0].sendType === '上门送达') {
            this.$refs.onDoorSend.show(data[0])
          } else if (data[0].sendType === '电话通知') {
            this.$refs.phoneSend.show(data[0])
          } else {
            this.$refs.send.show(data[0].sendType, data[0])
          }
        }
      })
    },
    // 修改可排期状态
    updateScheuleType() {
      this.$refs.changeState.show()
    },
    // 上门送达
    ondoorSend() {
      this.$refs.onDoorSend.show()
    },
    // 综合送达平台
    complexSend() {
      this.$refs.complexSend.show()
    },
    getData() {
      const params = {
        lawCaseId: this.getLawCaseId,
        sendProcess: this.type
      }
      const stateMap = {
        0: '送达中',
        1: '送达成功',
        2: '送达失败',
        3: '未送达'
      }
      if (this.showType === 1) {
        querySendProcessInfo(params).then(({ code, data }) => {
          if (code === 200) {
            this.list = data.litigantSendInfo
          }
        })
      } else {
        listSendInfo(params).then(({ code, data }) => {
          if (code === 200) {
            if (!data.litigantSendInfo || data.litigantSendInfo.length === 0) {
              return
            }
            data.litigantSendInfo.forEach(item => {
              const list = []
              if (item.sendInfo && item.sendInfo.length > 0) {
                item.sendInfo.forEach(item1 => {
                  item1.state = stateMap[item1.state]
                  if (item1.sendType === '短信送达' || item1.sendType === '微信送达' || item1.sendType === '邮件送达') {
                    item1.phone = item1.phone || item1.email
                    list.push(item1)
                  }
                })
              }
              if (list && list.length > 0) {
                item.sendInfo.push({
                  sendType: '电子送达',
                  list
                })
              }
            })
            this.list = data.litigantSendInfo
            console.log(this.list)
          }
        })
      }
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
      queryById({ lawCaseId: this.$route.query.lawCase }).then(({ code, data }) => {
        if (code === 200) {
          if (data.lawCase.caseNo) {
            this.isLeagal = 2
          } else {
            this.isLeagal = 1
          }
        }
      })
      setTimeout(() => {
        this.$refs.next.show()
      }, 500)
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
