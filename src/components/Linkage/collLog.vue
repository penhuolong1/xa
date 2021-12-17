<template>
  <div class="coll-log-wrapper">
    <Collapse v-model="activeKey" :bordered="false">
      <CollapsePanel v-for="(item, index) in list" :key="index.toString()" :header="item.name +item.operate+' '+ item.createTime">
        <div v-if="item.operate === '申请协同'" class="log-item">
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
          <!-- <Row v-if="!item.handle || item.handle === 0">
            <Empty description="暂未处理" />
          </Row> -->
        </div>
        <div v-if="item.operate === '下发'" class="log-item">
          <Row v-if="item.beau" class="list-item">
            <Col class="label" :span="4">联动者:</Col>
            <Col class="text" :span="14">{{ item.beau }}</Col>
          </Row>
          <Row class="list-item">
            <Col class="label" :span="4">意见:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '答复'" class="log-item">
          <Row class="list-item">
            <Col class="label" :span="4">内容:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '接收'" class="log-item">
          <Row>
            <Empty />
          </Row>
        </div>
        <div v-if="item.operate === '办结'" class="log-item">
          <Row>
            <Empty />
          </Row>
        </div>
        <div v-if="item.operate === '撤回'" class="log-item">
          <Row>
            <Empty />
          </Row>
        </div>
        <div v-if="item.operate === '退回'" class="log-item">
          <Row>
            <Col class="label" :span="4">退回理由:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '修改'" class="log-item">
          <Row v-if="item.opinion" class="list-item">
            <Col class="label" :span="4">事由:</Col>
            <Col class="text" :span="14">{{ item.opinion }}</Col>
          </Row>
        </div>
        <div v-if="item.operate === '重新申请'" class="log-item">
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
      </CollapsePanel>
    </Collapse>
  </div>
</template>

<script>
import { Collapse, Row, Col, Empty } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { listTeamLogById } from '@/api/sfAddcase/index.js'
export default {
  components: {
    Collapse,
    CollapsePanel: Collapse.Panel,
    Row,
    Col,
    Empty
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeKey: [],
      list: []
    }
  },
  computed: {
  },
  watch: {
    getTeamInfo: {
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
      if (!this.id) {
        return
      }
      this.list = []
      listTeamLogById({ teamId: this.id }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.map(item => {
            item.createTime = item.createTime ? this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
            item.updateTime = item.updateTime ? this.$moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : ''
            return item
          })
        }
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
