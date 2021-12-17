const common = {
  state: {
    unitId: '', // 单位id,
    orgId: '' // 组织id
    // peopleId: '' // 调解员id
  },
  mutations: {
    SET_UNITID: (state, id) => {
      state.unitId = id
    },
    SET_ORGID: (state, id) => {
      state.orgId = id
    }
  },
  getters: {
    getUnit: state => state.unitId, //  单位id
    getOrgId: state => state.orgId //  组织id
  },
  actions: {

  }
}
export default common
