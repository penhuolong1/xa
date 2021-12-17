const visualize = {
  state: {
    courtName: '翔安区联动中心'
  },
  mutations: {
    SET_COURTNAME: (state, name) => {
      state.courtName = name
    }
  },
  getters: {
    getCourtName: state => state.courtName
  },
  actions: {
  }
}
export default visualize
