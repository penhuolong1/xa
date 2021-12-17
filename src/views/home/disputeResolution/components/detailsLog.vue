<template>
  <!-- 查看更多 -->
  <div class="box">
    <div class="title">
      解纷类型
    </div>
    <div>
      <span class="label-mediate">司法调解</span>
      <span class="label-mediate">人民调解</span>
      <span class="label-mediate">行业调解</span>
      <span class="label-mediate">律师调解</span>
      <span class="label-mediate">行政调解</span>
    </div>
    <div class="title" style="margin-top:15px">
      专业领域
    </div>
    <div style=" display: flex; flex-wrap:wrap;">
      <span v-for="(item,id) in labelList" :key="id" class="label">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    // labelList: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      labelList: [
        {
          name: '邻里关系纠纷',
          id: '1'
        },
        {
          name: '婚姻纠纷',
          id: '1'
        },
        {
          name: '邻里关系纠纷',
          id: '1'
        },
        {
          name: '邻里关系纠纷',
          id: '1'
        },
        {
          name: '婚姻纠纷',
          id: '2'
        },
        {
          name: '邻里关系纠纷',
          id: '3'
        },
        {
          name: '婚姻纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        },
        {
          name: '婚姻纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        }, {
          name: '邻里关系纠纷',
          id: '4'
        },
        {
          name: '婚姻纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        },
        {
          name: '邻里关系纠纷',
          id: '4'
        }
      ]
    }
  }

}
</script>

<style lang="less" scoped>
.box{
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(0,86,170,0.20);
    margin: auto;
    padding: 20px;
    width: 80%;
}
.title{
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 500;
    color: #606266;
    margin-bottom: 10px;

}
.label-mediate {
        font-size: 12px;
        font-weight: 400;
        color: #409eff;
        border: 1px solid #409eff;
        border-radius: 4px;
        padding: 2px 5px;
        margin: 2.5px 2.5px;
      }
      .label {
        font-size: 12px;
        font-weight: 400;
        color: #4c6bd9;
        border: 1px solid #4c6bd9;
        border-radius: 4px;
        padding: 2px 5px;
        margin: 2.5px 2.5px;
      }

</style>
