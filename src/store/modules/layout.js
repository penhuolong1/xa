
const layout = {
  state: {
    collapsed: localStorage.getItem('xa-collapsed') || 0, // 菜单是否折叠 0 不折叠 1 折叠
    isPhone: false
  },
  mutations: {
    SET_COLLAPSED: (state, collapsed) => {
      state.collapsed = collapsed
      localStorage.setItem('xa-collapsed', collapsed)
    },
    SET_ISPHONE: (state, phone) => {
      state.isPhone = phone
    }
  },
  getters: {
    getCollapsed: state => state.collapsed,
    getIsPhone: state => state.isPhone
  },
  actions: {
  }
}
export default layout
