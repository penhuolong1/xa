<template>
  <div class="wrapper">
    <div class="flex">
      <h1>当事人信息</h1>
    </div>
    <ul class="content">
      <li v-for="item in list" :key="item.id" class="txt" @click="lookDetail(item)">{{ item.name }}</li>
    </ul>
    <AddLitigant v-if="$route.query.type == 1" ref="addLitigant" @done="init" />
    <SfAddLitigant v-if="$route.query.type == 2" ref="sfAddLitigant" @done="init" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryLitigant } from '@/api/addCase/index'
import { listShortInfo } from '@/api/sfAddcase/index'
import AddLitigant from '@/components/AddLitigant/index'
import SfAddLitigant from '@/components/sfAddLitigant/index'

export default {
  components: {
    AddLitigant,
    SfAddLitigant
  },
  props: {},
  data() {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId', 'getSfLawCaseId'])
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      if (this.$route.query.type == 1 || this.$route.query.type == 3) { // 法院或法院联动的案件
        this.getLitigant()
      } else {
        this.getsfLitigant()
      }
    },
    // 法院查看当事人信息
    getLitigant() {
      if (!this.getLawCaseId) {
        return
      }
      queryLitigant({ lawCaseId: this.getLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              id: item.id,
              name: item.agentFlag ? `${item.litigationStatus.name}(代理人) ${item.name}` : `${item.litigationStatus.name} ${item.name}`,
              agentFlag: item.agentFlag
            }
          })
        }
      })
    },
    // 诉非查看当事人信息
    getsfLitigant() {
      if (!this.getSfLawCaseId) {
        return
      }
      listShortInfo({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.list = data.map(item => {
            return {
              id: item.id,
              name: item.statusName + ' ' + item.name,
              agentFlag: item.agentFlag
            }
          })
        }
      })
    },
    // 查看详情
    lookDetail(e) {
      if (this.$route.query.type == 1) {
        this.$refs.addLitigant.show(e.id, 1, e.agentFlag)
      } else {
        this.$refs.sfAddLitigant.show(e.id, 1, e.agentFlag)
      }
    }
  }
}
</script>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less">
ul {
  li {
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>
