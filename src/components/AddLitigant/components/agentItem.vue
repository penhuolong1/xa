<template>
  <div>
    <Button type="danger" class="my-2.5" @click="delIndex(item, index)">删除</Button>
    <Description
      ref="agent"
      :rules="rules"
      :schema="schema"
      :is-skeleton="isSkeleton"
      :column="2"
      :detail-data="item"
      @change="change"
    />
    <span v-for="(item1, index1) in item.linkList" :key="item1.id || item1.uid">
      <Title title="添加联系方式" @add="addPhone(item)" @del="delPhone(item, index1, item1.id)" />
      <Description
        :ref="'agentlink'+index1"
        :schema="schema1"
        :is-skeleton="item.linkSkeleton"
        :column="2"
        :detail-data="item1"
      />
    </span>
    <div class="mt-5" />
    <span v-for="(item1, index1) in item.addressList" :key="item1.id || item1.uid" class="mt-2.5">
      <Title title="添加新地址" @add="addAddRess(item)" @del="delAddRess(item, index1, item1.id)" />
      <Description
        :ref="'agentaddress'+index1"
        :schema="schema2"
        :is-skeleton="item.addressSkeleton"
        :column="2"
        :detail-data="item1"
      />
    </span>
    <div class="mt-5" />
    <Description
      ref="agentOther"
      class="mt-5"
      :schema="schema3"
      :is-skeleton="isSkeleton"
      :column="2"
      :detail-data="item"
    />
  </div>
</template>

<script>

import Description from '@/components/Description'
import { Checkbox, Button } from 'ant-design-vue'
import { lawerRelation, idCardType } from '@/type/index.js'

import { delAgent, listAllAgents, delLitAddr, delLitPhone, delEvidenceFile } from '@/api/addCase/index.js'
import { schema, schema1, schema2, schema3 } from './agentSchema.js'

