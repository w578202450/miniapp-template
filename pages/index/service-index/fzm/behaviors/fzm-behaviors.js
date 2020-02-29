const app = getApp()

module.exports = Behavior({
  behaviors: [],
  properties: {
    // 容器样式设置
    pageStyle: {
      type: String,
      value: ''
    },
  },
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight
  }
})