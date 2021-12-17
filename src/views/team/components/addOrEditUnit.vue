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
        <Button type="green" @click="visible == false">取消</Button>
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
      @change="changeType"
    />
    <AddLink ref="addlink" class="enter-X" :default-list="linkList" @getDel="getDelPeople" />
    <Description
      ref="description1"
      class="des1"
      :schema="schema1"
      :detail-data="detailData"
      :is-edit="true"
      :column="2"
      :is-skeleton="isSkeleton"
    />
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import FormHeader from './formHeader.vue'
import Description from '@/components/Description'
import { unitInfo, viewDept, changeOrSaveUnit } from '@/api/team/index.js'
import AddLink from './addLink.vue'
import { deptTypeList, deptLevel } from '@/type/index.js'
import { mapGetters } from 'vuex'
import { unitList } from '@/api/team/index.js'
import { agency } from '@/api/team/index.js'

export default {
  components: {
    Modal,
    Button,
    FormHeader,
    AddLink,
    Description
  },
  props: {
    isAdd: { // 是否新增
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      judgeName: '请输入单位名',

      visible: false,
      isSkeleton: false,
      detailData: {},
      labelList: [],
      linkList: [],
      belongList: [],
      fileAccording: [], // 上传文件
      schema1: [
        {
          field: 'mainResponsibility',
          label: '主要职责',
          type: 'textArea',
          span: 2
        },
        {
          field: 'fileAccording',
          label: '文件依据',
          type: 'upload',
          action: '/api/sf/file/uploadSfFile',
          span: 2,
          showType: 'filePath'
        }
      ],
      rules: {
        'deptLevelStr': [
          {
            type: 'required',
            msg: '所属级别不能为空'
          }
        ],
        'upperUnit': [
          {
            type: 'required',
            msg: '上级单位不能为空'
          }
        ],
        'ancients': [
          {
            type: 'required',
            msg: '分流中心不能为空'
          }
        ]
      },
      levels: [],
      id: '', // 联动单位id
      upperUnitId: '', // 返回的上级单位的id
      list: [], // 用于遍历获取到的分流中心的id
      delArr: [], // 获取删除分流中心的id
      backCenterId: [],
      backCenter: [],
      deletePeoples: [],
      copyCenter: [] // 获取到最开始的数组id
    }
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    schema() {
      return [
        {
          field: 'deptLevelStr',
          label: '所属级别',
          type: 'select',
          disabled: !this.isAdd,
          required: true,
          options: this.belongList
        },
        {
          field: 'upperUnit',
          label: '上级单位',
          type: 'select',
          disabled: !this.isAdd,
          required: true,
          options: this.levels
        },
        {
          field: 'deptTypeStr',
          label: '组织类型',
          type: 'select',
          require: true,
          required: true,
          options: deptTypeList
        },
        {
          field: 'ancients',
          label: '分流中心',
          required: true,
          type: 'center'
        },
        {
          field: 'importTime',
          label: '接入时间',
          type: 'date'

        },
        {
          field: 'address',
          label: '办公地点',
          type: 'input'
        }
      ]
    }

  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    show(isAdd, id) {
      this.isAdd = isAdd
      if (this.isAdd) { // 当是新增的时候清楚缓存
        this.detailData = {}
        this.labelList = []
        this.linkList = []
        this.id = ''
      }
      this.visible = true
      this.id = id
      this.getInfo(id)
      this.getBelongList()
    },
    // 获取详情
    getInfo(deptId) {
      if (!deptId) {
        return
      }
      this.isSkeleton = true
      this.linkList = []
      unitInfo(deptId).then(({ code, data }) => {
        if (code === 200) {
          this.upperUnitId = data.upperUnit
          this.detailData = data
          this.detailData.importTime = this.detailData.importTime ? this.format(new Date(this.detailData.importTime), 'YYYY-MM-DD H:m:s') : ''
          this.detailData.fileAccording = data.fileAccording
          this.detailData.upperUnit = data.upperUnitName
          this.detailData.ancientsDetail = data.ancientsDetail
          this.detailData.deptTypeStr = data.deptType
          this.detailData.deptLevelStr = data.deptLevel
          this.detailData.name = this.detailData.deptName
          this.detailData.ancients = data.ancientsDetail.split(',')
          this.copyCenter = JSON.parse(JSON.stringify(this.detailData.ancients))
          this.getCenterId()
          console.log(this.copyCenter)
          this.labelList = [{
            name: `下设解纷组织${this.detailData.containOrigCount}家`
          }, {
            name: `下设解纷员${this.detailData.mediatorCount}个`
          }, {
            name: `解纷数${this.detailData.mediateCaseCount || 0}个`
          }]
          this.linkList = data.concatPeoples
          if (data.fileAccording != '' && data.fileAccording) {
            this.detailData.fileAccording = data.fileAccording.split(',')
            if (this.detailData.fileAccording && this.detailData.fileAccording.length > 0) {
              this.detailData.fileAccording = this.detailData.fileAccording.map(item => {
                return {
                  id: new Date().getTime(),
                  filePath: item
                }
              })
            }
          }
          console.log(this.detailData.fileAccording)
        }
        this.isSkeleton = false
      })
    },
    // 保存
    save() {
      console.log(this.deletePeoples)
      console.log(this.detailData.ancients)
      // this.ergodic()
      let params = {}
      const obj1 = this.$refs.description.getDate()
      if (!obj1.flag) {
        return
      }
      const data1 = this.$refs.description.getDate().data
      const data2 = this.$refs.description1.getDate().data
      params = {
        ...data1,
        ...data2
      }
      const fileAccording = []
      console.log(data2.fileAccording)
      this.getDelId()
      if (data2.fileAccording && data2.fileAccording.length > 0) {
        data2.fileAccording.map(item => {
          fileAccording.push(item.filePath ? item.filePath : item.data.filePath)
        })
        // params.fileAccording = fileAccording.join(',')
      }
      this.getfinalCenter(this.detailData.ancients)
      this.getDelId(this.copyCenter, this.detailData.ancients)
      // return
      const ancients = []
      this.detailData.ancients.map(item => {
        if (item) {
          ancients.push(item)
        }
      })

      params.deptName = this.$refs.formHeader.name ? this.$refs.formHeader.name : params.name
      params.avatar = this.$refs.formHeader.avator
      params.concatPeoples = this.$refs.addlink.list
      params.importTime = this.format(new Date(params.importTime), 'YYYY-MM-DD H:m:s')
      params.fileAccording = fileAccording.toString()
      params.deleteBelongs = this.delArr
      params.ancients = ancients
      params.deletePeoples = this.deletePeoples
      if (!this.isAdd) {
        params.upperUnit = this.upperUnitId
      }
      delete params.name
      delete params.deptType
      delete params.deptLevel
      changeOrSaveUnit(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.$emit('done')
          this.detailData = {}
          this.labelList = []
          this.linkList = []
        }
      })
    },
    // 获取所属组织
    getBelongList() {
      const arrIndex = deptLevel.findIndex(item => {
        return item.value === this.getUserInfo.user.dept.deptLevel
      })
      this.belongList = []
      for (var i = arrIndex + 1; i < deptLevel.length; i++) {
        this.belongList.push(deptLevel[i])
      }
    },
    changeType(e) {
      console.log(e)
      if (e.type === 'deptLevelStr') {
        viewDept(e.value).then(({ code, data }) => {
          if (code === 200) {
            if (data) {
              this.levels = [data].map(item => {
                item.label = item.name
                item.value = item.id
                return item
              })
            }
            if (data.childes && data.childes.length > 0) {
              this.levels.childes = data.childes.map(item => {
                return {
                  label: item.name,
                  value: item.id
                }
              })
              console.log(this.levels)
            }
          }
        })
      }
    },
    getData() {
      // 获取分流中心数据
      agency().then(({ code, data }) => {
        if (code === 200) {
          this.list = []
          this.generateList(data)
        }
      })
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const id = node.id
        this.list.push({ id, name: node.name })
        if (node.containDepartment) {
          this.generateList(node.containDepartment)
        }
      }
    },
    // 1.获取返回的分流中心的id
    getCenterId() {
      console.log(this.copyCenter)
      this.backCenterId = []
      this.copyCenter.map(item => {
        this.list.forEach(item1 => {
          if (item1.name === item) {
            this.backCenterId.push(item1.id)
            console.log(this.backCenterId)
            this.copyCenter = JSON.parse(JSON.stringify(this.backCenterId))
          }
        })
      })
    },
    // 3.遍历最终的分流中心中还有非数字的部分
    getfinalCenter(ancients) {
      const backAncient = []
      ancients.some((item, index) => {
        if (!parseInt(item)) {
          backAncient.push(item)
          delete ancients[index]
        }
      })
      console.log(backAncient) // 获取数组中存在非id的字符串
      const backAncientId = []
      backAncient.map(item => {
        this.list.forEach(item1 => {
          if (item1.name === item) {
            backAncientId.push(item1.id)
            console.log(backAncientId)
          }
        })
      })
      this.detailData.ancients = ancients.concat(backAncientId)
      this.detailData.ancients = Array.from(new Set(this.detailData.ancients))
      const ancient = []
      this.detailData.ancients.map(item => {
        if (item) {
          ancient.push(item)
        }
      })
      this.detailData.ancients = ancient
    },
    // 获取删除的分流中心的id
    getDelId(a, b) {
      this.delArr = []
      // a是返回的数组，b是最终的数组
      if (a && a.length > 0) {
        a.map(item => {
          const c = b.indexOf(item)
          if (c === -1) {
            this.delArr.push(item)
          }
        })
      } else {
        this.delArr = this.backCenterId
      }
    },
    // 获取到最终的分流中心属于返回值的部分
    getBackBelong(center) {
      this.backBelong = []
      center.some((item, index) => {
        if (!parseInt(item)) {
          this.backBelong.push(item)
          delete center[index]
        }
      })
      this.getCenterId()
      this.detailData.addBelongs = center.concat(this.backCenterId)
    },
    // 获取删除的联系人
    getDelPeople(e) {
      this.deletePeoples = e
      console.log(this.deletePeoples)
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