import Title from './title.vue'
import { mapGetters } from 'vuex'
const initObj = {
  name: '',
  type: undefined,
  relation: undefined,
  idCardType: undefined,
  idCard: '',
  delegation: undefined,
  phone: '',
  company: '',
  idCardPath: [],
  lawFirmLetter: [],
  attorneyLetter: []
}
export default {
  components: {
    Description,
    Title,
    CheckboxGroup: Checkbox.Group,
    Checkbox,
    Button
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    litigantId: {
      type: String,
      default: ''
    },
    litigationStatus: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    },
    relation: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      schema1: schema1,
      schema2: schema2,
      schema3: schema3,
      litigantAgentId: '',
      detailData: {},
      agentList: [],
      isSkeleton: false,
      list: [

      ],
      rules: {
        'name': [
          {
            type: 'required',
            msg: '代理人姓名不能为空'
          }
        ],
        'type': [
          {
            type: 'required',
            msg: '代理人类型不能为空'
          }
        ],
        'relation': [
          {
            type: 'required',
            msg: '与当事人关系不能为空'
          }
        ],
        'idCardType': [
          {
            type: 'required',
            msg: '证件类型不能为空'
          }
        ],
        'idCard': [
          {
            type: 'required',
            msg: '证件号码不能为空'
          }
        ],
        'delegation': [
          {
            type: 'required',
            msg: '授权委托不能为空'
          }
        ]
      }
    }
  },
  computed: {
    schema() {
      return [
        {
          field: 'name',
          label: '代理人姓名',
          type: 'input',
          required: true
        },
        {
          field: 'type',
          label: '代理人类型',
          type: 'radio',
          required: true,
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
          field: 'relation',
          label: '与当事人的关系',
          type: 'select',
          required: true,
          options: lawerRelation
        },
        {
          field: 'idCardType',
          label: '证件类型',
          type: 'select',
          required: true,
          options: idCardType
        },
        {
          field: 'idCard',
          label: '证件号',
          type: 'input',
          required: true
        },
        {
          field: 'delegation',
          label: '授权委托',
          type: 'select',
          required: true,
          options: [
            {
              value: 1,
              label: '一般代理'
            },
            {
              value: 2,
              label: '特别授权'
            }
          ]
        },
        {
          field: 'company',
          label: '所在单位',
          span: 2,
          type: 'input'
        },
        {
          field: 'idCardPath',
          label: '代理人证件',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/file/uploadQtwEvidenceFile',
          remove: (e) => {
            return this.removeFile(e)
          },
          vIf: () => {
            return this.relation === 2
          }
        },
        {
          field: 'lawFirmLetter',
          label: '律师事务所函',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/file/uploadQtwEvidenceFile',
          remove: (e) => {
            return this.removeFile(e)
          },
          vIf: () => {
            return this.relation === 2
          }
        },
        {
          field: 'recommendation',
          label: '推荐函',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/file/uploadQtwEvidenceFile',
          remove: (e) => {
            return this.removeFile(e)
          },
          vIf: () => {
            return this.relation === 1 || this.relation === 4 || this.relation === 5
          }
        },
        {
          field: 'law',
          label: '法律事务所函',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/file/uploadQtwEvidenceFile',
          remove: (e) => {
            return this.removeFile(e)
          },
          vIf: () => {
            return this.relation === 3
          }
        },
        {
          field: 'attorneyLetter',
          label: '授权委托书',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/agent/uploadAgentFile'
        }
      ]
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  methods: {
    change(e) {
      if (e.type === 'relation') {
        this.$emit('update:relation', e.value)
      }
    },
    // 添加联系方式
    addPhone(item) {
      item.linkList.push({
        id: '',
        uid: new Date().getTime(),
        phone: '',
        relation: '本人',
        remark: []
      })
    },
    // 添加地址
    addAddRess(item) {
      item.addressList.push({
        id: '',
        uid: new Date().getTime(),
        type: 2,
        address: '',
        remark: []
      })
    },
    // 删除手机
    async delPhone(item, index, id) {
      if (item.linkList.length === 1) {
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
                item.linkList.splice(index, 1)
                item.linkSkeleton = true
                setTimeout(() => {
                  this.linkSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        item.linkList.splice(index, 1)
      }
    },
    // 删除地址
    async delAddRess(item, index, id) {
      if (item.addressList.length === 1) {
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
                item.addressList.splice(index, 1)
                item.addressSkeleton = true
                setTimeout(() => {
                  item.addressSkeleton = false
                }, 500)
              }
            })
          },
          onCancel() {}
        })
      } else {
        item.addressList.splice(index, 1)
      }
    },
    // 删除文件
    removeFile(e) {
      if (e.fileId) {
        delEvidenceFile({ fileId: e.fileId })
      }
    },
    // 删除代理人
    delIndex(item) {
      this.$emit('delIndex', item)
    },
    reset() {
      this.list = [
      ]
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 500)
    },
    // 获取代理人详情
    getAgantInfo(e) {
      if (e.target.checked) {
        this.list.unshift(e.target.value)
        this.setData(this.list)
      } else {
        this.list = this.list && this.list.length > 0 ? this.list.filter(item => {
          return item.idCard !== e.target.value.idCard
        }) : []
      }
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 获取代理人信息
    getListAllAgents(litigantId) {
      this.agentList = []
      listAllAgents({ litigantId }).then(({ code, data }) => {
        if (code === 200) {
          if (!data || data.length === 0) {
            return
          }
          this.agentList = data
          console.log(this.agentList)
        }
      })
    },
    // 字符串转变成数字
    changeList(list) {
      if (!list) {
        return []
      }
      const list1 = list.split(',')
      const list3 = []
      list1.forEach(item1 => {
        const list2 = item1.split('/')
        const name = list2.pop()
        list3.push({
          uid: new Date().getTime(),
          name,
          url: item1
        })
      })
      return list3
    },
    // 提交
    submit() {
      let flag = false
      const obj = this.$refs['agent'].getDate()
      if (!obj.flag) { // 验证不通过
        flag = true
        throw new Error('验证不通过')
      }
      const data = { ...obj.data }
      const evidenceBOList = []
      data.attorneyLetter = data.attorneyLetter && data.attorneyLetter.length > 0 ? data.attorneyLetter.map(item => item.url).join(',') : ''
      if (data.idCardPath && data.idCardPath.length > 0) { // 代理人证件
        const obj = {
          type: 7,
          name: '代理人证件',
          evidenceId: this.item.evidenceId1 || ''
        }
        obj.fileIds = data.idCardPath.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (data.lawFirmLetter && data.lawFirmLetter.length > 0) { // 律师事务所函
        const obj = {
          type: 8,
          name: '律师事务所函',
          evidenceId: this.item.evidenceId2 || ''
        }
        obj.fileIds = data.lawFirmLetter.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (data.recommendation && data.recommendation.length > 0) { // 推荐函
        const obj = {
          type: 10,
          name: '推荐函',
          evidenceId: this.item.evidenceId3 || ''
        }
        obj.fileIds = data.recommendation.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (data.law && data.law.length > 0) { // 法律事务所函
        const obj = {
          type: 13,
          name: '法律事务所函',
          evidenceId: this.item.evidenceId4 || ''
        }
        obj.fileIds = data.law.map(item => item.id)
        evidenceBOList.push(obj)
      }
      data.evidenceBOList = evidenceBOList
      data.litigantPhoneVoList = []
      data.litigantAddressVoList = []
      if (this.item.linkList && this.item.linkList.length > 0) {
        this.item.linkList.forEach((item1, index1) => {
          const refName = 'agentlink' + index1
          const obj = { ...this.$refs[refName][0].getDate().data }
          obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
          data.litigantPhoneVoList.push(obj)
        })
      }
      if (this.item.addressList && this.item.addressList.length > 0) {
        this.item.addressList.forEach((item1, index1) => {
          const refName = 'agentaddress' + index1
          const obj = { ...this.$refs[refName][0].getDate().data }
          obj.remark = obj.remark && obj.remark.length > 0 ? obj.remark.join(',') : ''
          data.litigantAddressVoList.push(obj)
        })
      }
      const otherRefName = 'agentOther'
      const otherInfo = this.$refs[otherRefName].getDate().data
      delete data.idCardPath
      delete data.lawFirmLetter
      delete data.addressList
      delete data.recommendation
      delete data.law
      delete data.linkList
      delete data.evidenceId1
      delete data.evidenceId2
      delete data.evidenceVOList
      data.email = otherInfo.email ? otherInfo.email : ''
      data.otherLink = otherInfo.otherLink ? otherInfo.otherLink : ''
      return {
        flag: flag,
        data: data
      }
    }
  }
}
</script>

<style scoped lang="less">
.flex {
  align-items: center;
  margin-bottom: 10px;
  .ant-btn {
    margin-right: 10px;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e8e8e8;
  max-height: 500px;
  overflow: auto;
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
