<template>
  <Modal
    v-model="visible"
    title="关联电话记录"
    style="width:600px"
    :mask-closable="false"
    class="modal"
    @cancel="visible = false"
  >
    <template slot="footer">
      <Button @click="visible=false">
        取消
      </Button>
      <Button type="primary" :loading="loading" @click="onConfirm">
        确认
      </Button>
    </template>
    <Form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <FormItem label="来电号码">
        <Input
          v-decorator="[ 'phone',{ initialValue:phoneInfo.phone},]"
          disabled
        />
      </FormItem>
      <FormItem label="来电时间">
        <DatePicker
          v-decorator="['time', { initialValue:phoneInfo.startTime},]"
          show-time
        />
      </FormItem>
      <FormItem label="录音记录">
        <audio :src="audioSrc" controls />
      </FormItem>
      <!-- <FormItem label="关联案号">
        <Select
          v-if="isCase"
          v-decorator="['caseNo', { rules: [{ required: true,message:'请选择案号' }]}]"
          placeholder="请选择"
          allow-clear
          @change="changeCaseNo"
        >
          <SelectOption v-for="(item, index) in caseNoList" :key="index" allow-clear :value="item">{{ item }}</SelectOption>
        </Select>
      </FormItem> -->
      <!-- <FormItem label="当事人">
        <Select
          v-decorator="['litId', { rules: [{ required: true,message:'请选择当事人' }]}]"
        >
          <SelectOption v-for="(item, index) in litigantPeople" :key="index" allow-clear :value="item.litId">{{ item.litName }}</SelectOption>
        </Select>
      </FormItem> -->

      <FormItem label="关联案号">
        <Select
          v-decorator="['caseNo', { rules: [{ required: true, message: '请选择案号' }] }]"
          show-search
          :filter-option="false"
          :show-arrow="false"
          placeholder="请输入关联案号"
          :not-found-content="null"
          @search="handleSearch"
          @change="changeCaseNo"
        >
          <SelectOption v-for="(item, index) in caseNoList" :key="index" allow-clear :value="item">{{ item }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="当事人">
        <Select
          v-decorator="['litId', { rules: [{ required: true,message:'请选择当事人' }]}]"
        >
          <SelectOption v-for="(item, index) in litigantPeople" :key="index" allow-clear :value="item.litId">{{ item.litName }}</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="环节">
        <RadioGroup
          v-decorator="[
            'linkType',
            { rules: [{ required: true, message: '请选择' }],initialValue:1},
          ]"
          @change="changeLinkType"
        >
          <Radio :value="1">送达</Radio>
          <Radio :value="2">调解</Radio>
        </RadioGroup>
      </FormItem>
      <div v-if="isSend">
        <FormItem label="使用关联关系">
          <RadioGroup>
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="与当事人关系">
          <Select
            v-decorator="['relation', { rules: [{ required: true,message:'请选择' }]}]"
          >
            <SelectOption v-for="(item, index) in relation" :key="item.value" allow-clear :value="item.value">{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="通话情况">
          <Select v-decorator="['callState',{ rules: [{ required: true, message: '请选择' }]}]">
            <SelectOption v-for="(item, index) in callState" :key="item.value" allow-clear :value="item.value">{{ item.value }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="是否来院领取">
          <RadioGroup v-decorator="['visitReceived']">
            <Radio :value="true">是</Radio>
            <Radio :value="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="预约领取时间">
          <DatePicker
            v-decorator="['orderDate']"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </FormItem>
      </div>
      <FormItem
        v-if="isSend"
        label="送达结果"
      >
        <Select v-decorator="['sendState', { rules: [{ required: true, message: '请选择' }]}]">
          <SelectOption v-for="(item, index) in sendresult" :key="index" allow-clear :value="item.value">{{ item.label }}</SelectOption>
        </Select>
      </FormItem>
      <div v-if="!isSend">
        <FormItem label="参与当事人">
          <Select
            v-decorator="['partIds', { rules: [{ required: true,message:'请选择案号' }]}]"
            mode="multiple"
          >
            <SelectOption v-for="(item, index) in partyLitigant" :key="index" allow-clear :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="调解/调查时间">
          <DatePicker v-decorator="['mediateTime',]" show-time />
        </FormItem>
        <FormItem

          label="结果"
        >
          <Select
            v-decorator="[
              'preMediateTypeValue',
              { rules: [{ required: true, message: '请选择' }],initialValue:1},
            ]"
          >
            <SelectOption v-for="(item, index) in result" :key="index" allow-clear :value="item.value">{{ item.label }}</SelectOption>
          </Select>
        </FormItem>
      </div>

      <FormItem label="备注">
        <TextArea
          v-decorator="[
            'remark',
          ]"
        />
      </FormItem>
    </Form>

  </Modal>
