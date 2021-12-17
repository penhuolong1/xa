<template>
  <div v-if="getIsPhone" class="container">
    <div class="header">
      <span>电话列表</span>
      <InputSearch
        v-model="phone"
        style="width: 200px;margin-left:30px"
        placeholder="搜索相关"
        enter-button
        @search="getPhoneList"
      />
    </div>
    <Divider />
    <Spin :spinning="spinning">
      <Empty v-if="isEmpty" />
      <div v-if="!isEmpty" class="phoneList">
        <a class="clear" @click="deletePhone">清空</a>
        <div v-for="(item,index) in phoneList" :key="index" class="phone-content">
          <div class="flex1">
            <div class="iconList">
              <div :class="item.callType1==='去电'?'circle1':'circle'">{{ item.callType1 }}</div>
              <Icon type="minus-circle" theme="filled" class="delete" @click="deletePhone(item)" />
            </div>
            <div style="padding:0 10px">
              <div class="flex">
                <span style="font-size:16px">电话号码：{{ item.phone }}</span>
                <div class="btn" @click="associate(item)">关联</div>
              </div>
              <span style="color:#8F92A1">来电时间：{{ item.startTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </Spin>

    <Associate ref="associateShow" @done="getPhoneList" />
  </div>
</template>
<script>
import { Input, Divider, Icon, Drawer, Spin, Empty } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import { listInfoByPhone, listTempCallLog, delCallLog } from '@/api/freeze/index.js'
import Associate from './associate.vue'
export default {
  components: {
    InputSearch: Input.Search,
    Divider,
    Icon,
    Associate,
    Spin,
    Empty
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      phone: '',
      isEmpty: false,
      spinning: false,
      phoneList: [],
      callType: {
        1: '去电',
        2: '来电'
      }
    }
  },
  computed: {
    ...mapGetters(['getIsPhone'])
  },
  watch: {
    getIsPhone(newVal) {
      console.log(newVal)
      if (newVal) {
        this.getPhoneList()
      }
    }
  },
  created() {
    console.log(this.isPhone)
  },
  mounted() {
  },
  methods: {
    // onSearch() {
    //   listInfoByPhone({ phone: this.phone }).then(({ code, dat }))
    // },
    // 获取暂存电话列表
    getPhoneList() {
      this.spinning = true
      const params = {
        phone: this.phone ? this.phone : null
      }
      listTempCallLog(params).then(res => {
        this.spinning = false

        if (res.code === 200) {
          if (res.rows && res.rows.length > 0) {
            this.isEmpty = false
            this.phoneList = res.rows.map(item => {
              item.callType1 = this.callType[item.callType]
              return item
            })
          } else {
            this.isEmpty = true
          }
        }
      })
    },
    // 删除电话信息
    deletePhone(item) {
      console.log(item)
      this.$confirm({
        title: '是否删除该通话记录',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const params = {
            ids: item.id ? [item.id] : null
          }
          delCallLog(params).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.getPhoneList()
            }
          })
        },
        onCancel() {}
      })
    },
    // 关联信息
    associate(e) {
      this.$refs.associateShow.Show(e)
    }

  }
}
</script>

<style scoped lang="less">
.flex{
  display:flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.flex1{
  display: flex;
  align-items: center;
  // justify-content: center;
}
.container{
  width:30%;
  margin-top:-80px;
  height: 100%;
  position: absolute;
  right: 0px;
  background-color: white;
  padding:10px;
  border-left-style:solid;
  border-color:rgb(189, 187, 187);
  border-width:1px;
       box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);

}
.header{
  display: flex;
  align-items: center;
  font-size: 20px;
}
.clear{
  float:right;
  margin-right:20px;
  color: #177DDC;
}

.phone-content{
  padding:20px 10px;
}
.iconList{
  display: flex;
}
.delete{
  font-size:20px;
  margin-top:-10px;
  color:#FF6C2D;
  margin-left: -12px;
}
.circle{
  border-radius: 50%;
  margin-left: 20px;
  margin-top: -10px;
	width: 60px;
	height: 60px;
  display: flex;
  align-items: center;
  background: rgba(244, 250, 254);
  color:#8DCFF8;
  justify-content: center;
}
.circle1{
   border-radius: 50%;
  margin-left: 20px;
  margin-top: -10px;
	width: 60px;
	height: 60px;
  display: flex;
  align-items: center;
  background: rgb(240, 249, 241);;
  color:#65BF73;
  justify-content: center;
}
.btn{
  width: 80px;
  padding:5px 10px;
  background-color: rgba(23,125,220,1);
  color:rgb(200, 224, 246);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 100px;
  cursor: pointer;
}
</style>
