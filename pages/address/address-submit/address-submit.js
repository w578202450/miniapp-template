
Page({
  data: {
  },

  submitAction: function () {
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  onLoad: function () {
  }
})
