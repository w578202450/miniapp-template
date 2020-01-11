const HTTP = require('../../../utils/http-util')
Page({
  data: {
    detail:null
  },
  onReady: function () {
    this.tmcnavbar = this.selectComponent("#tmcnavbar");
  },
  onLoad: function (e) {
    console.log('------e---', e)
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
          this.data.detail = res.data
          this.setData({
            detail: this.data.detail
          })
          this.getRp(res.data.rpID)
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '网络链接失败',
          icon:'none'
        })
      })
  },

  getRp(rpID){
    
    wx.showLoading({
      title: '获取处方详情...',
    });
    var that = this;
    HTTP.getRp({
      staffID: wx.getStorageSync("patientID")
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '网络链接失败',
          icon: 'none'
        })
      })
  }
})
