<template>
  <div class="add-link-wrapper">
    <div v-if="isEdit" class="add-btn-wrapper">
      <div class="left">
        <div class="icon" @click="addLink">+</div>
        <a @click="addLink">添加联系人</a>
      </div>
      <div class="right">
        *注意：创建的联络人员的账号位手机号，初始密码123456，请尽快通知相关人员进行密码修改。
      </div>
    </div>
    <div class="content-wrapper">
      <div v-for="(item, index) in list" :key="index" class="link-item">
        <div class="link-label"><div v-if="isEdit" class="icon" @click="del(index, item.id)">-</div>联络人</div>
        <div class="link-value"><span v-if="!isEdit">{{ item.name }}</span><Input v-if="isEdit" v-model="item.name" placeholder="请输入" /></div>
        <div class="link-label">联系方式</div>
        <div class="link-value"><Encrypt :id="item.id" v-model="item.phone" :is-edit="isEdit" placeholder="请输入" /></div>
      </div>
    </div>
  </div>

</template>

<script>
import { Input } from 'ant-design-vue'
import Encrypt from './encrypt.vue'
export default {
  components: {
    Input,
    Encrypt
  },
  props: {
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    },
    defaultList: {
      type: Array,
      default: () => [
        {
          name: '',
          phone: ''
        }
      ]
    }
  },
  data() {
    return {
      list: [
        {
          name: '',
          phone: ''
        }
      ],
      deletePeoples: [] // 删除的联络人
    }
  },
  watch: {
    defaultList() {
      this.list = this.defaultList
    }
  },
  created() {

  },
  mounted() {
    this.list = this.defaultList
  },
  methods: {
    addLink() {
      this.list.push(
        {
          name: '',
          phone: ''
        }
      )
    },
    del(index, id) {
      if (id) {
        this.deletePeoples.push(id)
        this.$emit('getDel', this.deletePeoples)
      }
      this.list.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-input:focus {
  box-shadow: none;
}
/deep/.ant-input {
  border: none;
}
.icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #fff;
  margin-right: 10px;
  #center();
  cursor: pointer;
}
.add-btn-wrapper {
  padding: 12px 24px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-top: none;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .icon {
      background-color: @theme-color;
    }
  }
}
.link-item {
  display: flex;
   border: 1px solid #e8e8e8;
  border-top: none;
  .link-label {
    width: 180px;
    padding: 12px 24px;
    background-color: #fafafa;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    .icon {
      background-color: rgba(255,77,79,1);
      padding-bottom: 4px;
    }
    &:first-child {
      border-left: none;
    }
  }
  .link-value {
    padding: 12px 24px;
    flex: 1;
  }
}
</style>
