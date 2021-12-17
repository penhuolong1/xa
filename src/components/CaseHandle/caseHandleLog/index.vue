<template>
  <div class="coll-log-wrapper">
    <Collapse v-model="activeKey" :bordered="false">
      <CollapsePanel v-for="(item, index) in list" :key="index.toString()" :header="item.header">
        <div v-if="item.caseState === '暂存' || item.caseState === '待审核'" class="log-item">
          <Row v-if="item.acceptType === 5">
            <Col class="label" :span="4">调解单位:</Col>
            <Col class="text" :span="14">{{ item.issuedName }}</Col>
          </Row>
          <Row v-else>
            <Empty />
          </Row>
        </div>
        <div v-if="item.caseState === '待指派调解'" class="log-item">
          <Row v-if="item.acceptType === 5">
            <Col class="label" :span="4">调解组织:</Col>
            <Col class="text" :span="14">{{ item.issuedName }}</Col>
          </Row>
          <Row v-if="item.acceptType === 5">
            <Col class="label" :span="4">调解员:</Col>
            <Col class="text" :span="14">{{ item.issuedMediatorName }}</Col>
          </Row>
          <Row v-else>
            <Empty />
          </Row>
        </div>
        <div v-if="item.caseState === '调解中'" class="log-item">
          <Row v-if="item.acceptType === 5">
            <Col class="label" :span="4">调解组织:</Col>
            <Col class="text" :span="14">{{ item.issuedName }}</Col>
          </Row>
          <Row v-else-if="item.acceptType === 60">
            <Col class="label" :span="4">结果:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
          <Row v-else-if="item.acceptType === 61">
            <Col class="label" :span="4">结果:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
          <Row v-else>
            <Empty />
          </Row>
        </div>
        <div v-if="item.caseState === '申请司法确认'" class="log-item">
          <Row>
            <Col class="label" :span="4">结果:</Col>
            <Col class="text" :span="14">{{ item.result || '暂无' }}</Col>
          </Row>
          <Row v-if="item.opinion">
            <Col class="label" :span="4">审查意见:</Col>
            <Col class="text" :span="14">{{ item.opinion || '暂无' }}</Col>
          </Row>
        </div>
        <div v-if="item.caseState === '申请立案'" class="log-item">
          <Row>
            <Col class="label" :span="4">结果:</Col>
            <Col class="text" :span="14">{{ item.result || '暂无' }}</Col>
          </Row>
          <Row v-if="item.opinion">
            <Col class="label" :span="4">审查意见:</Col>
            <Col class="text" :span="14">{{ item.opinion || '暂无' }}</Col>
          </Row>
        </div>
        <!-- <div v-if="item.operate === '申请联动'" class="log-item">
          <Row v-if="item.beau" class="list-item">
            <Col class="label" :span="4">联动者:</Col>
            <Col class="text" :span="14">{{ item.beau }}</Col>
          </Row>
          <Row class="list-item">
            <Col class="label" :span="4">联动类型:</Col>
            <Col class="text" :span="14">{{ item.type === 1 ? '协助调解':'咨询' }}</Col>
          </Row>
          <Row v-if="item.opinion" class="list-item">
            <Col class="label" :span="4">事由:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '下发'" class="log-item">
          <Row v-if="item.beau" class="list-item">
            <Col class="label" :span="4">联动者:</Col>
            <Col class="text" :span="14">{{ item.beau }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '接收'" class="log-item">
          <Row>
            <Empty />
          </Row>
        </div> -->
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script>
import { Collapse, Row, Col, Empty } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { listTeamLogById } from '@/api/sfAddcase/index.js'
import { operateLogOfCase } from '@/api/sfAddcase/index.js'
export default {
  components: {
    Collapse,
    CollapsePanel: Collapse.Panel,
    Row,
    Col,
    Empty
  },
  props: {

  },
  data() {
    return {
      activeKey: [],
      list: []
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId', 'getCaseInfo', 'getCaseHandleLog'])
  },
  watch: {
    getCaseHandleLog: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {
      this.list = []
      if (!this.getCaseHandleLog || this.getCaseHandleLog.length === 0) {
        return
      }
      const data = [...this.getCaseHandleLog]
      this.list = data.map((item, index) => {
        let header = ''
        switch (item.caseState) {
          case '暂存':
            header = item.deptName + '登记 ' + item.createTime
            break
          case '待审核':
            if (item.acceptType === 5) { // 下发
              header = item.deptName + '下发 ' + item.createTime
              item.issuedName = data[index + 1].deptName
            } else {
              console.log(this.getCaseInfo)
              if (this.getCaseInfo.caseSource === '当事人申请' && index === 0) {
                header = '当事人' + item.operateName + '申请'
              } else {
                header = item.deptName
              }
            }
            break
          case '待指派调解':
            if (item.acceptType === 5) { // 下发
              header = item.deptName + '下发 ' + item.createTime
              item.issuedName = data[index + 1].deptName
              item.issuedMediatorName = data[index + 1].mediatorName
            } else if (item.acceptType === 4) {
              header = item.deptName + '退回 ' + item.createTime
            } else if (item.acceptType === 80) {
              header = item.operateName + '委托指派 ' + item.createTime
            } else {
              header = item.deptName + ' ' + item.createTime
            }
            break
          case '调解中':
            if (item.acceptType === 0) {
              header = item.mediatorName + ' ' + item.createTime
            }
            if (item.acceptType === 1) {
              header = item.mediatorName + '接收 ' + item.createTime
            }
            if (item.acceptType === 4) {
              header = item.mediatorName + '退回 ' + item.createTime
            }
            if (item.acceptType === 60) {
              header = item.mediatorName + '新增化解结果 ' + item.createTime
            }
            if (item.acceptType === 61) {
              header = item.mediatorName + '修改化解结果 ' + item.createTime
            }
            if (item.acceptType === 80) {
              header = item.operateName + '委派调解 ' + item.createTime
            }
            break
          case '申请司法确认':
            var resultMap = {
              980: '补充材料',
              981: '同意受理',
              982: '不予受理'
            }
            header = item.operateName + '审查案件 ' + item.createTime
            if (item.acceptType === 98) {
              header = item.mediatorName + '申请司法确认 ' + item.createTime
            }
            item.result = resultMap[item.acceptType] || ''
            break
          case '申请立案':
            var resultMap1 = {
              980: '补充材料',
              981: '同意受理',
              982: '不予受理'
            }
            header = item.operateName + '审查案件 ' + item.createTime
            if (item.acceptType === 98) {
              header = item.mediatorName + '申请立案 ' + item.createTime
            }
            item.result = resultMap1[item.acceptType] || ''
            break
          case '已结案':
            header = item.mediatorName + '结案 ' + item.createTime
            if (item.acceptType === 998) {
              header = item.mediatorName + '提交案件' + item.createTime
            }
            break
        }
        item.header = header
        return item
      })
    }
  }
}
</script>

<style scoped lang="less">
.list-item {
  margin-bottom: 10px;
}
.label {
  text-align: right;
  margin-right: 20px;
}
.coll-log-wrapper {
  background-color:rgba(0,0,0,0.02);
  margin-top: 10px;
}
/deep/.ant-collapse-borderless > .ant-collapse-item {
  border-bottom: none;
}
.log-item {
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.10);
  padding: 20px 30px;
}
/deep/.ant-collapse-content-box {
  padding: 0px;
}
</style>
