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
      <TabPane v-if="!isLegal" :key="2" tab="教育及职业信息" />
      <TabPane :key="3" tab="联系方式" />
      <!-- <TabPane v-if="!agentFlag" :key="4" tab="代理人信息" /> -->
    </Tabs>
    <BaseInfo v-show="activeKey === 1" ref="baseInfo" @changeType="changeType" />
    <Profession v-show="activeKey === 2" ref="profession" />
    <Concact v-show="activeKey === 3" ref="concact" />
    <!-- <Agent v-show="activeKey === 4" ref="agent" :litigant-id="litigantId" /> -->
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
import Profession from './components/profession.vue'
// import Agent from './components/agentInfo.vue'
import { mapGetters } from 'vuex'
import { addOrUpdateLitigant, queryLitInfo, addOrUpdateAgent, queryLitAgentInfo } from '@/api/addCase/index'
import { addUpdate, getDetail } from '@/api/freeze/index.js'
export default {
  components: {
    Modal,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseInfo,
    Concact,
    Profession,
    // Agent,
    Button
  },
  props: {
    isEdit: {
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
    ...mapGetters(['getLawCaseId']),
    btnLabel() {
      let label = '下一步'
      if (this.isUpdate) {
        label = '修改'
      } else {
        if (this.activeKey === 3) {
          label = '保存'
        }
      }
      return label
    }
  }, // 给案号赋值
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
      if (this.isUpdate) {
        if (this.$refs.baseInfo.submit().flag) { // 验证没通过
          return
        }
        this.baseInfo = this.$refs.baseInfo.submit()
        if (!this.isLegal) {
          if (this.$refs.profession.submit().flag) {
            return
          }
          this.profession = this.$refs.profession.submit()
        }
        if (this.$refs.concact.submit().flag) {
          return
        }
        this.concact = this.$refs.concact.submit()
        const params = {
          ...this.baseInfo,
          ...this.profession,
          ...this.concact
        }
        params.birthday = params.birthday ? this.format(new Date(params.birthday), 'YYYY-MM-DD H:m:s') : ''
        params.lawCase = this.getLawCaseId
        params.id = this.litigantId
        addUpdate(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
            this.visible = false
          }
        })

        return
      }
      switch (this.activeKey) {
        case 1:
          if (this.$refs.baseInfo.submit().flag) { // 验证没通过
            return
          }
          this.baseInfo = this.$refs.baseInfo.submit()
          console.log(this.baseInfo)
          this.activeKey = this.isLegal ? this.activeKey + 2 : this.activeKey + 1
          return
        case 2:
          if (this.$refs.profession.submit().flag) {
            return
          }
          this.profession = this.$refs.profession.submit()
          this.activeKey = this.activeKey + 1
          return
        case 3:
          if (this.$refs.concact.submit().flag) {
            return
          }
          this.concact = this.$refs.concact.submit()
          var params = {
            ...this.baseInfo,
            ...this.profession,
            ...this.concact
          }
          params.lawCase = this.getLawCaseId
          params.id = this.litigantId
          params.birthday = params.birthday ? this.format(new Date(params.birthday), 'YYYY-MM-DD H:m:s') : ''
          addUpdate(params).then(({ code, msg, data }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.visible = false
              // this.activeKey = this.activeKey + 1
              if (data.litigantId) {
                this.litigantId = data.litigantId
              }
              this.$emit('done')
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
      getDetail(id).then(({ code, data }) => {
        if (code === 200) {
          this.$refs.baseInfo.setData(data)
          this.$refs.profession.setData(data)
          this.$refs.concact.setData(data)
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
