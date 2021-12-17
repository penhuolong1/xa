<template>
  <div>
    <div class="flex">
      <Button type="primary" @click="add">添加代理人</Button>
      <div class="label">
        使用其它{{ litigationStatus == 4 ? '申请人':'被申请人' }}的代理人:
      </div>
      <CheckboxGroup @change="getAgantInfo">
        <Checkbox v-for="item in agentList" :key="item.value" :value="item">{{ item.name }}</Checkbox>
      </CheckboxGroup>
    </div>
    <div class="wrapper">
      <div class="content">
        <span v-for="(item, index) in list" :key="index">
          <Button type="danger" class="my-2.5" @click="delIndex(item, index)">删除</Button>
          <Description
            :ref="'agent'+index"
            :rules="rules"
            :schema="schema"
            :is-skeleton="isSkeleton"
            :column="2"
            :detail-data="item"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import Description from '@/components/Description'
import { Radio, Checkbox, Button } from 'ant-design-vue'
import { lawerRelation, idCardType } from '@/type/index.js'
import { listAgentByStatus, delAgent } from '@/api/sfAddcase/index.js'
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
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
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
          label: '委托授权',
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
          field: 'phone',
          label: '代理人手机号',
          type: 'input'
        },
        {
          field: 'company',
          label: '所在单位',
          type: 'input'
        },
        {
          field: 'idCardPath',
          label: '代理人证件',
          span: 2,
          type: 'upload',
          showType: 'filePath',
          isEdit: this.isEdit,
          action: '/api/sf/file/uploadSfFile',
          success: () => {}
        },
        {
          field: 'lawFirmLetter',
          label: '律师事务所函',
          span: 2,
          type: 'upload',
          showType: 'filePath',
          isEdit: this.isEdit,
          action: '/api/sf/file/uploadSfFile',
          success: () => {}
        },
        {
          field: 'attorneyLetter',
          label: '授权委托书',
          span: 2,
          type: 'upload',
          showType: 'filePath',
          isEdit: this.isEdit,
          action: '/api/sf/file/uploadSfFile',
          success: () => {}
        }
      ],
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
      if (this.list && this.list.length > 0) {
        this.list.forEach((item, index) => {
          this.$refs['agent' + index][0].getUploadData()
        })
      }
      this.list.unshift(
        {
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
      )
      this.isSkeleton = true
      setTimeout(() => {
        this.isSkeleton = false
      }, 200)
    },
    // 删除代理人
    delIndex(item, index) {
      if (item.id) {
        this.$confirm({
          title: '是否删除该代理人',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            const params = {
              sfLitigantAgentId: item.id
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
      if (!e || e.length === 0) {
        this.list = []
        this.isSkeleton = true
        setTimeout(() => {
          this.isSkeleton = false
        }, 200)
        return
      }
      this.list = []
      const list = [...e].map(item => {
        item.id = ''
        item.sfAgentId = ''
        item.sfLitigantId = ''
        return item
      })
      this.setData(list, true)
    },
    // 获取代理人信息
    getListAllAgents(sfLitigantId) {
      this.agentList = []
      listAgentByStatus({ sfLitigantId }).then(({ code, data }) => {
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
          uid: new Date().getTime() + Math.floor(Math.random() * 1000),
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
      this.list.forEach((item, index) => {
        const obj = this.$refs['agent' + index][0].getDate()
        if (!obj.flag) { // 验证不通过
          flag = true
          throw new Error('验证不通过')
        }
        const data = { ...obj.data }
        data.idCardPath = data.idCardPath && data.idCardPath.length > 0 ? data.idCardPath.map(item => item.url).join(',') : ''
        data.attorneyLetter = data.attorneyLetter && data.attorneyLetter.length > 0 ? data.attorneyLetter.map(item => item.url).join(',') : ''
        data.lawFirmLetter = data.lawFirmLetter && data.lawFirmLetter.length > 0 ? data.lawFirmLetter.map(item => item.url).join(',') : ''
        list.push(data)
      })
      return list
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
        if (item.idCardPath) {
          item.idCardPath = !Array.isArray(item.idCardPath) ? this.changeList(item.idCardPath) : item.idCardPath
        }
        if (item.lawFirmLetter) {
          item.lawFirmLetter = !Array.isArray(item.lawFirmLetter) ? this.changeList(item.lawFirmLetter) : item.lawFirmLetter
        }
        if (item.attorneyLetter) {
          item.attorneyLetter = !Array.isArray(item.attorneyLetter) ? this.changeList(item.attorneyLetter) : item.attorneyLetter
        }
        console.log(item)
        item.relation = Number(item.relation)
        this.list.push(item)
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
