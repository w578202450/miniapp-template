const app = getApp()

Page({
  data: {
    list: [
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: true
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: false
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: true
      },
      {
        name: '王重阳',
        phone: '138****9988',
        address: '四川省成都市黄龙大道290号',
        selected: true
      },
    ]
  },
  onLoad: function () {

  },

  addAction: function(){
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})