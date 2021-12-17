import { sfCaseInfoById, getHandleOfCase, listTeamInfo, operateLogOfCase } from '@/api/sfAddcase/index.js'
const sfcase = {
  state: {
    sfLawCaseId: localStorage.getItem('sfLawCaseId') || '',
    sfLitigantId: '',
    sfCaseNo: localStorage.getItem('xaSfCaseNo') || '',
    sfCaseInfo: {},
    teamList: [],
    isDeal: 0, // 是否处理
    teamNum: 0, // 当前案件第几个联动
    teamInfo: {},
    caseHandleLog: [] // 案件日志
  },
  mutations: {
    // 保存案件id
    SET_SFLAWCASE: (state, id) => {
      state.sfLawCaseId = id
      localStorage.setItem('sfLawCaseId', id)
    },
    // 保存当事人id
    SET_SFLITIGANTID: (state, litigantId) => {
      state.litigantId = litigantId
    },
    // 保存案件信息
    SET_SFCASEINFO: (state, caseInfo) => {
      state.sfCaseInfo = caseInfo
    },
    // 保存是否是当前登录角色处理当前信息
    SET_ISDEAL: (state, type) => {
      state.isDeal = type
    },
    // 联动信息列表
    SET_TEAMLIST: (state, list) => {
      state.teamList = list
    },
    // 当前联动信息
    SET_TEAMINFO: (state, info) => {
      state.teamInfo = info
    },
    // 第几个联动信息
    SET_TEAMNUM: (state, num) => {
      state.teamNum = num
    },
    // 案件日志
    SET_CASEHANDLELOG: (state, list) => {
      state.caseHandleLog = list
    },
    // 保存案号
    SET_SFCASENO: (state, sfCaseNo) => {
      state.sfCaseNo = sfCaseNo
      localStorage.setItem('xaSfCaseNo', sfCaseNo)
    }
  },
  getters: {
    getSfLawCaseId: state => state.sfLawCaseId, // 获取案件id,
    getSfLitigantId: state => state.sfLitigantId, // 获取当事人id
    getSfCaseInfo: state => state.sfCaseInfo, // 获取案件信息
    getIsDeal: state => state.isDeal,
    getTeamList: state => state.teamList, // 获取联动列表
    getTeamInfo: state => state.teamInfo, // 获取单个联动信息
    getTeamNum: state => state.teamNum, // 获取单个联动信息
    getCaseHandleLog: state => state.caseHandleLog, // 获取案件日志
    getSfCaseNo: state => state.sfCaseNo // 获取案件日志
  },
  actions: {
    GetSfCaseInfo({ commit, state }, caseId) {
      return new Promise((resolve) => {
        sfCaseInfoById({ sfLawCaseId: caseId || state.sfLawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            commit('SET_SFCASEINFO', data)
            resolve(data)
          } else {
            console.error('获取案件详情出错')
          }
        })
      })
    },
    GetHandleOfCase({ commit, state }, caseId) {
      return new Promise((resolve) => {
        getHandleOfCase({ sfLawCaseId: caseId || state.sfLawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            // data 0 未处理 1通过接收 2不予受理 3补正 4退回 5下发 11补正重新申请
            commit('SET_ISDEAL', data)
            resolve(data)
          } else {
            console.error('获取案件状态')
          }
        })
      })
    },
    // 获取联动信息
    GetListTeamInfo({ commit, state }, caseId) {
      return new Promise((resolve) => {
        listTeamInfo({ sfLawCaseId: caseId || state.sfLawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            commit('SET_TEAMLIST', data)
            if (data && data.length > 0) {
              commit('SET_TEAMINFO', data[state.teamNum])
            }
            resolve(data)
          } else {
            console.error('获取联动失败')
          }
        })
      })
    },
    // 获取案件日志
    GetOperateLogOfCase({ commit, state }, caseId) {
      return new Promise((resolve) => {
        operateLogOfCase({ sfLawCaseId: caseId || state.sfLawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            commit('SET_CASEHANDLELOG', data)
          } else {
            console.error('获取案件日志失败')
          }
        })
      })
    }
  }
}
export default sfcase
