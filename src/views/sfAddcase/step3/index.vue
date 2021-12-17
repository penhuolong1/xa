<template>
  <div>
    <Sticky :sticky-top="210">
      <div class="btn-wrapper">
        <Button type="blue3" class="mr-2.5" @click="addEvidence">新增证据</Button>
        <Button type="blue4" class="mr-2.5" @click="prev">上一步</Button>
        <Button type="green" @click="submit">下一步</Button>
      </div>
    </Sticky>
    <div class="mb-2.5 mt-2.5 enter-X">
      <h1 class="title">证据材料</h1>
      <EvidenceList ref="evidenceList" />
      <h1 class="title">其他材料</h1>
      <SfOtherMaterial />
    </div>
    <div class="text-center" />
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import { mapGetters } from 'vuex'
import EvidenceList from '@/components/SfEvidenceList/index'
import SfOtherMaterial from '@/components/SfOtherMaterial/index'
import Sticky from '@/components/Sticky/index.vue'

export default {
  components: {
    Button,
    EvidenceList,
    SfOtherMaterial,
    Sticky
  },
  props: {

  },
  data() {
    return {
      selectKey: []
    }
  },
  computed: {
    ...mapGetters(['getLawCaseId'])
  },
  created() {

  },
  mounted() {

  },
  methods: {
    submit() {
      const path = '/sfaddCase/step4'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/sfaddCase/step3')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    prev() {
      const path = '/sfaddCase/step2'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/sfaddCase/step3')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    // 添加证据
    addEvidence() {
      this.$refs.evidenceList.addEvidence()
    }
  }
}
</script>

<style scoped lang="less">
.title {
  font-size: 16px;
  margin-top: 20px;
}
.btn-wrapper {
  background-color: #fff;
}
</style>
