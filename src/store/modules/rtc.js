const rtc = {
  state: {
    isVideo: false, //
    piliRTC: null,
    QNRTC: null,
    teamId: localStorage.getItem('teamId') || '',
    rtcToken: localStorage.getItem('xaRtcToken') || '',
    isOpen: localStorage.getItem('xaIsOpen') || '' // 是否为开启房间的人 1是 其他不是
  },
  mutations: {
    // 设置是否开启在线视频
    SET_ISVIDEO: (state, isVideo) => {
      state.isVideo = isVideo
    },
    SET_PILIRTC: (state, rtc) => {
      state.piliRTC = rtc
    },
    SET_QNRTC: (state, qnrtc) => {
      state.QNRTC = qnrtc
    },
    SET_ISOPEN: (state, isopen) => {
      localStorage.setItem('xaIsOpen', isopen)
      state.isOpen = isopen
    },
    SET_RTCTOKEN: (state, token) => {
      state.rtcToken = token
      localStorage.setItem('xaRtcToken', token)
    },
    SET_TEAMID: (state, id) => {
      state.teamId = id
      localStorage.setItem('teamId', id)
    }
  },
  getters: {
    getIsVideo: state => state.isVideo, // 获取是否开启在线视频
    getPiliRTC: state => state.piliRTC,
    getIsopen: state => state.isOpen,
    getRtcToken: state => state.rtcToken,
    getTeamId: state => state.teamId,
    getQNRTC: state => {
      return state.QNRTC
    }
  },
  actions: {
    // InitRtc({ commit, state }) {
    //   const rtc = new QNRTC.StreamModeSession()
    //   commit('SET_QNRTC', QNRTC)
    //   commit('SET_PILIRTC', rtc)
    // }
  }
}
export default rtc
