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
        url:"/pages/address/address-list/address-list?option=0",
        title: '收货地址'
      }
    ]
  },
  // url: "/pages/personal-center/prescription-details/prescription-details?index=1&rpID=111",
  // url: '/pages/address/address-list/address-list',
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
})