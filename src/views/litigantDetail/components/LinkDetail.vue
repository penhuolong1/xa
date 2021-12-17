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
      </span>
      <span v-for="(item, index) in list" :key="index">
        <Title title="添加新地址" />
        <Description
          :schema="schema1"
          :column="2"
          :detail-data="detailData"
        />
      </span>
    </div>
  </div>
</template>

<script>
import Description from '@/components/Description'
import Title from './Title.vue'
export default {
  components: {
    Description,
    Title
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
          label: '当事人电话',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '与当事人的关系',
          type: 'select'
        }
      ],
      detailData: {},
      schema1: [
        {
          field: 'sqCaseNo',
          label: '地址类型',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '省/市/区',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '详细地址',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '标记',
          type: 'checkbox',
          options: [
            {
              value: 1,
              label: '需邮寄'
            },
            {
              value: 2,
              label: '需上门'
            },
            {
              value: 3,
              label: '需委托'
            },
            {
              value: 4,
              label: '确认地址'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '电子邮箱',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '微信号',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '邮政编码',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '其他联系方式',
          type: 'input'
        }
      ],
      list: [
        {
          phone: '18759888263',
          value: 1
        },
        {
          phone: '18759888264',
          value: 1
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
}
</style>
