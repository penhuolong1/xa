<template>
  <Modal
    title="代理人"
    :visible="visible"
    width="80%"
    :mask-closable="false"
    :footer="null"
    @cancel="visible = false"
  >
    <Tabs v-model="activeKey" @change="change">
      <TabPane :key="1" tab="基本信息" />
      <TabPane :key="2" tab="联系方式" />
      <TabPane :key="3" tab="代理当事人" />
    </Tabs>
    <!-- 基本信息 -->
    <BaseInfo v-show="activeKey === 1" ref="baseInfo" @changeType="changeType" />
    <!-- 联系方式 -->
    <Concact v-show="activeKey === 2" ref="concact" />
    <!-- 代理当事人 -->
    <Litgant v-show="activeKey === 3" ref="litgant" />
    <div v-if="isEdit" class="footer">
      <Button @click="handleCancel">
        {{ activeKey == 1 ? '取消':'上一步' }}
      </Button>
      <Button type="primary" :loading="loading" @click="handleOk">
        修改
      </Button>
    </div>
  </Modal>
</template>

<script>
import { Modal, Tabs, Button } from 'ant-design-vue'
import BaseInfo from './components/baseInfo.vue'
import Concact from './components/concact.vue'
import Litgant from './components/litgant.vue'
import { mapGetters } from 'vuex'
import { queryLitInfo, queryAgentLit, updateAgentLit, addOrUpdateLitigant } from '@/api/addCase/index'
import { litigationStatus } from '@/type/index.js'
export default {
  components: {
    Modal,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseInfo,
    Litgant,
    Concact,
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
      concact: {}, // 联系方式
      isLegal: false, // 判断是否为法人
      litigantId: '', // 当事人id
      isUpdate: false, // 是否是修改
      agentFlag: false,
      litInfo: [], // 当事人信息
      litigationStatusLabel: '原告'
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
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
    show(id) {
      this.isUpdate = false
      this.getDetail(id)
      this.visible = true
    },
    reset() {
      this.litigantId = ''
      this.$refs.baseInfo?.reset()
      this.$refs.concact?.reset()
    },
    // 提交
    handleOk() {
      if (this.activeKey === 3) {
        let params = []
        params = this.$refs.litgant.submit()
        updateAgentLit(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.reset()
            this.$emit('done')
            this.visible = false
          }
        })
      } else {
        if (this.$refs.baseInfo.submit().flag) { // 验证没通过
          return
        }
        this.baseInfo = this.$refs.baseInfo.submit()
        if (this.$refs.concact.submit().flag) {
          return
        }
        this.concact = this.$refs.concact.submit()
        const params = {
          ...this.litInfo,
          ...this.baseInfo,
          // ...this.profession,
          ...this.concact
        }
        params.lawCase = this.getLawCaseId
        delete params.idCardPath
        delete params.lawFirmLetter
        delete params.evidenceId1
        delete params.evidenceId2
        addOrUpdateLitigant(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.$emit('done')
          }
        })
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
      queryLitInfo({ litigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.litInfo = data
          this.$refs.baseInfo.setData(data)
          this.$refs.concact.setData(data)
          // this.litigationStatusLabel = data.litigationStatus.name
        }
      })
      // 查询代理人关系
      queryAgentLit({ litigantId: id }).then(({ code, data }) => {
        if (code === 200) {
          this.$refs.litgant.setData(data)
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
