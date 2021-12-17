<template>
  <Modal
    :title="title"
    :visible="visible"
    width="80%"
    :mask-closable="false"
    :footer="null"
    @cancel="visible = false"
  >
    <Tabs v-model="activeKey" @change="change">
      <TabPane :key="1" tab="基本信息" />
      <TabPane :key="2" tab="联系方式" />
      <TabPane v-if="!agentFlag" :key="3" tab="代理人信息" />
    </Tabs>
    <BaseInfo v-show="activeKey === 1" ref="baseInfo" @changeType="changeType" />
    <Concact v-show="activeKey === 2" ref="concact" :is-edit="isEdit" />
    <Agent v-show="activeKey === 3" ref="agent" :litigation-status="litigationStatus" :is-edit="isEdit" :litigant-id="litigantId" />
    <div v-if="isEdit" class="footer">
      <Button @click="handleCancel">
        {{ activeKey == 1 ? '取消':'上一步' }}
      </Button>
      <Button type="primary" :loading="loading" @click="handleOk">
        {{ btnLabel }}
      </Button>
    </div>
  </Modal>
</template>

<script>
import { Modal, Tabs, Button } from 'ant-design-vue'
import BaseInfo from './components/baseInfo.vue'
import Concact from './components/concact.vue'
import Agent from './components/agentInfo.vue'
import { mapGetters } from 'vuex'
import { editLitigant, getInfoById, editPhoneOrAddress, listBookOfLitigant, editAgent, listAgentOfLitigant } from '@/api/sfAddcase/index'
export default {
  components: {
    Modal,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseInfo,
    Concact,
    Agent,
    Button
  },
  props: {
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeKey: 1,
      visible: false,
      loading: false,
      title: '添加当事人',
      litigationStatus: null,
      baseInfo: {}, // 基本信息
      profession: {}, // 教育及职业信息
      concact: {}, // 联系方式
      isLegal: false, // 判断是否为法人
      litigantId: '', // 当事人id
      isUpdate: false, // 是否是修改
      agentFlag: false
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId']),
    btnLabel() {
      let label = '下一步'
      if (this.isUpdate) {
        label = '修改'
      } else {
        if (this.activeKey === 3) {
          label = '保存'
        } else if (this.activeKey === 4) {
          label = '确认'
        }
      }
      return label
    }
  },
  watch: {
    visible() {
      if (!this.visible) { // 关闭弹框的时候加载列表接口
        this.$emit('done')
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 切换自然人法人触发
    changeType(value) {
      this.isLegal = value == 1 || value == 2
    },
    show(id, type, agentFlag) {
      this.isUpdate = false
      this.agentFlag = agentFlag
      this.activeKey = type || 1
      this.reset()
      if (id) {
        this.isUpdate = true
        this.litigantId = id
        this.getDetail(id)
      }
      this.visible = true
    },
    reset() {
      this.isLegal = false
      this.litigantId = ''
      this.$refs.baseInfo?.reset()
      this.$refs.profession?.reset()
      this.$refs.concact?.reset()
      this.$refs.agent?.reset()
    },
    // 提交
    handleOk() {
      switch (this.activeKey) {
        case 1:
          if (this.$refs.baseInfo.submit().flag) { // 验证没通过
            return
          }
          this.baseInfo = this.$refs.baseInfo.submit()
          var params = {
            ...this.baseInfo
          }
          params.lawCase = this.getSfLawCaseId
          params.id = this.litigantId
          if (params.type !== 0) {
            params.idCardType = 13
          }
          editLitigant(params).then(({ code, msg, data }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.activeKey = this.activeKey + 1
              if (data) {
                this.litigantId = data
                this.$refs.agent.getListAllAgents(data)
              }
              this.litigationStatus = params.litigationStatusId
              this.$emit('done')
            }
          })
          return
        case 2:
          if (this.$refs.concact.submit().flag) {
            return
          }
          this.concact = this.$refs.concact.submit()
          var params1 = [
            ...this.concact
          ]
          params1.lawCase = this.getLawCaseId
          params1.id = this.litigantId
          if (params1 && params1.length > 0) {
            params1 = params1.map(item => {
              item.litigantId = this.litigantId
              return item
            })
          }
          editPhoneOrAddress(params1).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
              this.activeKey = this.activeKey + 1
            }
          })
          return
        case 3:
          var list1 = this.$refs.agent.submit()
          var params2 = []
          if (list1 && list1.length > 0) {
            params2 = list1.map(item => {
              item.sfLitigantId = this.litigantId
              return item
            })
          }
          editAgent(params2).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
              this.reset()
              this.visible = false
            }
          })
          return
        default:
          return
      }
    },
    // 取消
    handleCancel() {
      if (this.activeKey === 1) {
        this.visible = false
      } else {
        if (this.isLegal) {
          this.activeKey = this.activeKey === 3 ? this.activeKey - 2 : this.activeKey - 1
        } else {
          this.activeKey = this.activeKey - 1
        }
      }
    },
    // 切换选项
    change(e) {
      if (!this.litigantId) {
        if (this.$refs.baseInfo.submit().flag) { // 验证没通过
          this.activeKey = 1
          return
        }
      } else {
        this.activeKey = e
      }
    },
    // 获取当事人详情
    getDetail(id) {
      if (!id) {
        return
      }
      getInfoById({ sfLitigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.$refs.baseInfo.setData(data)
          this.litigationStatus = data.litigationStatusId
        }
      })
      listBookOfLitigant({ sfLitigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.$refs.concact.setData(data)
        }
      })
      listAgentOfLitigant({ sfLitigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.$refs.agent.setData(data)
          this.$refs.agent.getListAllAgents(id)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-tabs-tabpane {
  max-height: 500px;
  overflow: auto;
}
.footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
  button {
    margin-left: 8px;
  }
}
</style>
