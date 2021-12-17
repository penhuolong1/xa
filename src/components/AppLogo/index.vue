<template>
  <div class="xa-logo flex items-center font-semibold h-full">
    <img v-if="getUserRole === 'court'" :src="logoImg" alt="">
    <div class="title-wrapper">
      <div class="title">{{ getUserRole === 'court' ? '翔安区人民法院' : '翔安区“好厝边”诉非联动平台' }}</div>
      <div v-if="getUserRole === 'court'" class="label">翔安区“好厝边”诉非联动平台</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
  },
  data() {
    return {
      logoImg: require('@/assets/images/logo.png')
    }
  },
  computed: {
    ...mapGetters(['getUserRole'])
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
.xa-logo {
  img {
    width: 50px;
    margin-right: 20px;
  }
  .title-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    line-height: 1.2;
    .title {
      font-size: 1.5rem;
      margin-bottom: 5px;
    }
  }
}
</style>
