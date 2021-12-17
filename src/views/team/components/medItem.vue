<template>
  <!-- <Spin v-if="loading"> -->
  <div class="item-wrapper">
    <div class="inner">
      <div class="header">
        <div class="avator" />
        <div class="name-box">
          <div class="name">{{ medInfo.name }}</div>
          <div class="btn-box">
            <a @click="check(medInfo.id)">查看</a>
            <a @click="remove(medInfo.id)">解除</a>
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
        <div class="footer-item">
          <div class="icon-box">
            <img src="@/assets/icons/med4.png" alt="">
            <div>化解数</div>
          </div>
          <div class="num">{{ medInfo.resolveSuccessCount?medInfo.resolveSuccessCount:0 }}件</div>
        </div>
        <div class="footer-item">
          <div class="icon-box">
            <img src="@/assets/icons/med5.png" alt="">
            <div>成功率</div>
          </div>
          <div class="num num1">{{ medInfo.resolveSuccessRate?medInfo.resolveSuccessRate:'0%' }}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- </Spin> -->
</template>

<script>
import { Spin } from 'ant-design-vue'
import AddOrUpDateMed from './addOrUpdateMed.vue'
import { mediatorBelongs, banOrLink } from '@/api/team/index.js'

export default {
  components: {
    Spin
  },
  props: {
    medInfo: {
      type: Object,
      default: () => {}
    }
    // loading: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      loading: false,
      deptId: null,
      list: [
        {
          icon: require('@/assets/icons/med1.png'),
          label: '联系方式',
          value: ''
        },
        {
          icon: require('@/assets/icons/med1.png'),
          label: '专业领域',
          value: ''
        },
        {
          icon: require('@/assets/icons/med2.png'),
          label: '隶属',
          value: ''
        },
        {
          icon: require('@/assets/icons/med3.png'),
          label: '解纷类型',
          value: ''
        }
      ]
    }
  },
  created() {
    console.log(this.medInfo)
    this.getDetail()
  },
  mounted() {

  },
  methods: {
    getDetail() {
      this.list[0].value = this.medInfo.phone
      this.list[1].value = this.medInfo.mainResponsibility
      this.list[2].value = this.medInfo.belongs
      this.list[3].value = this.medInfo.mediateType
    },
    check(e) {
      this.$emit('look', e)
    },
    // 获取相关组织
    getMediator(mediatorId) {
      mediatorBelongs(mediatorId).then(({ code, data }) => {
        if (code === 200) {
          this.deptId = data[0].deptId
        }
      })
    },
    // 解除
    remove(mediatorId) {
      this.getMediator(mediatorId)
      this.$confirm({
        title: '是否解除关系',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          banOrLink(mediatorId, this.deptId).then(({ code, msg }) => {
            if (code === 200) {
              this.$message.success(msg)
              this.$emit('done')
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style scoped lang="less" src="./item.less">

</style>
