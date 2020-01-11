const app = getApp()

Page({
  data: {
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
})