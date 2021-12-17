<template>
  <div>
    <span v-for="(item, index) in list" :key="item.litigantAgentId">
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
</template>

<script>
import { Button } from 'ant-design-vue'
import Description from '@/components/Description'
import { lawerRelation, idCardType } from '@/type/index.js'
import { delAgent, listAllAgents } from '@/api/addCase/index.js'
const initObj = {
  litigantName: '',
  type: undefined,
  relation: undefined,
  delegation: undefined,
  attorneyLetter: []
}
export default {
  components: {
    Description,
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
          field: 'litigantName',
          label: '代理人当事人',
          type: 'input',
          disabled: true
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
          field: 'attorneyLetter',
          label: '授权委托书',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/agent/uploadAgentFile'
        }
      ],
      litigantAgentId: '',
      detailData: {},
      agentList: [],
      isSkeleton: false,
      list: [
        {}
      ],
      rules: {
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
          type: 2,
          relation: 2,
          idCardType: 10,
          idCard: '',
          delegation: 2,
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
      if (!e || e.length === 0) {
        this.list = []
        this.isSkeleton = true
        setTimeout(() => {
          this.isSkeleton = false
        }, 200)
        return
      }
      this.list = []
      const list = [...e]
      console.log(list)
      this.setData(list, true)
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
      this.list.forEach((item, index) => {
        const obj = this.$refs['agent' + index][0].getDate()
        if (!obj.flag) { // 验证不通过
          flag = true
          throw new Error('验证不通过')
        }
        const data = { ...obj.data }
        data.attorneyLetter = data.attorneyLetter && data.attorneyLetter.length > 0 ? data.attorneyLetter.map(item => item.url).join(',') : ''
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
        if (item.attorneyLetter) {
          item.attorneyLetter = !Array.isArray(item.attorneyLetter) ? this.changeList(item.attorneyLetter) : item.attorneyLetter
        }
        const obj = {}
        for (const key in { ...initObj }) {
          obj[key] = item[key]
        }
        obj.litigantAgentId = item.litigantAgentId
        this.list.push(obj)
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
