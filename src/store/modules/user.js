import { userInfo, loginOut } from '@/api/user/user'
import { XATJ } from '@/utils/variables'
const roleName = XATJ + 'role'
const user = {
  state: {
    userInfo: {},
    role: localStorage.getItem(roleName) || ''
  },
  mutations: {
    // 保存用户个人信息
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    // 保存当前角色
    SET_USERROLE: (state, role) => {
      state.role = role
      localStorage.setItem(roleName, role)
    }
  },
  getters: {
    getUserInfo: state => state.userInfo, // 获取用户个人信息
    getUserRole: state => state.role
  },
  actions: {
    GetUserInfo({ commit }) {
      return new Promise((resolve) => {
        userInfo().then(res => {
          if (res.code === 200) {
            const data = res
            commit('SET_USERINFO', data)
            commit('SET_USERROLE', data.loginRole.roleKey)
          } else {
            localStorage.removeItem(roleName)
          }
          resolve(res)
        })
      })
    },
    // 退出登录
    LogOut() {
      return new Promise((resolve, reject) => {
        loginOut()
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default user
