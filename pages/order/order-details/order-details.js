const HTTP = require('../../../utils/http-util')
Page({
  data: {
    list: []
  },
  onReady: function () {
    this.tmcnavbar = this.selectComponent("#tmcnavbar");
  },
  onLoad: function (e) {
    var orderID = e.orderID;
    this.loadDatas(orderID)
  },
  // 加载数据
  loadDatas(orderID) {
    wx.showLoading({
      title: '加载订单详情...',
    });
    var that = this;
    HTTP.goodsOrder({
      orderID: orderID,
      orgID: '19122116554357936820511001'
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {

        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
      })
  },
})
