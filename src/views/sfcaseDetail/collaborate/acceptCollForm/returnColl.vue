<template>
  <div class="wrapper">
    <span v-if="getTeamInfo.authorityType === 0">
      <Row>
        <Col :span="6" class="text-right">退回理由:</Col>
        <Col :span="12">
          <TextArea v-model="txt" />
        </Col>
      </Row>
      <Row class="mt-2.5">
        <Col :span="6" class="text-right" />
        <Col :span="12">
          <Button type="primary" :loading="loading" @click="closeColl">
            确认
          </Button>
        </Col>
      </Row>
    </span>
    <Empty v-else description="已处理" />
  </div>
</template>

<script>
import { Button, Row, Col, Input, Empty } from 'ant-design-vue'
import { handleTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Button,
    Row,
    Col,
    Empty,
    TextArea: Input.TextArea
  },
  props: {

  },
  data() {
    return {
      loading: false,
      txt: ''
    }
  },
  computed: {
    ...mapGetters(['getTeamInfo'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    closeColl() {
      const params = {
        id: this.getTeamInfo.id,
        handleType: 2,
        opinion: this.txt
      }
      this.loading = true
      handleTeam(params).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$store.dispatch('GetListTeamInfo')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  padding-top: 50px;
  padding: 50px;
}
.text-right {
  text-align: right;
  padding-right: 10px;
}
</style>
