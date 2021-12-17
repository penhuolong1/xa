<template>
  <div class="wrapper">
    <div v-for="(item, index) in list" :key="index.toString()" class="item" :header="item.name +item.operate+' '+ item.createTime">
      <div class="header">{{ item.operate }}</div>
      <Row class="list-item">
        <Col class="label" :span="8">操作人:</Col>
        <Col class="text" :span="16">{{ item.name }}</Col>
      </Row>
      <Row class="list-item">
        <Col class="label" :span="8">操作时间:</Col>
        <Col class="text" :span="16">{{ item.createTime }}</Col>
      </Row>
      <div v-if="item.operate === '申请协同'" class="log-item">
        <Row class="list-item">
          <Col class="label" :span="8">联动者:</Col>
          <Col class="text" :span="16">{{ item.beau }}</Col>
        </Row>
        <Row class="list-item">
          <Col class="label" :span="8">联动类型:</Col>
          <Col class="text" :span="16">{{ item.type === 1 ? '协助调解':'咨询' }}</Col>
        </Row>
        <Row v-if="item.opinion" class="list-item">
          <Col class="label" :span="8">事由:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
        </Row>
        <!-- <Row v-if="!item.handle || item.handle === 0">
            <Empty description="暂未处理" />
          </Row> -->
      </div>
      <div v-if="item.operate === '下发'" class="log-item">
        <Row v-if="item.beau" class="list-item">
          <Col class="label" :span="8">联动者:</Col>
          <Col class="text" :span="16">{{ item.beau }}</Col>
        </Row>
        <Row class="list-item">
          <Col class="label" :span="8">意见:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
        </Row>
      </div>
      <div v-if="item.operate === '答复'" class="log-item">
        <Row class="list-item">
          <Col class="label" :span="8">内容:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
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
          <Col class="label" :span="8">退回理由:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
        </Row>
      </div>
      <div v-if="item.operate === '修改'" class="log-item">
        <Row v-if="item.opinion" class="list-item">
          <Col class="label" :span="8">事由:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
        </Row>
      </div>
      <div v-if="item.operate === '重新申请'" class="log-item">
        <Row v-if="item.beau" class="list-item">
          <Col class="label" :span="8">联动者:</Col>
          <Col class="text" :span="16">{{ item.beau }}</Col>
        </Row>
        <Row class="list-item">
          <Col class="label" :span="8">联动类型:</Col>
          <Col class="text" :span="16">{{ item.type === 1 ? '协助调解':'咨询' }}</Col>
        </Row>
        <Row v-if="item.opinion" class="list-item">
          <Col class="label" :span="8">事由:</Col>
          <Col class="text" :span="16">{{ item.opinion }}</Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { listTeamLogById } from '@/api/sfAddcase/index'
import { Row, Col, Empty } from 'ant-design-vue'
export default {
  components: {
    Row,
    Col,
    Empty
  },
  props: {},
  data() {
    return {
      list: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getInfo()
  },
  mounted() {},
  methods: {
    getInfo() {
      // 获取协同数据
      const params = {
        teamId: this.$route.query.chatRoomId
      }
      listTeamLogById(params).then(({ code, data }) => {
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
<style lang="less" scoped>
.wrapper {
  padding-top: 20px;
}
.header {
  font-size: 16px;
  font-weight: bolder;
  margin-bottom: 10px;
}
.list-item {
  margin-bottom: 5px;
}
.item {
  border-bottom: 1px solid #dadbe6;
  padding: 10px 0;
}
</style>
