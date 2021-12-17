<template>
  <div>
    <div class="mb-2.5">
      <Button type="blue3" class="mr-2.5" @click="addLitiant">新增当事人</Button>
    </div>
    <LitigantListItem ref="list" :law-case="lawCase" />
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import LitigantListItem from '@/components/SfLitigantList'
export default {
  components: {
    Button,
    LitigantListItem
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
    }
  }
}
</script>

<style scoped lang="less">

</style>
