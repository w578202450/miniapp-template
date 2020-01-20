const HTTP = require('../../../utils/http-util')

let app = getApp()
/**
 * 处方详情界面
 * 1.聊天界面---处方详情界面---可支付操作
 * 2.处方列表界面---处方详情界面
 */
Page({
  data: {
    rpID: '', //处方id
    inquiryID: '', //问诊id
    orderID: '',
    isPreviewRp: 1 //预览状态 只预览不进行支付
  },

  onLoad: function(e) {
    console.log('---eee', e)
    console.log('---isPreviewRp--', e.isPreviewRp)
    this.data.isPreviewRp = e.isPreviewRp
    this.data.rpID = e.rpID
    if (isPreviewRp == 0 && inquiryID) { //处方id查处方
      this.fetchRpByInquiryID(inquiryID)
    } else if (isPreviewRp == 1 && rpID) { //问诊id查处方
      this.fetchRpByRpID(e.rpID)
    }

  },

  /**
   *通过问诊id获取处方详情 
   */
  fetchRpByInquiryID(inquiryID) {
    wx.showNavigationBarLoading()
    HTTP.getRpInfoByInquiryID({
        inquiryID: inquiryID,
        orgID: app.globalData.orgID
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 0) {
          this.data.orderID = res.data.rp.orderID
          this.setData({
            rpData: res.data.rp,
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
   *通过处方id获取处方详情 
   */
  fetchRpByRpID(rpID) {
    wx.showNavigationBarLoading()
    HTTP.getRp({
        rpID: rpID,
        orgID: app.globalData.orgID
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
    if (this.data.orderID){
      wx.navigateTo({
        url: "/pages/order/order-details/order-details?orderID=" + this.data.orderID,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.showToast({
        title: '缺少订单id',
        icon:'none'
      })
    }
    
  },

  /**
   * 咨询医生
   */
  contactDoctorOption() {
    wx.navigateTo({
      url: '../../online-inquiry/inquiry/chat/chat',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})