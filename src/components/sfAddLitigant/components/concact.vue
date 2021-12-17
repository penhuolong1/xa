<template>
  <div class="wrapper">
    <div class="content">
      <span v-for="(item, index) in linkList" :key="'link'+index">
        <Title v-if="isEdit" title="添加联系方式" @add="addPhone" @del="delPhone(index, item.id)" />
        <Description
          :ref="'link'+index"
          :schema="schema"
          :is-skeleton="isSkeleton"
          :detail-data="item"
        />
      </span>
      <div class="mt-5" />
      <span v-for="(item, index) in addressList" :key="'address'+index" class="mt-2.5">
        <Title v-if="isEdit" title="添加新地址" @add="addAddRess" @del="delAddRess(index, item.id)" />
        <Description
          :ref="'address'+index"
          :schema="schema1"
          :is-skeleton="isSkeleton"
          :detail-data="item"
        />
      </span>
    </div>
  </div>
</template>

<script>
import Description from '@/components/Description'
import { relation, addResstype } from '@/type/index.js'
import { delPhoneOrAddress } from '@/api/sfAddcase/index'
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
    },
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      schema: [
        {
          field: 'phoneRelation',
          label: '与当事人关系',
          type: 'select',
          options: relation
        },
        {
          field: 'phone',
          label: '联系电话',
          type: 'input'
        }
      ],
      detailData: {},
      schema1: [
        {
          field: 'addressType',
          label: '地址类型',
          type: 'select',
          options: addResstype,
          span: 1
        },
        {
          field: 'address',
          label: '详细地址',
          type: 'input'
        }
      ],
      linkList: [
        {
          id: '',
          phone: '',
          phoneRelation: '本人'
        }
      ],
      addressList: [
        {
          id: '',
          addressType: 2,
          address: ''
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
        phoneRelation: undefined
      })
    },
    addAddRess() {
      this.addressList.push({
        id: '',
        addressType: undefined,
        address: ''
      })
    },
    // 删除联系方式
    delPhone(index, id) {
      if (id) {
        this.$confirm({
          title: '是否删除该联系方式',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              type: 1,
              phoneId: id
            }
            delPhoneOrAddress(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.isSkeleton = true
                if (this.linkList.length === 1) {
                  this.linkList = [
                    {
                      id: '',
                      phone: '',
                      phoneRelation: undefined
                    }
                  ]
                } else {
                  this.linkList.splice(index, 1)
                }
                setTimeout(() => {
                  this.isSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        if (this.linkList.length === 1) {
          this.$message.error('至少保留一条联系方式')
          return
        }
        this.linkList.splice(index, 1)
      }
    },
    reset() {
      this.linkList = [
        {
          id: '',
          phone: '',
          phoneRelation: undefined
        }
      ]
      this.addressList = [
        {
          id: '',
          address: '',
          addressType: undefined
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
      if (id) {
        this.$confirm({
          title: '是否删除该地址',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              type: 2,
              addressId: id
            }
            delPhoneOrAddress(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.isSkeleton = true
                if (this.addressList.length === 1) {
                  this.addressList = [
                    {
                      id: '',
                      address: '',
                      addressType: undefined
                    }
                  ]
                } else {
                  this.addressList.splice(index, 1)
                }
                setTimeout(() => {
                  this.isSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        if (this.addressList.length === 1) {
          this.$message.error('至少保留一条地址信息')
          return
        }

        this.addressList.splice(index, 1)
      }
    },
    submit() {
      let litigantPhones = []
      let litigantAddresses = []
      for (let i = 0; i < this.linkList.length; i++) {
        const obj = { ...this.$refs[`link${i}`][0].getDate().data }
        obj.type = 1
        litigantPhones.push(obj)
      }
      for (let i = 0; i < this.addressList.length; i++) {
        const obj = { ...this.$refs[`address${i}`][0].getDate().data }
        obj.type = 2
        litigantAddresses.push(obj)
      }
      // 当联系方式没填的时候清空
      if (litigantPhones.length === 1 && (!litigantPhones[0].id && !litigantPhones[0].phone)) {
        litigantPhones = []
      }
      // 当地址没填的时候清空
      if (litigantAddresses.length === 1 && (!litigantAddresses[0].id && !litigantAddresses[0].address)) {
        litigantAddresses = []
      }
      return [
        ...litigantPhones,
        ...litigantAddresses
      ]
    },
    // 赋值
    setData(data) {
      this.isSkeleton = true
      this.linkList = data.phoneList && data.phoneList.length > 0 ? data.phoneList.map(item1 => {
        return {
          id: item1.id,
          phone: item1.phone,
          phoneRelation: item1.relation
        }
      }) : [{
        id: '',
        phone: '',
        phoneRelation: undefined
      }]
      this.addressList = data.addressList && data.addressList.length > 0 ? data.addressList.map(item1 => {
        return {
          id: item1.id,
          address: item1.address,
          addressType: item1.type
        }
      }) : [{
        id: '',
        addressType: undefined,
        address: ''
      }]
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
