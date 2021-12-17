<template>
  <!-- 单位详情 -->
  <div class="page">
    <Modal
      v-model="visible"
      class="modal"
      :mask-closable="true"
      width="60%"
      :footer="false"
      @cancel="visible = false"
    >
      <div style="margin:0 0 20px 0">
        <Menu :current="currentArr" :menu-list="menuList" @choice="choice" />
      </div>
      <div>
        <LinkageUnitLog />
      </div>
    </Modal>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import Menu from '../../../components/menuVertically.vue'
import LinkageUnitLog from './linkageUnitLog.vue'
export default {
  components: {
    Menu,
    Modal,
    LinkageUnitLog
  },
  data() {
    return {
      currentArr: [0],
      visible: false,
      menuList: [
        {
          name: '旗下联动单位',
          key: '1',
          url: ''
        },
        {
          name: '旗下解纷组织',
          key: '2',
          url: ''
        },
        {
          name: '旗下解纷员',
          key: '3',
          url: ''
        }
      ]
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    choice(e) {
      console.log('e', e)
    }
    // 上一页
    // prevDateapp() {
    //   var curren = this.appCurrenPage// 当前
    //   var total = Math.ceil(this.total / 10)// 页数
    //   if (curren == 1) {
    //     this.openIsDisabled = true
    //     this.$message.error('当前是第一页')
    //   } else {
    //     this.closeIsDisabled = false
    //     if (curren > 1) {
    //       curren = curren - 1
    //       var sdate = this.sdateapp
    //       var edate = this.edateapp
    //       this.$message.error('网络异常，请检查您的网络')
    //     }
    //     this.appCurrenPage = curren
    //   }
    // }

    // 下一页
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body{
  padding: 20px 0;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}
.page {
  position: relative;
  min-width: 1200px;
  height: 100vh;
}
.screen {
  background: #f2f5fa;
  box-shadow: 0px 4px 20px 0px rgba(0, 86, 170, 0.05);
  padding: 10px 20px;
  font-size: 14px;
  width: 100%;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  span {
    color: #909399;
    margin: 0 2.5px;
    cursor: pointer;
  }
  span:active {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
