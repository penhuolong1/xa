<template>
  <div class="wrapper">
    <div class="flex">
      <h1>文书材料</h1>
      <!-- <div class="btn-wrapper"> -->
      <!-- <img src="@/assets/icons/upload.png" alt="">
        <span>上传</span> -->
      <!-- </div> -->
    </div>
    <ul class="content">
      <li v-for="item in list" :key="item.id" class="txt" @click="preview(item)">
        <img src="@/assets/icons/file.png" alt="">
        <a>{{ item.name }}</a>
      </li>
    </ul>
    <Preview ref="preview" :file-list="fileList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listOfCatalog } from '@/api/sfBook/index.js'
import { queryArchiveFile } from '@/api/book/index.js'

import Preview from '@/components/Preview/index'

export default {
  components: {
    Preview
  },
  props: {},
  data() {
    return {
      list: [],
      fileList: []
    }
  },
  computed: {
    ...mapGetters(['getCaseInfo', 'getSfLawCaseId', 'getLawCaseId'])
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      if (this.$route.query.type == 1 || this.$route.query.type == 3) { // 法院或法院联动的案件
        this.getFile()
      } else {
        this.getSfFile()
      }
    },
    getSfFile() {
      this.list = []
      listOfCatalog({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.files
        }
      })
    },
    getFile() {
      this.list = []
      queryArchiveFile({ lawCaseId: this.getLawCaseId, pageSize: 1000 }).then(({ code, data }) => {
        if (code === 200) {
          this.list = data.rows
        }
      })
    },
    preview(e) {
      this.$refs.preview.show(e.path, [])
    }
  }
}
</script>
<style scoped lang="less" src="./index.less"></style>
<style scoped lang="less">

</style>