</template>
<script>
import { Modal, Form, Input, Button, Select, Radio, DatePicker } from 'ant-design-vue'
import { listInfoByPhone, bindCase } from '@/api/freeze/index.js'
import { mapGetters } from 'vuex'
import { getByCode } from '@/api/case/index.js'
import CaseNo from '@/components/CaseNo/index.vue'
import { relation } from '@/type/index.js'
import { callState } from './callState.js'
import { litigantNameByCaseId } from '@/api/schedule/index.js'
import 'moment/locale/zh-cn'
import moment from 'moment'
export default {
  components: {
    Modal,
    Form,
    FormItem: Form.Item,
    Input,
    Button,
    Select,
    SelectOption: Select.Option,
    CaseNo,
    Radio,
    RadioGroup: Radio.Group,
    TextArea: Input.TextArea,
    DatePicker
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      remark: '备注内容',
      phone: '',
      audioSrc: '',
      lawId: '', // 案件号
      visible: false,
      loading: false,
      isCase: true,
      isSend: true, // 是否选择送达
      isUseAssociate: true, // 是否选择使用关联关系
      form: this.$form.createForm(this, { name: 'form' }),
      phoneInfo: {},
      caseNoSearchParams: {
        phone: '',
        caseNo: ''
      },
      caseNoList: [],
      litigant: [],
      litigantPeople: [], // 根据关联案号筛选的当事人
      partyLitigant: [], // 参与当事人
      typelist: [{
        label: '闽0213财保',
        value: '闽0213财保'
      }
      ],
      result: [{
        value: 0,
        label: '无结果'
      },
      {
        value: 1,
        label: '调解成功'
      },
      {
        value: 2,
        label: '调解失败'
      }],
      sendresult: [
        {
          label: '送达中',
          value: 0
        },
        {
          label: '送达成功',
          value: 1
        },
        {
          label: '送达失败',
          value: 2
        },
        {
          label: '未送达',
          value: 3
        }
      ],
      callState,

      relation
    }
  },

  computed: {
    ...mapGetters(['getSfLawCaseId'])
  },

  created() {
  },

  mounted() {
    window.addEventListener('message', this.getAudioSrc1)
  },
  destroyed() {
    window.removeEventListener('message', this.getAudioSrc1)
  },
  methods: {
    Show(e) {
      console.log(e)
      this.getCaseNoOrlistInfo(e.phone)
      this.audioSrc = e.recordAddress
      // this.lawId = e.id
      this.visible = true
      this.phoneInfo = e
    },
    // 案号选择
    changeCaseNo(e) {
      console.log(e)
      console.log(this.litigant)
      this.litigantPeople = []
      this.litigant.map(item => { // 根据选中的案号，获取当事人关系
        if (item.caseNo === e || item.preCaseNo === e) {
          this.lawId = item.lawId
          this.getLitigantInfo(this.lawId)
          this.litigantPeople.push(item)
        }
      })
      console.log(this.litigantPeople)
      if (e) {
        this.form.setFieldsValue({
          partIds: undefined
        })
      }
    },
    // 修改环节
    changeLinkType(e) {
      if (e.target.value === 1) {
        this.isSend = true
      } else {
        this.isSend = false
      }
    },
    // 获取参与当事人信息
    getLitigantInfo(e) {
      litigantNameByCaseId({ caseId: e }).then(res => {
        if (res.code === 200) {
          this.partyLitigant = res.data.map(item => {
            return {
              id: item.id,
              name: item.name
            }
          })
        }
      })
    },
    onConfirm() {
      this.form.validateFields(err => {
        if (err) {
          return
        }
        const params = {
          id: this.phoneInfo.id,
          ...this.form.getFieldsValue()
        }
        if (!this.isCase) {
          params.caseNo = this.$refs.caseNo.getCaseNo().caseNo
        }
        delete params.phone
        delete params.time

        if (params.mediateTime) {
          params.mediateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        bindCase(params).then(({ code, data }) => {
          if (code === 200) {
            this.$message.success('绑定成功')
            this.form.resetFields()
            this.visible = false
            this.$emit('done')
          }
        })
      })
    },
    // 查询手机号对应的当事人和案号
    getCaseNoOrlistInfo(e) {
      this.phone = e
      this.caseNoSearchParams = {
        phone: e,
        caseNo: null
      }
      this.getlistInfoByPhone(this.caseNoSearchParams)
    },
    getlistInfoByPhone(params) {
      listInfoByPhone(params).then(({ code, list }) => {
        if (code === 200) {
          this.caseNoList = []
          list.map(item => {
            if (item.caseNo) {
              this.caseNoList.push(item.caseNo)
            }
            if (item.preCaseNo) {
              this.caseNoList.push(item.preCaseNo)
            }
          })
          this.caseNoList = Array.from(new Set(this.caseNoList))// 过滤重复数据
          this.litigant = list.map(item => {
            return {
              litName: item.litName,
              litId: item.litId,
              relation: item.relation ? item.relation : null,
              caseNo: item.caseNo,
              preCaseNo: item.preCaseNo,
              lawId: item.lawId
            }
          })
        }
      })
    },
    getAudioSrc1(e) {
      const data = e.data
      if (data.type === 'callPhone') {
        const params = {
          code: localStorage.getItem('xaCallPhoneCodes')
        }
        getByCode(params).then(({ code, file }) => {
          if (code === 200) {
            this.audioSrc = file.path
          }
        })
      }
    },
    handleSearch(e) {
      this.caseNoSearchParams = {
        phone: this.phone,
        caseNo: e
      }
      this.getlistInfoByPhone(this.caseNoSearchParams)
    }
  }
}
</script>

<style scoped lang="less">
audio {
  width: 100%;
  height: 40px;
}
</style>
