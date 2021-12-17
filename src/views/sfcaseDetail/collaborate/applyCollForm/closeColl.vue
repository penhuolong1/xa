<template>
  <div class="wrapper">
    <div class="mb-5">是否结束本次发起的协助调解事项?</div>
    <Button type="primary" :loading="loading" @click="closeColl">
      确认
    </Button>
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import { finishTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Button
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

  },
  mounted() {

  },
  methods: {
    closeColl() {
      const params = {
        id: this.getTeamInfo.id
      }
      finishTeam(params).then(res => {
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
  text-align: center;
  padding-top: 50px;
}
</style>
