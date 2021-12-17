<template>
  <div>
    <div v-if="!getTeamInfo.cancel" class="wrapper">
      <div class="mb-5">是否撤回本次发起的协助调解事项?</div>
      <Button type="primary" :loading="loading" @click="withdrawColl">
        确认
      </Button>
    </div>
    <span v-else class="mb-2.5">
      <Col :span="6" />
      <Col :span="16">
        <span>已撤回,请重新编辑</span>
      </Col>
      <CollaborateForm :id="getTeamInfo.id" :is-need-add-btn="false" />
    </span>
  </div>
</template>

<script>
import { Button, Col } from 'ant-design-vue'
import { cancelTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
import CollaborateForm from '@/components/CaseHandle/collaborateForm.vue'
export default {
  components: {
    Button,
    Col,
    CollaborateForm
  },
  props: {

  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getTeamInfo'])
  },
  created() {
    console.log(this.getTeamInfo)
  },
  mounted() {

  },
  methods: {
    withdrawColl() {
      console.log(this.getTeamInfo)
      cancelTeam({ id: this.getTeamInfo.id }).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.$store.dispatch('GetListTeamInfo')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  text-align: center;
  padding-top: 50px;
}
</style>
