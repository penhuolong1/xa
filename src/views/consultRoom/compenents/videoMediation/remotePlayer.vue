<template>
  <div ref="remotePlayer" class="local-player">
    <div class="name">{{ item.roleName }} {{ item.name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    rtc: {
      type: Object,
      default: () => {}
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
  },
  watch: {
    item: {
      handle() {
        console.log(this.rtc)
        const dom = this.$refs.remotePlayer
        this.item.stream.play(dom)
      },
      deep: true
    },
    userId() {
      console.log(this.rtc)
    }
  },
  created() {
  },
  mounted() {
    const dom = this.$refs.remotePlayer
    this.item.stream.play(dom)
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.local-player {
  width: 50%;
  display: inline-block;
  height: 200px;
  position: relative;
  background-color: #000;
  .name {
    position: absolute;
    top: 0;
    left: 10px;
    color: #fff;
  }
}
</style>
