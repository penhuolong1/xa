<template>
  <div>
    <Sticky :sticky-top="210">
      <div class=" btn-wrapper">
        <Button type="blue3" class="mr-2.5" @click="addLitiant">新增当事人</Button>
        <Button type="blue4" class="mr-2.5" @click="prev">上一步</Button>
        <Button type="green" @click="submit">下一步</Button>
      </div>
    </Sticky>
    <LitigantListItem ref="list" class="mt-2.5" :law-case="lawCase" />
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import LitigantListItem from '@/components/SfLitigantList'
import Sticky from '@/components/Sticky/index.vue'

export default {
  components: {
    Button,
    LitigantListItem,
    Sticky
  },
  props: {

  },
  data() {
    return {
      lawCase: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    addLitiant() {
      this.$refs.list.addLitiant()
    },
    submit() {
      const path = '/sfaddCase/step3'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/sfaddCase/step2')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    },
    prev() {
      const path = '/sfaddCase/step1'
      this.$router.push(path)
      this.$store.dispatch('DelTags', '/sfaddCase/step2')
      this.$store.commit('ADD_TAGVIEWLIST', path)
    }
  }
}
</script>

<style scoped lang="less">
.btn-wrapper {
  background-color: #fff;
}
</style>
