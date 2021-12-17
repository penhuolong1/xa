<template>
  <div class="wrapper">
    <div class="content">
      <span v-for="(item, index) in linkList" :key="'link'+index">
        <Title title="添加联系方式" @add="addPhone" @del="delPhone(index, item.id)" />
        <Description
          :ref="'link'+index"
          :schema="schema"
          :is-skeleton="isSkeleton"
          :column="2"
          :detail-data="item"
        />
      </span>
      <div class="mt-5" />
      <span v-for="(item, index) in addressList" :key="'address'+index" class="mt-2.5">
        <Title title="添加新地址" @add="addAddRess" @del="delAddRess(index, item.id)" />
        <Description
          :ref="'address'+index"
          :schema="schema1"
          :is-skeleton="isSkeleton"
          :column="2"
          :detail-data="item"
        />
      </span>
      <Description
        ref="des1"
        class="mt-5"
        :schema="schema2"
        :is-skeleton="isSkeleton"
        :column="2"
        :detail-data="detailData"
      />
    </div>
  </div>
</template>

<script>
import Description from '@/components/Description'
import { relation, addResstype } from '@/type/index.js'
import { delLitAddr, delLitPhone } from '@/api/addCase/index'
import { formatDate } from '@/utils/format.js'
import Title from './title.vue'
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
          field: 'relation',
          label: '与当事人关系',
          type: 'select',
          options: relation
        },
        {
          field: 'phone',
          label: '联系电话',
          type: 'input'
        },
        {
          field: 'remark',
          label: '标记',
          type: 'checkbox',
          options: [
            {
              value: '打印到邮单',
              label: '打印到邮单'
            }
          ]
        }
      ],
      detailData: {},
      schema1: [
        {
          field: 'type',
          label: '地址类型',
          type: 'select',
          options: addResstype
        },
        {
          field: 'validityDate',
          label: '有效期',
          type: 'date',
          showTime: true
        },
        {
          field: 'address',
          label: '详细地址',
          type: 'input',
          span: 2
        },
        {
          field: 'remark',
          label: '标记',
          type: 'checkbox',
          span: 2,
          options: [
            {
              value: '需邮寄',
              label: '需邮寄'
            },
            {
              value: '需上门',
              label: '需上门'
            },
            {
              value: '需委托',
              label: '需委托'
            },
            {
              value: '确认地址',
              label: '确认地址'
            }
          ]
        }
      ],
      schema2: [
        {
          field: 'weChat',
          label: '微信',
          type: 'input'
        },
        {
          field: 'qq',
          label: 'QQ',
          type: 'input'
        },
        {
          field: 'email',
          label: '电子邮箱',
          type: 'input'
        },
        {
          field: 'otherLink',
          label: '其他联系方式',
          type: 'input'
        },
        {
          field: 'postalCode',
          label: '邮政编码',
          type: 'input'
        }
      ],
      linkList: [
        {
          id: '',
          phone: '',
          relation: undefined,
          remark: []
        }
      ],
      addressList: [
        {
          id: '',
          type: undefined,
          address: '',
          remark: []
        }
      ],
      isSkeleton: false
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 添加地址
    addPhone() {
      this.linkList.push({
        id: '',
        phone: '',
        relation: undefined,
        remark: []
      })
    },
    addAddRess() {
      this.addressList.push({
        id: '',
        type: undefined,
        address: '',
        remark: []
      })
    },
    // 删除联系方式
    delPhone(index, id) {
      if (this.linkList.length === 1) {
        this.$message.error('至少保留一条联系方式')
        return
      }
      if (id) {
        this.$confirm({
          title: '是否删除该联系方式',
          onOk: () => {
            const params = {
              litPhoneId: id
            }
            delLitPhone(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.linkList.splice(index, 1)
                this.isSkeleton = true
                setTimeout(() => {
                  this.isSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        this.linkList.splice(index, 1)
      }
    },
    reset() {
      this.linkList = [
        {
          id: '',
          phone: '',
          relation: undefined,
          remark: []
        }
      ]
      this.addressList = [
        {
          id: '',
          type: undefined,
          address: '',
          remark: []
        }
      ]
      this.detailData = {}
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 删除地址
    delAddRess(index, id) {
      if (this.addressList.length === 1) {
        this.$message.error('至少保留一条地址信息')
        return
      }
      if (id) {
        this.$confirm({
          title: '是否删除该地址',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              litAddrId: id
            }
            delLitAddr(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.addressList.splice(index, 1)
                this.isSkeleton = true
                setTimeout(() => {
                  this.isSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        this.addressList.splice(index, 1)
      }
    },
    submit() {
      let phones = []
      let addresses = []
      for (let i = 0; i < this.linkList.length; i++) {
        const obj = { ...this.$refs[`link${i}`][0].getDate().data }
        obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
        obj.relationDescription = obj.relation
        delete obj.relation
        phones.push(obj)
      }
      for (let i = 0; i < this.addressList.length; i++) {
        const obj = { ...this.$refs[`address${i}`][0].getDate().data }
        obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
        obj.typeDescription = obj.type ? addResstype.find(item => item.value === obj.type).label : ''
        delete obj.type
        addresses.push(obj)
      }
      const obj = this.$refs.des1.getDate().data
      // 当联系方式没填的时候清空
      if (phones.length === 1 && (!phones[0].id && !phones[0].phone && !phones[0].relation && !phones[0].remark)) {
        phones = []
      }
      // 当地址没填的时候清空
      if (addresses.length === 1 && (!addresses[0].id && !addresses[0].address && !addresses[0].type && !addresses[0].remark)) {
        addresses = []
      }
      return {
        phones: phones,
        addresses: addresses,
        ...obj
      }
    },
    // 赋值
    setData(data) {
      this.isSkeleton = true
      this.linkList = data.phones && data.phones.length > 0 ? data.phones.map(item1 => {
        item1.remark = item1.remark ? item1.remark.split(',') : []
        item1.relation = item1.relationDescription
        return item1
      }) : [{
        id: '',
        phone: '',
        relation: undefined,
        remark: []
      }]
      this.addressList = data.addresses && data.addresses.length > 0 ? data.addresses.map(item1 => {
        item1.remark = item1.remark ? item1.remark.split(',') : []
        item1.validityDate = item1.validityDate ? formatDate(item1.validityDate, 'YYYY-MM-DD H:m:s') : ''
        return item1
      }) : [{
        id: '',
        type: undefined,
        address: '',
        remark: []
      }]
      const fieldType = this.schema2.map(item => item.field)
      fieldType.forEach(item => {
        this.detailData[item] = data[item]
      })
      setTimeout(() => {
        this.isSkeleton = false
      }, 500)
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
