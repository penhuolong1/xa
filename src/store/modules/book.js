const book = {
  state: {
    fileId: '' // 卷宗id
  },
  mutations: {
    // 卷宗id
    SET_FileId: (state, fileId) => {
      state.fileId = fileId
    }
  },
  getters: {
    getFileId: state => state.fileId // 获取卷宗id,
  },
  actions: {
  }
}
export default book
