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
            },
            {
              value: '明确送达联系方式',
              label: '明确送达联系方式'
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
              value: '打印到邮单',
              label: '打印到邮单'
            },
            {
              value: '明确送达地址',
              label: '明确送达地址'
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
          relation: '本人',
          remark: []
        }
      ],
      addressList: [
        {
          id: '',
          type: 2,
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
        relation: '本人',
        remark: []
      })
    },
    addAddRess() {
      this.addressList.push({
        id: '',
        type: 2,
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
          okText: '确定',
          cancelText: '取消',
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
          relation: '本人',
          remark: []
        }
      ]
      this.addressList = [
        {
          id: '',
          type: 2,
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
      let litigantPhones = []
      let litigantAddresses = []
      for (let i = 0; i < this.linkList.length; i++) {
        const obj = { ...this.$refs[`link${i}`][0].getDate().data }
        obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
        litigantPhones.push(obj)
      }
      for (let i = 0; i < this.addressList.length; i++) {
        const obj = { ...this.$refs[`address${i}`][0].getDate().data }
        obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
        litigantAddresses.push(obj)
      }
      const obj = this.$refs.des1.getDate().data
      // 当联系方式没填的时候清空
      if (litigantPhones.length === 1 && (!litigantPhones[0].id && !litigantPhones[0].phone && !litigantPhones[0].relation && !litigantPhones[0].remark)) {
        litigantPhones = []
      }
      // 当地址没填的时候清空
      if (litigantAddresses.length === 1 && (!litigantAddresses[0].id && !litigantAddresses[0].address && !litigantAddresses[0].type && !litigantAddresses[0].remark)) {
        litigantAddresses = []
      }
      return {
        litigantPhones: litigantPhones,
        litigantAddresses: litigantAddresses,
        ...obj
      }
    },
    // 赋值
    setData(data) {
      this.isSkeleton = true
      this.linkList = data.litigantPhones && data.litigantPhones.length > 0 ? data.litigantPhones.map(item1 => {
        item1.remark = item1.remark ? item1.remark.split(',') : []
        return item1
      }) : [{
        id: '',
        phone: '',
        relation: undefined,
        remark: []
      }]
      this.addressList = data.litigantAddresses && data.litigantAddresses.length > 0 ? data.litigantAddresses.map(item1 => {
        item1.remark = item1.remark ? item1.remark.split(',') : []
        item1.validityDate = item1.validityDate ? this.$moment(item1.validityDate).format('YYYY-MM-DD HH:mm:ss') : ''
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
