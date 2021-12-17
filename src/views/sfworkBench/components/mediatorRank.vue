<template>
  <div>
    <Row v-if="mediatorList.length>0" style="height:370px">
      <Col span="10">
        <div style="margin:0 10px;">
          <div v-for="(item,index) in mediatorList" :key="index">
            <div v-if="index<5" class="mediator">
              <div>{{ item.mediatorName }}</div>
              <div>{{ item.mediatorCount }}</div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="4">
        <Divider v-show="mediatorList>5" type="vertical" style="margin:0 50%;height:350px" />
      </Col>
      <Col span="10">
        <div style="margin:0 10px;">
          <div v-for="(item,index) in mediatorList" :key="index">
            <div v-if="index>4&&index<10" class="mediator">
              <div>{{ item.mediatorName }}</div>
              <div>{{ item.mediatorCount }}</div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <Empty v-if="mediatorList.length==0" />
  </div>

</template>
<script>
import { Col, Row, Divider, Empty } from 'ant-design-vue'
export default {
  components: {
    Col,
    Row,
    Divider,
    Empty
  },
  props: {
    mediatorList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      caseType: 0
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.left-container{
  margin:10px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px;
}
.selectedMed{
  color: #177ddc;
  font-weight: 700;
  border-bottom:#177ddc ;
border-radius: 2px;
}
 .mediator{
    display: flex;
    margin:38px 0;
    justify-content: space-between;
font-size: 18px;
font-weight: 500;
  }
</style>
