const socket = {
  state: {
    socket: null
  },
  mutations: {
    SET_SOCKET: (state, socket) => {
      state.socket = socket
    }
  },
  getters: {
    getSocket: state => state.socket
  },
  actions: {
    SetSocket({ commit, state }, params) {
      const ws = `http://xatjtest.olcourt.cn/websocket?cmd=5&username=${params.userId}&lawcase=${params.lawcaseId}`
      commit('SET_SOCKET', new WebSocket(ws))
    },
    WebsocketSend({ commit, state }, content) {
      state.socket.send(content)
    }
  }
}
export default socket
