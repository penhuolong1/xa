<template>
  <div>
    <Participant ref="participant" />
    <Chat @groupUser="groupUser" />
  </div>
</template>

<script>
import Participant from './participant.vue'
import Chat from './chat.vue'
export default {
  components: {
    Participant,
    Chat
  },
  props: {},
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    groupUser(info) {
      this.$refs.participant.getUser(info)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
