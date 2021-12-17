import { queryById } from '@/api/addCase/index.js'
const caseInfo = {
  state: {
    lawCaseId: localStorage.getItem('lawCaseId') || '',
    litigantId: '',
    caseNo: localStorage.getItem('xaCaseNo') || '',
    caseInfo: {} // 案件详情
  },
  mutations: {
    // 保存案件id
    SET_LAWCASE: (state, lawCaseId) => {
      state.lawCaseId = lawCaseId
      localStorage.setItem('lawCaseId', lawCaseId)
    },
    // 保存当事人id
    SET_LITIGANTID: (state, litigantId) => {
      state.litigantId = litigantId
    },
    SET_CASEINFO: (state, info) => {
      state.caseInfo = info
    },
    SET_CASENO: (state, caseNo) => {
      state.caseNo = caseNo
      localStorage.setItem('xaCaseNo', caseNo)
    }
  },
  getters: {
    getLawCaseId: state => state.lawCaseId, // 获取案件id,
    getLitigantId: state => state.litigantId, // 获取当事人id
    getCaseInfo: state => state.caseInfo, // 获取案件详情
    getCaseNo: state => state.caseNo // 获取案号
  },
  actions: {
    GetCaseInfo({ commit, state }, caseId) {
      return new Promise((resolve) => {
        queryById({ lawCaseId: caseId || state.lawCaseId }).then(({ code, data }) => {
          if (code === 200) {
            commit('SET_CASEINFO', data)
            resolve(data)
          } else {
            console.error('获取案件详情出错')
          }
        })
      })
    }
  }
}
export default caseInfo
