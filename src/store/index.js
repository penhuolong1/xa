import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import layout from './modules/layout'
import tagsView from './modules/tagsView'
import user from './modules/user'
import caseInfo from './modules/case'
import sfcase from './modules/sfcase'
import visualize from './modules/visualize'
import book from './modules/book'
import rtc from './modules/rtc'
import common from './modules/common'
export default new Vuex.Store({
  modules: {
    layout,
    tagsView,
    user,
    sfcase,
    caseInfo,
    visualize,
    book,
    rtc,
    common
  }
})
