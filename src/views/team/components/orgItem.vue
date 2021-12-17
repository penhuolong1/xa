<template>
  <div class="item-wrapper">
    <div class="inner">
      <div class="header">
        <div class="avator" />
        <div class="name-box">
          <div class="name">{{ orgInfo.deptName }}</div>
          <div class="btn-box">
            <a @click="orgDetail(orgInfo.deptId)">查看</a>
            <a>联络</a>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in list" :key="index" class="info-wrapper">
        <div class="info-left">
          <div class="icon">
            <img :src="item.icon">
          </div>
          <div class="label">{{ item.label }}</div>
        </div>
        <div class="value">{{ item.value }}</div>
      </div>
      <div class="footer">
        <div class="footer-item1">
          <div class="icon-box">
            <div>解纷员</div>
          </div>
          <div>{{ orgInfo.mediatorCount? orgInfo.mediatorCount:0 }}人</div>
        </div>
        <div class="footer-item2">
          <div class="icon-box">
            <div>化解数</div>
          </div>
          <div>{{ orgInfo.resolveInfo.resolveSuccessCount? orgInfo.resolveInfo.resolveSuccessCount:0 }}件</div>
        </div>
        <div class="footer-item3">
          <div class="icon-box">
            <div>成功率</div>
          </div>
          <div>{{ orgInfo.resolveInfo.resolveSuccessRate? orgInfo.resolveInfo.resolveSuccessRate:0 }}</div>
        </div>
      </div>
    </div>
    <AddOrEditOrg ref="detailShow" :is-add="isAdd" />
  </div>
</template>

<script>
import AddOrEditOrg from './addOrEditOrg.vue'
export default {
  components: {
    AddOrEditOrg
  },
  props: {
    orgInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isAdd: false,
      list: [
        {
          icon: require('@/assets/icons/med6.png'),
          label: '联系方式',
          value: ''
        },
        {
          icon: require('@/assets/icons/med1.png'),
          label: '办公地址',
          value: ''
        },
        {
          icon: require('@/assets/icons/med2.png'),
          label: '隶属',
          value: ''
        },
        {
          icon: require('@/assets/icons/med3.png'),
          label: '组织类型',
          value: ''
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    getList() {
      this.list[0].value = this.orgInfo.concatPersonInfo
      this.list[1].value = this.orgInfo.address
      this.list[2].value = this.orgInfo.belongs
      this.list[3].value = this.orgInfo.deptType
    },
    orgDetail(e) {
      console.log(e)
      this.isAdd = false
      this.$refs.detailShow.Show(e)
    }
  }
}
</script>

<style scoped lang="less" src="./item.less"></style>
<style>

</style>
