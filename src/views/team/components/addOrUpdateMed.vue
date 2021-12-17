<template>
  <Modal
    :title="isAdd ? '新增':'编辑'"
    :visible="visible"
    width="1200px"
    :mask-closable="false"
    :footer="null"
    @cancel="visible = false"
  >
    <FormHeader ref="formHeader" :is-add="isAdd" :label-list="labelList" :info="detailData" :judge-name="judgeName">
      <div slot="btn">
        <Button class="mr-2.5" type="primary" @click="save">保存</Button>
        <Button type="green" @click="visible = false">取消</Button>
      </div>
    </FormHeader>
    <Description
      ref="description"
      class="enter-X"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :column="2"
      :rules="rules"
      :is-skeleton="isSkeleton"
      @change="change"
    />
    <!-- <AddLink ref="addlink" class="enter-X" :default-list="linkList" /> -->
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import FormHeader from './formHeader.vue'
import Description from '@/components/Description'
import { mediatorInfo, viewDept, updateOrSavemediator, mediatorByPhone, departmentList } from '@/api/team/index.js'
import AddLink from './addLink.vue'
import { deptTypeList, deptLevel } from '@/type/index.js'

export default {
  components: {
    Modal,
    Button,
    FormHeader,
    AddLink,

    Description
  },
  props: {
  },
  data() {
    return {
      judgeName: '请输入调解员姓名',
      gettime: '',
      isAdd: true,
      contactInfo: '',
      isChange: false,
      visible: false,
      isSkeleton: false,
      treeData: [],
      mediatorBelongs: [],
      genderList: [
        {
          label: '男',
          value: 'man'
        },
        {
          label: '女',
          value: 'female'
        }
      ],
      detailData: {},
      labelList: [],
      copyBelong: [], // 用作删除修改比对
      linkList: [],
      backAddBelongsId: [], // 返回隶属单位的id
      backBelong: [],
      rules: {
        'phone': [
          {
            type: 'required',
            msg: '联系方式不能为空'
          }
        ],
        'mediateType': [
          {
            type: 'required',
            msg: '调解类型不能为空'
          }
        ]

      },
      id: '', // 联动单位id
      delArr: []
    }
  },
  computed: {
    schema() {
      return [
        {
          field: 'phone',
          label: '联系方式',
          type: 'input',
          // disabled: this.isChange,
          required: true
        },
        // {
        //   field: 'isConnect',
        //   label: '是否将该账号作为新调解员联系方式？',
        //   type: 'radio',
        //   required: true,
        //   options: [{
        //     label: '是',
        //     value: true
        //   },
        //   {
        //     label: '否',
        //     value: false
        //   }
        //   ]
        // },
        {
          field: 'gender',
          label: '性别',
          type: 'radio',
          disabled: !this.isAdd,
          options: [
            {
              label: '男',
              value: 'man'
            },
            {
              label: '女',
              value: 'female'
            }
          ]
        },
        {
          field: 'addBelongs',
          label: '隶属单位/组织',
          type: 'treeselect',
          // disabled: this.isChange,
          options: this.treeData
        },
        {
          field: 'mediateType',
          label: '调解类型',
          type: 'select',
          require: true,
          required: true,
          options: deptTypeList
        },
        {
          field: 'professionalField',
          label: '专业领域',
          type: 'input',
          require: true,
          required: true

        },
        {
          field: 'intro',
          label: '简介',
          type: 'input'
        }
        // {
        //   field: 'intro',
        //   label: '化解数',
        //   type: 'textarea'
        // },

      ]
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    show(isAdd, id) {
      this.isAdd = isAdd
      this.isSkeleton = true
      if (this.isAdd) { // 当是新增的时候清楚缓存
        this.detailData = {}
        this.labelList = []
        this.linkList = []
        this.id = ''
      }
      this.id = id
      this.visible = true
      this.getInfo(id)
      this.getUnitData()
      if (this.detailData.phone) {
        this.isMediatorPhone(this.detailData.phone)
      }
      if (!id) {
        setTimeout(() => {
          this.isSkeleton = false
        })
      }
    },
    // 获取详情
    getInfo(deptId) {
      if (!deptId) {
        return
      }
      this.isSkeleton = true
      this.linkList = []
      mediatorInfo(deptId).then(({ code, data }) => {
        if (code === 200) {
          this.detailData.mediateType = data.mediateType
          this.detailData = data
          this.detailData.addBelongs = data.belongs
          this.detailData.name = data.name
          this.linkList = data.concatPeoples
          this.contactInfo = this.detailData.phone
          this.detailData.addBelongs = data.belongs.split(',')
          this.copyBelong = []
          this.ergodic()
          console.log(this.copyBelong)
        }
        this.isSkeleton = false
      })
    },
    // 获取到隶属单位中属于返回值的部分
    getBackBelong(addBelongs) {
      this.backBelong = []
      addBelongs.some((item, index) => {
        if (!parseInt(item)) {
          this.backBelong.push(item)
          this.copyBelong.push(item)
          delete addBelongs[index]
        }
      })
      this.ergodic()
      this.detailData.addBelongs = addBelongs.concat(this.backAddBelongsId)
    },
    // 遍历树形选择器
    ergodic() {
      var backAddBelongsId = []
      var find = function(array, ergodicArr) {
        ergodicArr.map(item1 => {
          array.forEach((item) => { // 利用foreach循环遍历
            if (item.name == item1) {
              backAddBelongsId.push(item.id)
              return item
            } else if (item.childes.length > 0) { // 判断chlidren是否有数据
              find(item.childes, ergodicArr) // 递归调用
            }
          })
        })
      }
      var item = find(this.treeData, this.detailData.addBelongs)
      this.backAddBelongsId = []
      this.backAddBelongsId = Array.from(new Set(backAddBelongsId))
      console.log(this.backAddBelongsId)
    },
    // 保存
    save() {
      this.getBackBelong(this.detailData.addBelongs)
      this.getCurrentTime()
      // return
      let params = {}
      const obj1 = this.$refs.description.getDate()
      if (!obj1.flag) {
        return
      }

      const data1 = this.$refs.description.getDate().data
      params = {
        ...data1
      }
      const belongs = []
      this.detailData.addBelongs.map(item => {
        if (item) {
          belongs.push(item)
        }
      })
      params.addBelongs = belongs
      this.getDelId(belongs)
      params.avatar = this.$refs.formHeader.avator
      params.name = this.$refs.formHeader.name ? this.$refs.formHeader.name : this.$refs.formHeader.info.name
      params.createTime = this.gettime
      params.deleteBelongs = this.delArr
      updateOrSavemediator(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.$emit('done')
        }
      })
    },
    // 获取删除的分流中心的id
    getDelId(b) {
      this.delArr = []
      console.log(this.copyBelong)
      // return
      // a是返回的数组，b是最终的数组
      if (this.backAddBelongsId && this.backAddBelongsId.length > 0) {
        this.backAddBelongsId.map(item => {
          const c = b.indexOf(item)
          if (c === -1) {
            this.delArr.push(item)
          }
        })
      } else {
        this.delArr = this.copyBelong
      }
    },
    // 调解员手机号是否存在
    isMediatorPhone(phone) {
      mediatorByPhone(phone).then(({ code, data }) => {
        if (code === 200) {

        }
      })
    },
    // 修改当事人联系方式
    change(e) {
      if (e.type === 'isConnect' && !e.value) {
        this.$message.warning('请重新填写联系方式')
        this.isChange = false
      } else {
        this.isChange = true
      }
    },
    // 获取当前时间
    getCurrentTime() {
      // 获取当前时间并打印
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      console.log(_this.gettime)
    },
    getUnitData() {
      departmentList('with').then(res => {
        if (res.code === 200) {
          this.treeData = [res.data]
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.des1 {
  position: relative;
  top: -1px;
}
</style>
