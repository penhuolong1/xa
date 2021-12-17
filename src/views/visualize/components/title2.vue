<template>
  <div class="ranking-img">
    <div class="ranking">{{ title }}</div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    title: {
      type: String,
      default: ''
    }
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
.ranking-img {
  width: 100%;
  height: 30px;
  background-image: url("../../../assets/images/visualization/linkageUnit/ranking.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .ranking{
      margin: 10px 10px 0;
      color: #DFEEF3;
      font-weight: Bold;
      font-size: 16px;
  }
}
</style>
