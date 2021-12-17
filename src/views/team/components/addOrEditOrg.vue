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
    />
    <AddLink ref="addlink" class="enter-X" :default-list="linkList" />
    <MedItem v-for="(item,index) in detailData.mediators" :key="index" :med-info="item" @look="add" />
    <AddOrUpdateMed ref="AddOrUpDateMedShow" />
  </Modal>
</template>

<script>
import { Modal, Button } from 'ant-design-vue'
import FormHeader from './formHeader.vue'
import Description from '@/components/Description'
import { orgInfo, updateOrgInfo, departmentList } from '@/api/team/index.js'
import AddLink from './addLink.vue'
import { deptTypeList, deptLevel } from '@/type/index.js'
import AddOrUpdateMed from './addOrUpdateMed.vue'
import MedItem from './medItem.vue'
export default {
  components: {
    Modal,
    Button,
    FormHeader,
    AddLink,
    Description,
    MedItem,
    AddOrUpdateMed
  },
  props: {
    isAdd: { // 是否新增
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      judgeName: '请输入调解组织名',
      visible: false,
      isSkeleton: false,
      isChangeBelong: true, // 是否修改隶属单位
      updateTime: '',
      detailData: {},
      labelList: [],
      linkList: [],
      treeData: [],
      delArr: [],
      arr: [], // 深拷贝第一次返回的隶属单位，用作获取删除id使用
      backAddBelongsId: [], // 返回隶属单位的id,用作传参数据使用
      backBelong: [],
      delBelongdsId: [], // 获取删除的隶属组织的id
      id: '', // 联动单位id
      rules: {}
    }
  },
  computed: {
    schema() {
      return [
        {
          field: 'addBelongs',
          label: '隶属单位',
          type: 'treeselect',
          // disabled: !this.isAdd,
          options: this.treeData

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
          field: 'importTime',
          label: '接入时间',
          type: 'date',
          require: true
        },
        {
          field: 'address',
          label: '办公地点',
          type: 'input'
        },
        {
          field: 'professionalField',
          label: '专业领域',
          type: 'input'
        }
      ]
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {

    Show(id) {
      console.log(this.isAdd)
      if (this.isAdd) { // 当是新增的时候清楚缓存
        this.detailData = {}
        this.labelList = []
        this.id = ''
      }
      this.visible = true
      this.id = id
      this.getInfo(id)
      this.getUnitData()
    },
    add(e) {
      if (e) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$refs.AddOrUpDateMedShow.show(this.isAdd, e)
    },
    // 获取详情
    getInfo(deptId) {
      if (!deptId) {
        return
      }
      this.isSkeleton = true
      this.linkList = []
      orgInfo(deptId).then(({ code, data }) => {
        if (code === 200) {
          this.detailData = data
          this.linkList = data.concatPeoples
          this.arr = data.belongs
          this.detailData.addBelongs = data.belongs.split(',')
          this.detailData.deptTypeStr = data.deptType
          this.detailData.importTime = this.detailData.importTime ? this.format(new Date(this.detailData.importTime), 'YYYY-MM-DD') : ''
          this.labelList = [
            // {
          //   name: `下设解纷组织${this.detailData.containOrigCount}家`
          // },
            {
              name: `下设解纷员${this.detailData.mediatorCount || 0}个`
            }, {
              name: `解纷数${this.detailData.resolveSuccessCount}个`
            }]
        }
        this.isSkeleton = false
      })
    },

    // 保存
    save() {
      this.getBackBelong(this.detailData.addBelongs)
      this.getDelBelongs()
      this.getCurrentTime()
      let params = {}
      if (this.isAdd) {
        const obj1 = this.$refs.description.getDate()
        if (!obj1.flag) {
          return
        }
        const data1 = this.$refs.description.getDate().data
        params = {
          ...data1
        }
        params.avatar = this.$refs.formHeader.avator
      } else {
      }
      params = {
        ...this.detailData,
        importTime: this.detailData.importTime ? this.format(new Date(this.detailData.importTime), 'YYYY-MM-DD H:m:s') : ''
      }
      params.deptName = this.$refs.formHeader.name
      params.concatPeoples = this.$refs.addlink.list
      const belongs = []
      this.detailData.addBelongs.map(item => {
        if (item) {
          belongs.push(item)
        }
      })
      params.addBelongs = belongs
      delete params.deptType
      if (params.concatPeoples && params.concatPeoples.length > 0) {
        params.concatPeoples.map(item => {
          item.updateTime = this.updateTime
        })
      }
      params.mediators = this.detailData.mediators
      updateOrgInfo(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
          this.visible = false
          this.$emit('done')
        }
      })
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
      _this.updateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      console.log(_this.updateTime)
    },
    // 获取所属单位/组织数据
    getUnitData() {
      departmentList('with').then(res => {
        if (res.code === 200) {
          this.treeData = [res.data]
          this.show = true
        }
      })
    },
    // 获取到隶属单位中属于返回值的部分
    getBackBelong(addBelongs) {
      this.backBelong = []
      this.delBelongdsId = []
      addBelongs.some((item, index) => {
        if (!parseInt(item)) {
          this.backBelong.push(item)
          // this.delBelongdsId.push(item)
          delete addBelongs[index]
        }
      })
      console.log(this.backBelong)
      this.ergodic()
      this.detailData.addBelongs = addBelongs.concat(this.backAddBelongsId)
    },
    // 遍历树形选择器
    ergodic() {
      this.isChangeBelong = false
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
      var item = find(this.treeData, this.backBelong)
      this.backAddBelongsId = []
      this.backAddBelongsId = Array.from(new Set(backAddBelongsId))
      console.log(this.backAddBelongsId)
    },
    // getDelBelongs() {
    //   const backId = []
    //   this.delBelongdsId = []
    //   this.arr.split(',').map(item => {
    //     this.treeData.map(item1 => {
    //       if (item1.name === item) {
    //         backId.push(item.id)
    //       }
    //     })
    //   })
    //   backId.map(item=>)
    // },
    // 获取删除的隶属单位
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
