<template>
  <div>
    <Description
      ref="description"
      class="enter-X"
      :schema="schema"
      :detail-data="detailData"
      :is-edit="true"
      :is-skeleton="isSkeleton"
      :rules="rules"
    />
  </div>
</template>

<script>
import Description from '@/components/Description/index.vue'
import { saveMaterialInfo, listSfMaterialByFileType, delFileById } from '@/api/sfAddcase/index.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    Description
  },
  props: {
    isEdit: { // 是否可以编辑
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isSkeleton: false,
      rules: [],
      files: {
        申请人身份信息材料: 'file1',
        被申请人身份信息材料: 'file2',
        调解申请书: 'file3',
        申请人送达地址确认书: 'file4',
        其他材料: 'file5'
      },
      detailData: {}
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId']),
    schema() {
      const fileNames = [
        {
          name: '申请人身份信息材料',
          type: 2,
          require: true
        },
        {
          name: '被申请人身份信息材料',
          type: 3
        },
        {
          name: '调解申请书',
          type: 4
        },
        {
          name: '申请人送达地址确认书',
          type: 5,
          require: true
        },
        {
          name: '其他材料',
          type: 99
        }
        // {
        //   name: '保全材料',
        //   type: 6
        // },
        // {
        //   name: '鉴定材料',
        //   type: 7
        // }
      ]
      const list = []
      fileNames.forEach((item, index) => {
        const obj = {
          field: 'file' + (index + 1),
          label: item.name,
          span: 2,
          required: item.require,
          type: 'upload',
          isEdit: this.isEdit,
          showType: 'filePath',
          action: '/api/sf/file/uploadSfFile',
          success: (info) => {
            this.upload(info, item.type)
          },
          remove: info => {
            return this.delFile(info)
          }
        }
        list.push(obj)
      })
      return list
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    upload(info, type) {
      console.log(info)
      const fileid = info.response.data.id
      const params = {
        sfLawCase: this.getSfLawCaseId,
        fileCode: type + '',
        fileIds: [fileid]
      }
      saveMaterialInfo(params).then(({ code, msg }) => {
        if (code === 200) {
          this.$message.success(msg)
        }
      })
    },
    // 获取卷宗数据
    getData() {
      this.isSkeleton = true
      listSfMaterialByFileType({ sfLawCaseId: this.getSfLawCaseId }).then(({ code, data }) => {
        this.isSkeleton = false
        if (code === 200) {
          if (!data || data.length === 0) {
            this.detailData = {}
            return
          }
          for (const key in this.files) {
            console.log(data.find(item => item.type === key))
            const materialFiles = data.find(item => item.type === key) ? data.find(item => item.type === key).materialFiles : []
            console.log(key)
            console.log(this.files[key])
            this.detailData[this.files[key]] = materialFiles && materialFiles.length > 0 ? materialFiles.map(item => {
              return {
                uid: item.id,
                id: item.id,
                name: item.fileName,
                url: item.filePath
              }
            }) : []
          }
          console.log(this.detailData)
        }
        this.isSkeleton = false
      })
    },
    delFile(info) {
      return new Promise((res, rej) => {
        delFileById({ sfMaterialFileId: info.id }).then(({ code, msg }) => {
          if (code === 200) {
            this.$message.success(msg)
            res()
          } else {
            rej(msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
