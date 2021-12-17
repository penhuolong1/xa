<template>
  <div class="wrapper">
    <span v-if="!getTeamInfo.cancel">
      <Form ref="form" :schema="schema" />
      <Button type="primary" :loading="loading" @click="update">
        确认
      </Button>
    </span>
    <Empty v-else description="已撤回" />
  </div>
</template>

<script>
import Form from '@/components/Form'
import { Button, Empty } from 'ant-design-vue'
import { updateTeam } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
const schema = [
  {
    label: '联动理由',
    type: 'textArea',
    field: 'reason',
    formOption: { rules: [{ required: true, message: '请输入联动事由' }] }
  }
]
export default {
  components: {
    Button,
    Form,
    Empty
  },
  props: {

  },
  data() {
    return {
      loading: false,
      schema
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
    update() {
      this.$refs.form.getFieldsValue().then(res => {
        console.log(res)
        const params = {
          ...res
        }
        params.id = this.getTeamInfo.id
        updateTeam(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.$refs.form.resetFields()
            this.$store.dispatch('GetListTeamInfo')
          }
        })
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
