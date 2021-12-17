<template>
  <div class="container">
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="upOrdown">
      <div>本日下降</div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      title: '司法确认数'
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
.container{
  padding: 10px;
  display: flex;
  flex-direction:column ;
  justify-content: center;
  background: rgba(101,183,243,0.10);
  border-radius: 10px;
  margin-bottom: 20px;
}
.content{
  display: flex;
  justify-content: space-between;
}
.title{
  font-size: 20px;
  font-weight: 700;
  color: #242f57;
}
.upOrdown{
  display: flex;
  justify-content: space-between;
  div{
    color: rgba(0,0,0,0.85);
    font-size: 14px;
  }
}
</style>
