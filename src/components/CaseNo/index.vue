<template>
  <div class="wrapper">
    <div class="item">
      <Select v-model="year" placeholder="请选择" allow-clear>
        <SelectOption v-for="(item, index) in yearList" :key="index" allow-clear :value="item.value">{{ item.label }}</SelectOption>
      </Select>
    </div>
    <div class="item">
      <Select v-if="typeList.length !== 1" v-model="typeLabel" class="select" placeholder="请选择" allow-clear>
        <SelectOption v-for="(item, index) in typeList" :key="index" allow-clear :value="item.value">{{ item.label }}</SelectOption>
      </Select>
      <span v-else class="item-span">{{ typeLabel }}</span>
    </div>
    <div class="item">
      <Input v-model="num" class="case-num-input" type="number" :disabled="inputDisabled" placeholder="请输入" />
    </div>
    <div class="item">
      号
    </div>
    <div v-if="isNeedButton" class="item">
      <Button type="blue4" class="mr-2.5" @click="getNum">获取</Button>
      <Button v-if="isNeedUnUsedNums" type="blue4" class="mr-2.5" @click="getUnUsedNums">查看流水段号</Button>
      <Button v-if="isNeedReset" @click="reset">清空</Button>
    </div>
    <Modal
      title="流水段号"
      :visible="visible"
      width="500px"
      :mask-closable="false"
      @cancel="visible = false"
    >
      <div class="content">
        <Row>
          <Col :span="6">流水段号</Col>
          <Col :span="16">
            <TextArea v-model="unUsedNums" rows="3" />
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="visible = false">
          取消
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Input, Select, Button, Row, Col, Modal } from 'ant-design-vue'
import { getNewSerial } from '@/api/addCase/index.js'
import { trialFieldType, trialFieldType1 } from '@/type/index.js'
import { getSerialInfo } from '@/api/collectCase'

export default {
  components: {
    Input,
    Select,
    SelectOption: Select.Option,
    Button,
    Row,
    Col,
    Modal,
    TextArea: Input.TextArea
  },
  props: {
    yearList: { // 年份
      type: Array,
      default: () => {
        const nowYear = new Date().getFullYear()
        const list = [
          {
            value: nowYear,
            label: nowYear
          }
        ]
        for (let i = nowYear - 5; i < nowYear; i++) {
          list.push({
            value: i,
            label: i
          })
        }
        return list
      }
    },
    typeList: { // 类型
      type: Array,
      default: () => trialFieldType
    },
    value: {
      type: String,
      default: ''
    },
    inputDisabled: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: String,
      default: ''
    },
    isNeedButton: { // 是否需要获取按钮
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    },
    isNeedReset: { // 是否需要重置按钮
      type: Boolean,
      default: false
    },
    isNeedUnUsedNums: { // 是否查看流水段号按钮
      type: Boolean,
      default: false
    },
    isFreeze: {
      type: Boolean,
      default: false
    },
    preserveCaseNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      year: undefined,
      typeLabel: undefined,
      num: '',
      visible: false,
      unUsedNums: ''
    }
  },
  watch: {
    typeList() {
      if (this.typeList.length === 1) {
        this.typeLabel = this.typeList[0].value
      }
    },
    value(e) {
      this.setCaseNo()
    },
    defaultValue() {
      this.setCaseNo()
    },
    preserveCaseNo(val) {
      this.getBackCase(val)
    },
    immediate: true
  },
  created() {
    this.reset()
  },
  mounted() {
    this.init()
    this.getBackCase(this.preserveCaseNo)
    this.setCaseNo()
  },
  methods: {
    init() {
      if (this.typeList.length === 1) {
        this.typeLabel = this.typeList[0].value || ''
      }
      console.log(this.year)
    },
    getCaseNo() {
      if (!this.num && !this.year && !this.typeLabel) {
        return {
          caseNo: ''
        }
      }
      if (this.isFreeze && this.num === '' && !this.year) {
        return
      }
      const caseNo = '(' + this.year + ')' + (this.typeLabel || '') + (this.num ? (this.num + '号') : '')
      this.$emit('input', caseNo)
      return {
        caseNo,
        maxNumberId: this.maxNumberId
      }
    },
    // 案号赋值
    setCaseNo(value) {
      const defaultvalue = value || this.defaultValue
      if (!defaultvalue) {
        return
      }
      const trialField = [...trialFieldType, ...trialFieldType1]
      const obj = trialField.find(item => {
        return defaultvalue.indexOf(item.value) !== -1
      })
      if (!obj || !obj.label) {
        return
      }
      this.typeLabel = obj.label
      const list = defaultvalue.split(obj.label)
      if (list && list.length > 0) {
        this.year = list[0].replace(/[^0-9]/ig, '')
        if (list[1]) {
          this.num = list[1].indexOf('号') !== -1 ? list[1].split('号')[0] : list[1]
        } else {
          this.num = ''
        }
      }
    },
    getNum() {
      if (!this.year) {
        this.$message.error('年份不能为空')
        return
      }
      if (!this.typeLabel) {
        this.$message.error('前缀不能为空')
        return
      }
      const params = {
        year: this.year,
        prefix: this.typeLabel
      }
      params.type = this.type
      getNewSerial(params).then(({ code, data, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.num = data.maxNumber
          this.maxNumberId = data.maxNumberId
        }
      })
    },
    reset() {
      this.year = undefined
      if (this.typeList.length === 1) {
        this.typeLabel = this.typeList[0].label
      } else {
        this.typeLabel = undefined
      }
      this.num = ''
    },
    // 查看未使用得流水段号
    getUnUsedNums() {
      if (!this.year) {
        this.$message.error('年份不能为空')
        return
      }
      if (!this.typeLabel) {
        this.$message.error('前缀不能为空')
        return
      }
      const params = {
        year: this.year,
        prefix: this.typeLabel
      }
      getSerialInfo(params).then(({ code, data }) => {
        if (code === 200) {
          this.unUsedNums = data.unUsedNums
          this.visible = true
        }
      })
    },
    // 获取返回值
    getBackCase(preserveCaseNo) {
      setTimeout(() => {
        if (preserveCaseNo !== '') {
          this.year = preserveCaseNo.split('闽2013财保')[0].split('(')[1].split(')')[0]
          this.num = preserveCaseNo.split('保')[1].split('号')[0]
        }
      }, 200)
    }
  }
}
</script>

<style scoped lang="less">
.wrapper {
  // display: flex;
  .item {
    margin-right: 5px;
    display: inline-flex;
    align-items: center;
    .item-span {
      min-width: 100px;
      display: flex;
      justify-content: center;
    }
  }
  /deep/.ant-select.select {
    width: 130px!important;
    .ant-select-selection {
      width: 130px!important;
    }
  }
  /deep/.ant-select {
    width: 70px!important;
    .ant-select-selection {
      width: 70px!important;
    }
  }
  /deep/.ant-input {
    min-width: 100px;
  }
  /deep/.ant-select-selection {
    width: 100px!important;
  }
  .case-num-input {
    min-width: 70px!important;
    width: 70px!important;
  }
}
</style>
