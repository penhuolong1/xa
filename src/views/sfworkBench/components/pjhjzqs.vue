<template>
  <div>
    <Row class="left-container" style="height:480px">
      <div class="title" style="font-size: 18px;"> 解纷质效</div>
      <div class="title" style="font-size: 16px;margin-top:-10px">平均化解周期</div>
      <div class="quertar">
        <div class="quertar1" style="border-style:none solid solid none;border-width:thin;">
          <DateLineChart ref="DateLineInit" style="margin-left:20px;margin-top:-10px" />
        </div>
        <DataBlock ref="DataBlock" :index="0" class="quertar1" style="border-style:none none solid none;border-width:thin;" />
        <DataBlock ref="DataBlock" :index="1" class="quertar1" style="border-style:none solid none none;border-width:thin;" />
        <DataBlock ref="DataBlock" :index="2" class="quertar1" />
      </div>
    </Row>
  </div>
</template>

<script>
import { Row, Col } from 'ant-design-vue'
import DataBlock from './dataBlock.vue'
import DateLineChart from './dateLineChart.vue'

export default {
  components: {
    Row, Col, DataBlock, DateLineChart
  },
  props: {

  },
  data() {
    return {

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

<style scoped lang="scss">
.quertar{
  display: flex;
  flex-wrap:wrap;
  margin-top:-30px;
}
.quertar1{
  width: 50%;
  height: 200px;
  padding:5px;
  border-color:rgba(0,0,0,0.1)
}
.title{
  color: rgba(36,47,87,1);
  font-weight: 700;
}
</style>
