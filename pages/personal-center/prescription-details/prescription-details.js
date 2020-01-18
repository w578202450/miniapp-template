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
    prePrice: 0,
    isPreviewRp:1//预览状态
  },

  onLoad: function(e) {
    console.log('---eee', e)
    console.log('---isPreviewRp--', e.isPreviewRp)
    this.data.isPreviewRp = e.isPreviewRp
    this.data.rpID = e.rpID
    this.getRp(e.rpID)
  },

  /**
   *获取处方详情 
   */
  getRp(rpID) {
    wx.showNavigationBarLoading()
    HTTP.getRp({
        rpID: rpID,
        orgID: wx.getStorageSync('orgID')
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 0) {
          this.data.orderID = res.data.orderID
          this.setData({
            rpData: res.data,
            isPreviewRp: this.data.isPreviewRp
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideNavigationBarLoading()
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

  /**
   * 咨询医生
   */
  contactDoctorOption() {
    wx.navigateTo({
      url: '../../online-inquiry/inquiry/chat/chat',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})