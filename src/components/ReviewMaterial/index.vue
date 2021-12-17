<template>
  <!-- 审查材料 -->
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
import { saveMaterialInfo, listSfMaterialByFileType, delFileById, listOfCase, listAgentIdInfo } from '@/api/sfAddcase/index.js'
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
        申请人材料: 'file1',
        被申请人材料: 'file2',
        调解申请书: 'file3',
        送达地址确认书: 'file4',
        调解协议书: 'file5',
        司法确认申请书: 'file6',
        调解笔录: 'file7',
        移送函: 'file8',
        权利义务告知书: 'file9',
        保全材料: 'file10',
        鉴定材料: 'file11',
        // 代理人材料: 'file13',
        其他材料: 'file12'
      },
      detailData: {}
    }
  },
  computed: {
    ...mapGetters(['getSfLawCaseId', 'getSfCaseInfo', 'getLawCaseId']),
    schema() {
      let fileNames = [
        {
          name: '申请人材料',
          field: 'file1'
        },
        {
          name: '被申请人材料',
          field: 'file2'
        },
        {
          name: '调解申请书',
          field: 'file3'
        },
        {
          name: '送达地址确认书',
          field: 'file4'
        },
        {
          name: '调解协议书',
          field: 'file5'
        },
        {
          name: '司法确认申请书',
          field: 'file6'
        },
        {
          name: '调解笔录',
          field: 'file7'
        },
        {
          name: '移送函',
          field: 'file8'
        },
        {
          name: '权利义务告知书',
          field: 'file9'
        },
        // {
        //   name: '代理人信息',
        //   field: 'file13'
        // },
        {
          name: '其他材料',
          field: 'file12'
        }
      ]
      if (this.getSfCaseInfo.state === '申请立案') {
        fileNames = [
          {
            name: '申请人材料',
            field: 'file1'
          },
          {
            name: '被申请人材料',
            field: 'file2'
          },
          {
            name: '调解申请书',
            field: 'file3'
          },
          {
            name: '送达地址确认书',
            field: 'file4'
          },
          {
            name: '保全材料',
            field: 'file10'
          },
          {
            name: '鉴定材料',
            field: 'file11'
          },
          // {
          //   name: '代理人信息',
          //   field: 'file13'
          // },
          {
            name: '其他材料',
            field: 'file12'
          }
        ]
      }
      const list = []
      fileNames.forEach((item, index) => {
        const obj = {
          field: item.field,
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
    async getData() {
      this.isSkeleton = true
      await listOfCase({ caseId: this.getSfLawCaseId }).then(({ code, fileInfo }) => {
        this.isSkeleton = false
        if (code === 200) {
          if (!fileInfo || fileInfo.length === 0) {
            this.detailData = {}
            return
          }
          for (const key in this.files) {
            const materialFiles = fileInfo.filter(item => item.type === key)
            this.detailData[this.files[key]] = materialFiles && materialFiles.length > 0 ? materialFiles.map(item => {
              return {
                uid: item.id,
                id: item.id,
                name: item.name,
                url: item.path
              }
            }) : []
          }
        }
      })
      await listAgentIdInfo({ caseId: this.getLawCaseId }).then(({ code, idCardPaths, attorneyLetters, lawFirmLetter }) => {
        if (code === 200) {
          const list = []
          if (attorneyLetters && attorneyLetters.length > 0) {
            attorneyLetters.forEach(item => {
              if (item) {
                const name = item.split('/').pop()
                const obj = {
                  uid: this.getUUID(),
                  id: this.getUUID(),
                  name: name,
                  url: item
                }
                list.push(obj)
              }
            })
          }
          if (idCardPaths && idCardPaths.length > 0) {
            idCardPaths.forEach(item => {
              if (item) {
                const name = item.split('/').pop()
                const obj = {
                  uid: this.getUUID(),
                  id: this.getUUID(),
                  name: name,
                  url: item
                }
                list.push(obj)
              }
            })
          }
          if (lawFirmLetter && lawFirmLetter.length > 0) {
            lawFirmLetter.forEach(item => {
              if (item) {
                const name = item.split('/').pop()
                const obj = {
                  uid: this.getUUID(),
                  id: this.getUUID(),
                  name: name,
                  url: item
                }
                list.push(obj)
              }
            })
          }
          if (list && list.length > 0) {
            this.detailData.file13 = list
          }
        }
      })
      // console.log(this.detailData)
      // debugger
      this.isSkeleton = false
    },
    getUUID() {
      return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0; var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
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
