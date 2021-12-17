<template>
  <div>
    <Description
      ref="agent"
      :rules="rules"
      :schema="schema"
      :is-skeleton="isSkeleton"
      :column="2"
      :detail-data="detailData"
      @change="change"
    />
  </div>
</template>

<script>

import Description from '@/components/Description'
import { Radio, Checkbox, Button } from 'ant-design-vue'
import { schema } from './agentSchema.js'
import { relation, addResstype, lawerRelation, idCardType } from '@/type/index.js'
import { delEvidenceFile } from '@/api/addCase/index.js'

import Title from './title.vue'
import { mapGetters } from 'vuex'
const initObj = {
  name: '',
  type: undefined,
  relation: undefined,
  idCardType: undefined,
  idCard: '',
  delegation: undefined,
  company: '',
  idCardPath: [],
  lawFirmLetter: [],
  recommendation: [],
  law: []
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
    }
  },
  data() {
    return {
      litigantAgentId: '',
      agentList: [],
      relation: null,
      isSkeleton: false,
      rules: {
        'name': [
          {
            type: 'required',
            msg: '代理人姓名不能为空'
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
        ]
      },
      detailData: {
        name: '',
        type: 2,
        relation: 2,
        idCardType: 10,
        idCard: '',
        delegation: 2,
        phone: '',
        company: '',
        idCardPath: [],
        lawFirmLetter: []
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
          field: 'company',
          label: '所在单位',
          type: 'input'
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
          label: '证件号码',
          type: 'input',
          required: true
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
          field: 'recommendation',
          label: '推荐函',
          span: 2,
          type: 'upload',
          showType: 'path',
          action: '/api/court/file/uploadQtwEvidenceFile',
          remove: (e) => {
            return this.removeFile(e)
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
          }
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
    // 删除文件
    removeFile(e) {
      if (e.fileId) {
        delEvidenceFile({ fileId: e.fileId })
      }
    },
    // 提交
    submit() {
      const obj = this.$refs.agent.getDate()
      const params = { ...obj.data }
      const evidenceBOList = []
      if (params.idCardPath && params.idCardPath.length > 0) { // 代理人证件
        const obj = {
          type: 7,
          name: '代理人证件',
          evidenceId: params.evidenceId1 || ''
        }
        obj.fileIds = params.idCardPath.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (params.idCardPath && params.idCardPath.length > 0) { // 代理人证件
        const obj = {
          type: 7,
          name: '代理人证件',
          evidenceId: params.evidenceId1 || ''
        }
        obj.fileIds = params.idCardPath.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (params.recommendation && params.recommendation.length > 0) { // 推荐函
        const obj = {
          type: 10,
          name: '推荐函',
          evidenceId: params.evidenceId3 || ''
        }
        obj.fileIds = params.recommendation.map(item => item.id)
        evidenceBOList.push(obj)
      }
      if (params.law && params.law.length > 0) { // 法律事务所函
        const obj = {
          type: 13,
          name: '法律事务所函',
          evidenceId: params.evidenceId4 || ''
        }
        obj.fileIds = params.law.map(item => item.id)
        evidenceBOList.push(obj)
      }
      params.evidenceBOList = evidenceBOList
      if (!obj.flag) { // 验证不通过
        return { flag: true }
      } else {
        return params
      }
    },
    // 赋值
    setData(data, isnoReset) {
      if (!data || data.length === 0) {
        this.list = []
        return
      }
      data.evidences.forEach(item1 => {
        if (item1.name === '代理人证件') {
          data.evidenceId1 = item1.evidenceId
          data.idCardPath = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
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
          data.evidenceId2 = item1.evidenceId
          data.lawFirmLetter = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
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
          data.evidenceId3 = item1.evidenceId // 推荐函id
          data.recommendation = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
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
          data.evidenceId4 = item1.evidenceId // 法律事务所函id
          data.law = item1.fileList && item1.fileList.length > 0 ? item1.fileList.map(item2 => {
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
      for (const key in { ...initObj }) {
        this.detailData[key] = data[key]
      }
      this.detailData.evidenceId1 = data.evidenceId1
      this.detailData.evidenceId2 = data.evidenceId2
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
