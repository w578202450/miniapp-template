const HTTP = require('../../../utils/http-util')
const commonFun = require('../../../utils/common')
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
    isPreviewRp:0
  },

  onLoad: function(e) {
    console.log('---eee', e)
    if (e.isPreviewRp){
      this.data.isPreviewRp = e.isPreviewRp
    }
    this.data.inquiryID = e.inquiryID
    this.data.rpID = e.rpID
    this.loadDatas();
  },

  //右上角分享功能
  onShareAppMessage: function (res) {
    return commonFun.onShareAppMessageFun();
  },

  loadDatas(){
    if (this.data.inquiryID) { //处方id查处方
      this.fetchRpByInquiryID(this.data.inquiryID)
    } else if (this.data.rpID) { //问诊id查处方
      this.fetchRpByRpID(this.data.rpID)
    } else {
      wx.showToast({
        title: '缺少处方id',
        icon:'none'
      })
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
            payStatus: res.data.rp.payStatus,
            isPreviewRp: this.data.isPreviewRp,
            rpMedicines: res.data.rpMedicines,
            isHiddenPregnancy: res.data.rp.sex == 2 ? false : true
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
            payStatus: res.data.payStatus,
            isPreviewRp: this.data.isPreviewRp,
            rpMedicines: res.data.rpMedicines,
            isHiddenPregnancy: res.data.sex == 2 ? false : true
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
    wx.navigateBack({

    })
  },
})