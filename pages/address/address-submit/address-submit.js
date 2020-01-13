
Page({
  data: {
    addressInfo:{
      name:'张三',
      phone:'1234566677',
      address:'北极颠三倒四的史蒂夫舒服的'
    }
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
