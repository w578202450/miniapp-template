//logs.js
// const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  },

  skipToLoginView(){
    wx.navigateTo({
      url: '/pages/login/login?selctedIndex=1',
    })
  }
})
