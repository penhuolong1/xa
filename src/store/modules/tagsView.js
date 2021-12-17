
import menu from '@/router/menu.js'
import sfmenu from '@/router/sfMenu.js'
import router from '@/router/index.js'

function findByJson(list, label, value) {
  if (!list || list.length === 0) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    if (a[label] === value) {
      return a
    } else {
      if (a.children && a.children.length > 0) {
        const res = findByJson(a.children, label, value)
        if (res) {
          return res
        }
      }
    }
  }
}

const tagsView = {
  state: {
    tagsViewList: [] // 标签总列表
  },
  mutations: {
    // 右侧菜单Tab导航栏添加
    ADD_TAGVIEWLIST: (state, tagViews) => {
      const obj = findByJson([...menu, ...sfmenu], 'path', tagViews)
      if (!obj) {
        return
      }
      if (!state.tagsViewList && state.tagsViewList.length == 0) { // 如果数组中没数据则直接添加
        state.tagsViewList.push({
          title: obj.title,
          path: obj.path
        })
      } else { // 如果有数据判断是否已经存在
        if (state.tagsViewList.findIndex(item => item.path == tagViews) == -1) {
          state.tagsViewList.push({
            title: obj.title,
            path: obj.path
          })
        }
      }
    },
    // 其他路径Tab导航栏添加
    ADD_OTHERTAGVIEWLIST: (state, tagViews) => {
      if (!state.tagsViewList && state.tagsViewList.length == 0) { // 如果数组中没数据则直接添加
        state.tagsViewList.push({
          title: tagViews.title,
          path: tagViews.path
        })
      } else { // 如果有数据判断是否已经存在
        const index = state.tagsViewList.findIndex(item => item.title == tagViews.title)
        if (index === -1) {
          state.tagsViewList.push({
            title: tagViews.title,
            path: tagViews.path
          })
        } else {
          state.tagsViewList[index].path = tagViews.path
        }
      }
    },
    // 添加案件详情进导航栏
    ADD_TAGVIEWCASE: (state, obj) => {
      if (!obj) {
        return
      }

      if (!state.tagsViewList && state.tagsViewList.length == 0) { // 如果数组中没数据则直接添加
        state.tagsViewList.push({
          title: obj.caseNo,
          path: obj.path,
          caseId: obj.caseId,
          type: obj.type
        })
      } else { // 如果有数据判断是否已经存在
        if (state.tagsViewList.findIndex(item => item.title == obj.caseNo) == -1) {
          state.tagsViewList.push({
            title: obj.caseNo,
            path: obj.path,
            caseId: obj.caseId,
            type: obj.type
          })
        }
      }
    },
    // 清空所有
    CLEAR_TAGVIEWLIST: (state, path) => {
      const obj = state.tagsViewList.find(item => item.path === path)
      state.tagsViewList = [obj]
    }
  },
  getters: {
    getTagsViewList: state => state.tagsViewList
  },
  actions: {
    ToDetail({ commit }, obj) {
      commit('SET_LAWCASE', obj.caseId)
      commit('SET_CASENO', obj.caseNo)
      commit('ADD_TAGVIEWCASE', obj)
      router.push(obj.path)
    },
    ToSfDetail({ commit }, obj) {
      commit('SET_SFLAWCASE', obj.caseId)
      commit('SET_SFCASENO', obj.caseNo)
      commit('ADD_TAGVIEWCASE', obj)
      router.push(obj.path)
    },
    // 删除tab导航栏
    DelTags: ({ commit, state }, { path, isNow }) => {
      const index = state.tagsViewList.findIndex(item => item.path === path)
      state.tagsViewList.splice(index, 1)
      if (isNow) { // 如果删除得是当前得路由
        let obj = {}
        if (index === 0) {
          obj = state.tagsViewList[0]
        } else {
          obj = state.tagsViewList[index - 1]
        }
        if (obj.caseId) {
          commit('SET_LAWCASE', obj.caseId)
          commit('SET_CASENO', obj.title)
        }
        router.replace({ path: '/redirect' + obj.path })
      }
    }
  }
}

export default tagsView
