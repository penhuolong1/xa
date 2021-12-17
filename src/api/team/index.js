import axiosConfig from '@/utils/axios.js'
// 创建正式用例接口基础配置
const service = axiosConfig.ajax()

// 浏览分流中心
export function agency(params) {
  return service({
    url: '/sf/team/manage/view/center/agency',
    method: 'get',
    data: params
  })
}

// 查看分流中心详情
export const centerInfo = (depId) => {
  return service({
    url: `/sf/team/manage/view/center/agency/${depId}/info`,
    method: 'get'
  })
}

// 查看联系人电话号码
export const lookPhone = (peopleId) => {
  return service({
    url: `/sf/concat/person/view/concat/${peopleId}/phone`,
    method: 'get'
  })
}

/**
 * 诉非上传文件
 * @params {file} file 文件
 */
export function uploadSfFile(params) {
  return service({
    url: '/sf/file/uploadSfFile',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}

// 修改分流中心
export const updateAgency = (params) => {
  return service({
    url: `/sf/team/manage/change/center/agency`,
    method: 'post',
    data: params
  })
}

// 分流中心-查看是否有权限编辑当前的部门
export const checkPermission = (deptId) => {
  return service({
    url: `/sf/team/manage/check/${deptId}/permission`,
    method: 'get'
  })
}

// 查看联动单位数据
export const unitList = (depId) => {
  return service({
    url: `/sf/team/manage/view/linkage/unit`,
    method: 'get'
  })
}

// 联动单位详情
export const unitInfo = (deptId) => {
  return service({
    url: `/sf/team/manage/view/linkage/unit/${deptId}/info`,
    method: 'get'
  })
}

// 查询联动单位
export const searchUnit = (params) => {
  return service({
    url: `/sf/team/manage/view/linkage/unit/by`,
    method: 'get',
    params
  })
}

// 联动单位-解除或绑定该组织
export const banOrLinkageUnit = (unitId) => {
  return service({
    url: `/sf/team/manage/ban/linkage/${unitId}/unit`,
    method: 'post'
  })
}

// 更改或新增调节单位
export const changeOrSaveUnit = (params) => {
  return service({
    url: `/sf/team/manage/change/or/save/linkage/unit`,
    header: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  })
}
// 根据选择的所属级别，筛选对应的上级组织
export const viewDept = (deptLevelName) => {
  return service({
    url: `/sf/team/manage/view/dept/by/${deptLevelName}/level`,
    method: 'get'
  })
}

// 查询调解组织列表
export const organization = (params) => {
  return service({
    url: `/sf/team/manage/view/linkage/organization`,
    method: 'get',
    params
  })
}

// /**
//  * 注册法人
//  */
// export const registerOfUint = (params) => {
//   return service({
//     url: '/system/info/registerOfUint',
//     method: 'post',
//     data: params
//   })
// }

// 查看指定组织详情信息
export const orgInfo = (orgId) => {
  return service({
    url: `/sf/team/manage/view/linkage/org/${orgId}/info`,
    method: 'get'
  })
}

// 修改或增加调节组织
export const updateOrgInfo = (params) => {
  return service({
    url: `/sf/team/manage/change/or/save/org/info`,
    method: 'post',
    data: params
  })
}
// 浏览登录账号的单位及其下属 单位 /组织（树）
export const departmentList = (withOrg) => {
  return service({
    url: `/sf/team/manage/view/department/${withOrg}`,
    method: 'get'
  })
}

// 浏览调解员
export const deptMediator = (params) => {
  return service({
    url: `/sf/mediator/view/dept/mediator`,
    method: 'get',
    params
  })
}
// 更新或保存调解员具体信息
export const updateOrSavemediator = (params) => {
  return service({
    url: `/sf/mediator/update/or/save/mediators`,
    method: 'post',
    data: params
  })
}
// 浏览该调解员的要解除或连接的关联部门组织
export const mediatorBelongs = (mediatorId) => {
  return service({
    url: `/sf/mediator/view/${mediatorId}/belongs`,
    method: 'get'
  })
}

// 浏览指定调解员的详细信息
export const mediatorInfo = (mediatorId) => {
  return service({
    url: `/sf/mediator/view/dept/mediator/${mediatorId}/info`,
    method: 'get'
  })
}

// 解除或绑定调解员
export const banOrLink = (mediatorId, deptId) => {
  return service({
    url: `/sf/mediator/ban/or/link/${mediatorId}/${deptId}`,
    method: 'post'
  })
}

// 当前调解员手机号是否存在
export const mediatorByPhone = (phone) => {
  return service({
    url: `/sf/mediator/view/mediator/by/${phone}`,
    method: 'get'
  })
}

