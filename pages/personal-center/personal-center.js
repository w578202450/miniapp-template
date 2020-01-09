const app = getApp()



Page({
  data: {
    userInfo: {},
    list: [{
        url: 'health-information/health-information',
        title: '我的健康信息'
      },
      {
        url: '/pages/order/drug-orders/drug-orders',
        title: '药品订单'
      },
      {
        url: 'prescription/prescription',
        title: '我的处方'
      },
      {
        url: '/pages/address/address-list/address-list',
        title: '收货地址'
      }

    ]
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  },

  fetchAuthAction:function(){
    wx.navigateTo({
      url: '/pages/tmc-tips/tmc-tips',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})