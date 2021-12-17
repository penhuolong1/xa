<template>
  <div class="wrapper">
    <div class="header exter-X">
      <Button type="primary" class="mr-2.5">保存</Button>
      <Button type="green" class="mr-2.5">取消</Button>
      <Button type="blue2" class="mr-2.5">当事人信息库</Button>
      <Button type="blue2">身份证读取</Button>
    </div>
    <Description
      class="enter-X mt-5"
      :schema="schema1"
      :detail-data="detailData1"
      :is-edit="true"
      :rules="rules1"
      title="基本信息"
    />
    <Description
      class="enter-X mt-5"
      :schema="schema2"
      :column="2"
      :detail-data="detailData1"
      :is-edit="true"
      :rules="rules1"
      title="教育及职业信息"
    />
    <LinkDetail class="enter-X mt-5" title="联系方式" />
    <LawyerDetail class="enter-X mt-5" title="代理人信息" />
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
import Description from '@/components/Description'
import LinkDetail from './components/LinkDetail.vue'
import LawyerDetail from './components/LawyerDetail.vue'

export default {
  components: {
    Button,
    Description,
    LinkDetail,
    LawyerDetail
  },
  props: {

  },
  data() {
    return {
      schema1: [
        {
          field: 'sqCaseNo',
          label: '当事人类型',
          type: 'radio',
          span: 2,
          options: [
            {
              value: 1,
              label: '自然人'
            },
            {
              value: 2,
              label: '法人'
            },
            {
              value: 3,
              label: '非法人组织'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '当事人',
          type: 'input',
          required: true
        },
        {
          field: 'sqCaseNo',
          label: '一审诉讼地位',
          type: 'radio',
          span: 2,
          required: true,
          options: [
            {
              value: 1,
              label: '原告'
            },
            {
              value: 2,
              label: '被告'
            },
            {
              value: 3,
              label: '第三人'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '是否提出反诉',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '证件类型',
          type: 'select',
          required: true
        },
        {
          field: 'sqCaseNo',
          label: '证件号码',
          type: 'input',
          required: true
        },
        {
          field: 'sqCaseNo',
          label: '性别',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '涉诉时年龄',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '国籍',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '涉侨',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '名族',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '婚姻状况',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '籍贯',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '政治面貌',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '流动人员',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '行为能力',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '是'
            },
            {
              value: 2,
              label: '否'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '家庭经济情况',
          type: 'radio',
          span: 2,
          options: [
            {
              value: 1,
              label: '良好'
            },
            {
              value: 2,
              label: '一般'
            },
            {
              value: 3,
              label: '差'
            }
          ]
        },
        {
          field: 'sqCaseNo',
          label: '登陆手机号码',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '特殊生理或疾病',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '又聋又哑'
            },
            {
              value: 2,
              label: '精神疾病'
            },
            {
              value: 3,
              label: '患恶性传染病'
            },
            {
              value: 4,
              label: '盲人'
            },
            {
              value: 5,
              label: '聋人'
            },
            {
              value: 6,
              label: '哑人'
            },
            {
              value: 7,
              label: '其他'
            }
          ]
        }
      ],
      detailData1: {},
      rules1: {},
      schema2: [
        {
          field: 'sqCaseNo',
          label: '职业',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '文化程度',
          type: 'select'
        },
        {
          field: 'sqCaseNo',
          label: '所在单位',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '职位',
          type: 'input'
        },
        {
          field: 'sqCaseNo',
          label: '特殊身份',
          type: 'radio',
          options: [
            {
              value: 1,
              label: '政治官员'
            },
            {
              value: 2,
              label: '高级干部'
            },
            {
              value: 3,
              label: '高级知识份子'
            },
            {
              value: 4,
              label: '人大代表'
            },
            {
              value: 5,
              label: '政协委员会'
            },
            {
              value: 6,
              label: '演艺界明星'
            },
            {
              value: 7,
              label: '体育明星'
            },
            {
              value: 8,
              label: '其他'
            }
          ]
        }
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
}
</style>
