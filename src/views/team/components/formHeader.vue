<template>
  <div class="table-header enter-x">
    <div class="name-box">
      <div class="avator">
        <img class="img" :src="avator || info.avatar">
      </div>
      <a v-if="isEdit" class="upload" @click="upload">上传</a>
      <input ref="file" type="file" accept=".gif, .jpg, .jpeg, .png" style="display:none;" @change="getFile($event)">
      <div class="name">
        <Input v-if="isAdd" v-model="name" :placeholder="judgeName" />
        <span v-if="!isAdd">{{ info.name?info.name:info.deptName }}</span>
      </div>
      <div class="label">
        <div v-for="(item, index) in labelList" :key="index" class="label-item" :class="'type'+index">{{ item.name }}</div>
      </div>
    </div>
    <div class="btn-wrapper">
      <slot name="btn" />
    </div>
  </div>
</template>

<script>
import { uploadSfFile } from '@/api/team/index.js'
import { Input } from 'ant-design-vue'
export default {
  components: {
    Input
  },
  props: {
    labelList: {
      type: Array,
      default: () => []
    },
    info: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    isAdd: { // 是否新增
      type: Boolean,
      default: false
    },
    judgeName: {
      type: String, // placeholder选择
      default: ''
    }
  },
  data() {
    return {
      avator: '',
      name: ''
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 上传文书
    upload() {
      const event2 = document.createEvent('MouseEvents')
      event2.initEvent('click', false, true)
      this.$refs.file.dispatchEvent(event2)
    },
    // 上传文件
    getFile(e) {
      const file = e.target.files[0]
      if (!file) return
      console.log(file)
      const param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      const hide = this.$message.loading('正在上传')
      uploadSfFile(param).then(({ code, data, msg }) => {
        hide()
        if (code === 200) {
          this.$refs.file.value = ''
          this.avator = data.filePath
          this.$message.success(msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.upload {
  margin-right: 5px;
  font-weight: bold;
}
.table-header {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  padding: 0px 20px;
  border: 1px solid #f0f0f0;
  border-bottom: none;
  .name-box {
    display: flex;
    align-items: center;
  }
  .name {
    color: #424242;
  }
  .avator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f2f5f8;
    margin-right: 10px;
  }
  .label {
    display: flex;
    .label-item {
      padding: 5px 10px;
      border-radius: 20px;
      margin-left: 10px;
      &.type0 {
        color: @theme-color;
        background-color: @theme-color-bc;
      }
      &.type1 {
        color: @btn3-color;
        background-color: @btn3-color-bc;
      }
      &.type2 {
        color: @btn2-color;
        background-color: @btn2-color-bc;
      }
    }
  }
}

</style>
