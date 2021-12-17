<template>
  <div class="wrapper">
    <div class="header"><span>{{ title }}</span></div>
    <div class="content">
      <span v-for="(item, index) in list" :key="index">
        <Title title="添加联系方式" @add="addPhone" @del="delPhone(index)" />
        <Description
          :schema="schema"
          :column="2"
          :detail-data="item"
        />
        <div class="upload-wrapper">
          <Upload :data="params" :file-list="defaultFileList" :default-file-list="defaultFileList" action="/api/court/evidence/uploadProof.jhtml" />
        </div>
      </span>
    </div>
  </div>
</template>

<script>

import Upload from '@/components/Upload/index.vue'
import Description from '@/components/Description'
import Title from './Title.vue'
export default {
  components: {
    Description,
    Title,
    Upload
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      schema: [
        {
          field: 'phone',
          label: '代理人姓名',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '代理人类型',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '法定代理人'
            },
            {
              value: 2,
              label: '委托诉讼代理人'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '与当事人的关系',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '证件类型',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '证件号',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '委托授权',
          type: 'input',
          options: [
            {
              value: 1,
              label: '一般代理'
            },
            {
              value: 2,
              label: '特别代理'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '代理人手机号',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '所在单位',
          type: 'input'
        }
      ],
      detailData: {},
      list: [
        {
          phone: '18759888263',
          value: 1
        },
        {
          phone: '18759888264',
          value: 1
        }
      ],
      params: {
        name: '123'
      },
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          response: 'Server Error 500', // custom error message to show
          url: 'http://www.baidu.com/xxx.png'
        },
        {
          uid: '2',
          name: 'yyy.png',
          status: 'done',
          url: 'http://www.baidu.com/yyy.png'
        },
        {
          uid: '3',
          name: 'zzz.png',
          status: 'error',
          url: 'http://www.baidu.com/zzz.png'
        }
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 添加地址
    addPhone() {
      this.list.push({
        phone: '123',
        value: '1'
      })
    },
    // 删除地址
    delPhone(index) {
      this.list.splice(index, 1)
    },
    preview(url) {
      console.log(url)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: flex;
  border-top: 1px solid #e8e8e8;
  .header {
    width: 50px;
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-top: none;
    border-right: none;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.2;
    font-size: 16px;
    span {
      width: 16px;
    }
  }
  .content {
    flex: 1;
  }
  .upload-wrapper {
    padding: @space-default;
    border: 1px solid #e8e8e8;
    border-top: none;
  }
}
</style>
