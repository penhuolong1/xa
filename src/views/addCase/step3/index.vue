<template>
  <div>
    <Sticky :sticky-top="210">
      <div class="b-w">
        <Button type="blue4" class="mr-2.5" @click="prev">上一步</Button>
        <Button type="green" @click="submit">下一步</Button>
      </div>
    </Sticky>
    <Book class="enter-X mt-2.5" />
    <!-- 转下一流程 -->
    <Next ref="next" :select-key="[{lawCaseId:getLawCaseId}]" :next-list="nextList" @done="done" @cancel="cancel" />
    <Freeze ref="free" :select-key="[{lawCaseId:getLawCaseId}]" @done="done1" @cancel="cancel" />

  </div>
</template>

<script>
import Book from '@/components/Book'
import { Button } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import Sticky from '@/components/Sticky/index.vue'
import Freeze from '@/views/acceptCase/readyCase/components/free'
import Next from '@/components/NextStep'
import { completeAddCase } from '@/api/addCase/index.js'
export default {
  components: {
    Button,
    Book,
    Next,
    Freeze,
    Sticky
  },
  props: {

  },
  data() {
    return {
      nextList: [
        {
          value: 1,
          label: '送达中待指派'
        },
        {
          value: 7,
          label: '结案'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {
    this.addCaseInfo = JSON.parse(localStorage.getItem('addCaseInfo'))
  },
  mounted() {

  },
  methods: {
    submit() {
      if (localStorage.getItem('addCaseType') == 1) {
        const params = {
          lawCaseId: this.getLawCaseId,
          formal: 1
        }
        completeAddCase(params).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            this.selectKey = [{
              lawCaseId: this.getLawCaseId
            }]
            if (this.addCaseInfo) { // 如果需要诉讼保全
              this.$refs.free.show(1, this.addCaseInfo.canSendDate)
              return
            }
            if (this.addCaseInfo) { // 如果需要司法鉴定
              this.$refs.free.show(2)
              return
            }
            this.$refs.next.show()
          }
        })
      } else {
        const path = '/addCase/step4'
        this.$router.push(path)
        this.$store.dispatch('DelTags', path)
        this.$store.commit('ADD_TAGVIEWLIST', path)
      }
    },
    prev() {
      const path = '/addCase/step2'
      this.$router.push(path)
      this.$store.dispatch('DelTags', path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    done() {
      const path = '/collectCase/waitSend'
      this.$router.push(path)
      this.$store.dispatch('DelTags', path)
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    // 冻结案件成功后触发
    done1(type) {
      if (type == 1) { // 保全成功
        if (this.addCaseInfo.judicialExpertise) { // 如果需要司法鉴定
          setTimeout(() => {
            this.$refs.free.show(2)
          }, 200)
          return
        }
        const path = '/caseManage/savecase'
        this.$router.push(path)
        this.$store.dispatch('DelTags', '/addCase/step4')
        this.$store.commit('ADD_TAGVIEWLIST', path)
        localStorage.removeItem('addCaseInfo')
      } else { // 鉴定成功
        const path = '/caseManage/appraisalcase'
        this.$router.push(path)
        this.$store.dispatch('DelTags', '/addCase/step4')
        this.$store.commit('ADD_TAGVIEWLIST', path)
        localStorage.removeItem('addCaseInfo')
      }
    },
    cancel() {
      this.$router.push('/collectCase/waitSend')
    }
  }
}
</script>

<style scoped lang="less">

</style>
