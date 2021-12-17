<template>
  <div class="wrapper">
    <Row class="mb-5">
      <Col :span="6" />
      <Col :span="18">是否提交案件?</Col>
    </Row>
    <Col :span="6" />
    <Button type="primary" :loading="loading" @click="handleTeam">
      确认
    </Button>
  </div>
</template>

<script>
import { Button, Col, Row } from 'ant-design-vue'
import { editMediateResult, submitToCourt } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Button,
    Col,
    Row
  },
  props: {

  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getSfCaseInfo'])
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleTeam() {
      const params = {}
      params.sfLawCaseId = this.getSfCaseInfo.id
      this.loading = true
      submitToCourt(params).then(({ code, msg }) => {
        this.loading = false
        if (code === 200) {
          this.$message.success(msg)
          this.$store.dispatch('GetSfCaseInfo')
          this.$store.dispatch('GetHandleOfCase')
          this.$store.dispatch('GetOperateLogOfCase')
        }
      })
    },
    change(e) {
      console.log(e)
      if (e.field === 'resultState') {
        this.resultState = e.value.resultState
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  padding-top: 50px;
}
</style>
