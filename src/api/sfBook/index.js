import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

/**
 * 获取卷宗目录
 */
export function listOfCase(params) {
  return service({
    url: '/sf/catalog/listOfCase',
    method: 'get',
    params
  })
}

/**
 * 添加或修改目录
 * @params {string} id 目录id 必传
 * @params {string} parentId 案由名字 必传
 * @params {string} name 目录名称 必传
 * @params {string} sfLawCaseId 案件id 必传
 */
export function editCatalog(params) {
  return service({
    url: '/sf/catalog/editCatalog',
    method: 'post',
    data: params
  })
}

/**
 * 删除目录
 * @params {string} id 目录id
 */
export function delCatalog(params) {
  return service({
    url: '/sf/catalog/delCatalog',
    method: 'post',
    data: params
  })
}

/**
 * 获取某个目录下的所有卷宗文件
 * @params {string} sfLawCaseId 案件id
 * @params {string} catalogId 目录id
 */
export function listOfCatalog(params) {
  return service({
    url: '/sf/catalog/listOfCatalog',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 * @params {file} file 文件
 * @params {string} catalogId 目录id
 * @params {string} sfLawCaseId 案件id
 */
export function fileAdd(params) {
  return service({
    url: '/sf/archive/file/add',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

/**
 * 删除文书
 * @params {string} fileIds 文件id，多个以“,”隔开
 */
export function fileDel(params) {
  return service({
    url: '/sf/archive/file/del',
    method: 'post',
    data: params
  })
}

/**
 * 批量移动卷宗到某一目录
 * @params {string} fileIds 文件id，多个以“,”隔开
 * @params {string} contentsId 目录id
 */
export function fileMove(params) {
  return service({
    url: '/sf/archive/file/move',
    method: 'post',
    data: params
  })
}

/**
 * 下载案件所有电子卷宗
 * @params {string} lawCaseId 案件id
 */
export function downArchiveFile(params) {
  return service({
    url: '/court/archive/file/downArchiveFile',
    method: 'get',
    params
  })
}

/**
 * 打印材料
 */
export function buildDiploms(params) {
  return service({
    url: '/court/diploms/buildDiploms',
    method: 'post',
    data: params
  })
}

/**
 * 查找签章文书
 */
export function queryDipSign(params) {
  return service({
    url: '/court/sign/queryDipSign',
    method: 'get',
    params
  })
}

/**
 * 审核待签章文书
 */
export function checkSign(params) {
  return service({
    url: '/court/sign/checkSign',
    method: 'post',
    data: params
  })
}

/**
 * 获取需要编辑的文书
 */
export function getEditDip(params) {
  return service({
    url: '/court/diploms/getEditDip',
    method: 'post',
    data: params
  })
}
