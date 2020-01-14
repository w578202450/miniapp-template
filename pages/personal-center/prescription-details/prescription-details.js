const HTTP = require('../../../utils/http-util')
/**
 * 处方详情界面
 * 1.聊天界面---处方详情界面---可支付操作
 * 2.处方列表界面---处方详情界面
*/
Page({
  data: {
    rpID: '',
    addressInfo: null,
    orderID: '',
    prePrice: 0
  },

  onLoad: function(e) {
    console.log('---eee', e)
    this.data.rpID = e.rpID
    this.getRp(e.rpID)
  },

  /**
   *获取处方详情 
   */
  getRp(rpID) {
    wx.showLoading({
      title: '处方详情...',
    })
    HTTP.getRp({
        rpID: rpID,
        orgID: '19122116554357936820511001'
      })
      .then(res => {
        console.log('-------', res)
        wx.hideLoading();
        if (res.code == 0) {
          this.data.orderID = res.data.orderID
          this.setData({
            rpData: res.data
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '网络链接失败',
          icon: 'none'
        })
      })
  },
  /**
   * 点击支付按钮跳转到支付详情界面
   */
  payAction: function() {
    wx.navigateTo({
      url: "/pages/order/order-details/order-details?orderID=" + this.data.orderID,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})