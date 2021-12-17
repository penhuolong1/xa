<template>
  <div class="wrapper">
    <List item-layout="horizontal" :data-source="listdata">
      <ListItem v-for="(item,index) in listdata" :key="index" slot="renderItem" slot-scope="item, index" @click="detail(item)">
        <a>{{ item.dipName }}</a>
        <div class="detail">
          <a>详情</a>
          <Icon type="right" />
        </div>
      </ListItem>
    </List>
    <!-- <Preview ref="preview" :file-list="fileList" /> -->

  </div>
</template>
<script>
import { mobile } from '@/api/freeze/index.js'
import { List, Icon } from 'ant-design-vue'
// import Preview from '@/components/Preview/index'

export default {
  components: {
    List,
    ListItem: List.Item,
    // Preview,
    Icon
  },
  props: {
  },
  data() {
    return {
      listdata: [],
      fileList: []
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        sendId: this.$route.query.sendId
      }
      mobile(params).then(({ code, data }) => {
        if (code === 200) {
          this.listdata = data
        }
      })
    },
    detail(item) {
      location.href = item.dipPath
    }
  }
}
</script>

<style scoped lang="less">
.wrapper{
  padding: 10px 20px;
  a{
  font-size:16px;

  }
}
.detail{
  display: flex;
  justify-content: center;
  align-items: center;
  float:right;
}
/deep/.anticon {
  margin-left: 10px;
}
</style>
