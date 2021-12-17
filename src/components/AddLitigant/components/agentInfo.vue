<template>
  <div>
    <div class="flex">
      <Button type="primary" @click="add">添加代理人</Button>
      <div class="label">
        使用其它{{ litigationStatus }}代理人:
      </div>
      <CheckboxGroup>
        <Checkbox v-for="item in agentList" :key="item.value" :value="item" @change="getAgantInfo">{{ item.name }}</Checkbox>
      </CheckboxGroup>
    </div>
    <div class="wrapper">
      <div class="content">
        <span v-for="(item, index) in list" :key="item.litigantAgentId || item.uid">
          <AgentItem :ref="'agentItem'+(item.litigantAgentId || item.uid)" :item="item" :relation.sync="item.relation" @delIndex="(e) => {delIndex(e, index)}" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import Description from '@/components/Description'
import { Checkbox, Button } from 'ant-design-vue'
import { lawerRelation, idCardType } from '@/type/index.js'

import { delAgent, listAllAgents, delLitAddr, delLitPhone, delEvidenceFile } from '@/api/addCase/index.js'
import { schema, schema1, schema2, schema3 } from './agentSchema.js'
import AgentItem from './agentItem.vue'
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
    AgentItem,
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
    }
  },
  data() {
    return {
      schema: [
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
      ],
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
  },
  watch: {
  },
  created() {

  },
  mounted() {
  },
  methods: {
    // 添加代理人
    add() {
      this.list.unshift(
        {
          uid: new Date().getTime(),
          name: '',
          type: 2,
          relation: 2,
          idCardType: 10,
          idCard: '',
          delegation: 2,
          phone: '',
          company: '',
          idCardPath: [],
          lawFirmLetter: [],
          attorneyLetter: [],
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
          ]
        }
      )
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 删除代理人
    delIndex(item, index) {
      if (item.litigantAgentId) {
        this.$confirm({
          title: '是否删除该代理人',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              litigantAgentId: item.litigantAgentId
            }
            delAgent(params).then(({ code, msg }) => {
              if (code === 200) {
                this.$message.success(msg)
                this.list.splice(index, 1)
                this.$emit('done')
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
        this.list.splice(index, 1)
      }
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
        this.list.unshift({ ...e.target.value })
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
      const list = []
      let flag = false
      this.list.forEach(item => {
        const refsName = 'agentItem' + (item.litigantAgentId || item.uid)
        const data = this.$refs[refsName][0].submit().data
        list.push(data)
        if (this.$refs[refsName][0].submit().flag) {
          flag = true
        }
      })
      return {
        flag,
        data: list
      }
    },
    // 赋值
    setData(data, isnoReset) {
      if (!data || data.length === 0) {
        this.list = []
        return
      }
      this.isSkeleton = true
      if (!isnoReset) { // 不需要清空数组
        this.list = []
      }
      data.forEach(item => {
        item.linkList = item.litigantPhoneVoList && item.litigantPhoneVoList.length > 0 ? item.litigantPhoneVoList.map(item1 => {
          item1.remark = item1.remark && typeof (item1.remark) === 'string' ? item1.remark.split(',') : []
          return item1
        }) : [{
          id: '',
          phone: '',
          relation: undefined,
          remark: []
        }]
        item.addressList = item.litigantAddressVoList && item.litigantAddressVoList.length > 0 ? item.litigantAddressVoList.map(item1 => {
          item1.remark = item1.remark && typeof (item1.remark) === 'string' ? item1.remark.split(',') : []
          item1.validityDate = item1.validityDate ? this.$moment(item1.validityDate).format('YYYY-MM-DD HH:mm:ss') : ''
          return item1
        }) : [{
          id: '',
          type: undefined,
          address: '',
          remark: []
        }]
        if (item.evidenceVOList && item.evidenceVOList.length > 0) {
          item.idCardPath = []
          item.lawFirmLetter = []
          item.evidenceVOList.forEach(item1 => {
            if (item1.name === '代理人证件') {
              item.evidenceId1 = item1.evidenceId // 代理人证件证据id
              item.idCardPath = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
                return {
                  fileId: item2.fileId,
                  uid: item2.fileId,
                  name: item2.fileName,
                  url: item2.fileUrl,
                  id: item2.fileId,
                  path: item2.fileUrl
                }
              }) : []
            }
            if (item1.name === '律师事务所函') {
              item.evidenceId2 = item1.evidenceId // 律师事务所函证据id
              item.lawFirmLetter = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
                return {
                  fileId: item2.fileId,
                  uid: item2.fileId,
                  name: item2.fileName,
                  url: item2.fileUrl,
                  id: item2.fileId,
                  path: item2.fileUrl
                }
              }) : []
            }
            if (item1.name === '推荐函') {
              item.evidenceId3 = item1.evidenceId // 推荐函id
              item.recommendation = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
                return {
                  fileId: item2.fileId,
                  uid: item2.fileId,
                  name: item2.fileName,
                  url: item2.fileUrl,
                  id: item2.fileId,
                  path: item2.fileUrl
                }
              }) : []
            }
            if (item1.name === '法律事务所函') {
              item.evidenceId4 = item1.evidenceId // 法律事务所函id
              item.law = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
                return {
                  fileId: item2.fileId,
                  uid: item2.fileId,
                  name: item2.fileName,
                  url: item2.fileUrl,
                  id: item2.fileId,
                  path: item2.fileUrl
                }
              }) : []
            }
          })
        }
        if (item.attorneyLetter) {
          item.attorneyLetter = !Array.isArray(item.attorneyLetter) ? this.changeList(item.attorneyLetter) : item.attorneyLetter
        }
        const obj = {}
        for (const key in { ...initObj }) {
          obj[key] = item[key]
        }
        this.list.push(item)
        console.log(this.list)
      })
      setTimeout(() => {
        this.isSkeleton = false
      }, 500)
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
