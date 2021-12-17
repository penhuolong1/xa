<template>
  <div class="wrapper">
    <Row :gutter="20">
      <Col :span="12">
        <Title label="调解员" num="120" unit="个" />
      </Col>
      <Col :span="12">
        <Title label="年平均办案量" num="13.51" unit="起" />
      </Col>
    </Row>
    <div class="echart-box">
      <RadarChart />
    </div>
  </div>
</template>

<script>
import Title from './title1.vue'
import RadarChart from './radarChart1.vue'
import { Row, Col } from 'ant-design-vue'
export default {
  components: {
    Title,
    Row,
    Col,
    RadarChart
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

<style scoped lang="less">
.wrapper {
  width: 100%;
  .echart-box {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
