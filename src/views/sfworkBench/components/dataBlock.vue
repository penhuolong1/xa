<template>
  <div class="container">
    <div class="content">
      <div class="title">{{ list[index].title }} </div>
      <div class="title">{{ list[0].value }}</div>
    </div>
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
    },
    value: {
      type: String,
      default: 100 + '件'
    },
    type: {
      type: Number,
      default: 1
    },
    index: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [{
        title: '调解成功率',
        value: null
      },
      {
        title: '在线调解率',
        value: null
      },
      {
        title: '平均化解周期',
        value: null
      }
      ]
    }
  },
  watch: {
    list() {

    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList(data) {
      this.list[0].value = data.mediateSuccessRate
      this.list[1].value = data.onlineCaseRate
      this.list[2].value = data.averageProcessDate
      this.$forceUpdate()
      console.log(this.list)
    }

  }
}
</script>

<style scoped lang="less">
.container{
  display: flex;
  flex-direction:column ;
  justify-content: center;

}
.content{
  width: 80%;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
  background: rgba(101,183,243,0.10);
border-radius: 10px;
  margin: 20px 15px;
  padding: 10px;

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
