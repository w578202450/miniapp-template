const app = getApp()

// var nikename = "付志敏"

Page({
  data: {
    nikename: "付志敏",
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