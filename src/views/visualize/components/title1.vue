<template>
  <div class="dst-level-img">
    <div class="dst-level-title flex-center-center">
      {{ label }}<span>{{ num }}</span>{{ unit }}
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    label: {
      type: String,
      default: ''
    },
    num: {
      type: String,
      default: ''
    },
    unit: {
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
.dst-level-img {
  width: 100%;
  height: 60px;
  background-image: url("../../../assets/images/visualization/linkageUnit/unitBox.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  .dst-level-title {
    color: #eff0f1;
    font-size: 16px;
    display: flex;
    align-items: center;
    span {
      margin: -10px 10px 0;
      color: #0bb2e9;
      font-weight: Bold;
      font-size: 40px;
    }

  }
  .street-town-level{
      font-size: 12px;
    margin: 15px 0 0;
    span {
      margin: -14px 10px 0;
      color: #2CFFFD;
      font-weight: Bold;
      font-size: 40px;
    }
    .unit-name{
        color: #eff0f1;
        font-size: 16px;
        margin: 1px 0 0;
        font-weight: 500;
    }
  }
}
</style>
