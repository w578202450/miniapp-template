const HTTP = require('../../../utils/http-util')
/**
 * delta==2 订单列表跳转
 * delta==3 聊天页面跳转
 */
Page({
  data: {
    rpID: '',
    orderID: '',
    orderInfo: null,
    delta: 2
  },
  onReady: function() {
    this.tmcnavbar = this.selectComponent("#tmcnavbar");
  },
  onLoad: function(e) {
    this.data.orderID = e.orderID;
    this.data.delta = e.delta
    this.fetchOrderDetails()
  },
  /**
   * 获取订单详情
   */
  fetchOrderDetails() {
    wx.showLoading({
      title: '加载订单详情...',
    });
    var that = this;
    HTTP.goodsOrder({
        orderID: this.data.orderID,
        orgID: wx.getStorageSync('orgID')
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.data.orderInfo = res.data
          this.setData({
            orderInfo: this.data.orderInfo
          })
          this.fetchRpDetails(res.data.rpID)
          this.data.rpID = res.data.rpID
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: e,
          icon: 'none'
        })
      })
  },
  /**
   * 获取处方详情
   */
  fetchRpDetails(rpID) {
    wx.showLoading({
      title: '获取处方详情...',
    });
    var that = this;
    HTTP.getRp({
        rpID: rpID,
        orgID: wx.getStorageSync('orgID')
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.setData({
            rpMedicines: res.data.rpMedicines
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
   * 预览处方
   */
  previewPrescriptionAction: function() {
    wx.navigateTo({
      url: '../../personal-center/prescription-details/prescription-details?index=0&rpID=' + this.data.rpID,
    })

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
  /**
   * 在线支付
   */
  payOption() {
    var that = this
    HTTP.orderPrePay({
        orgID: wx.getStorageSync('orgID'),
        orderID: this.data.orderInfo.keyID,
        price: this.data.orderInfo.prePrice,
        personID: this.data.orderInfo.buyerID
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.tradeOrder(res.data.paymentID);
        }

      }).catch(e => {
        wx.hideLoading();
      })
  },
  /**
   * 支付验证
   */
  tradeOrder: function(paymentID) {
    console.log('---支付校验---', paymentID)
    var that = this
    HTTP.tradeOrder({
        body: '医护上门',
        detail: '医护上门PICC换药',
        transID: paymentID,
        sysCode: 'person-tmc',
        openID: wx.getStorageSync('openID')
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '支付校验成功',
          })
          that.wxPayOptions(res.data)
        }
      }).catch(e => {
        wx.hideLoading();
      })
  },
  /**
   * 微信支付
   */
  wxPayOptions(payInfo) {
    var that = this
    wx.showLoading({
      title: '支付中...',
      icon: 'none'
    })
    wx.requestPayment({
      'timeStamp': payInfo.timestamp,
      'nonceStr': payInfo.nonce_str,
      'package': "prepay_id=" + payInfo.prepay_id,
      'signType': 'MD5',
      'paySign': payInfo.sign,
      'success': function(res) {
        console.log('微信支付成功----', res)
        wx.showToast({
          title: '支付成功',
        })
        that.orderPaySuccess()
      },
      'fail': function(res) {
        wx.showToast({
          title: '支付失败',
        })
        console.log('微信支付失败----', res)
      },
      'complete': function(res) {}
    })
  },
  /**
   * 订单支付回调
   * 支付成功后跳转到确认收货界面
   */
  orderPaySuccess() {
    let that = this
    wx.showLoading({
      title: '支付回调...'
    })
    HTTP.orderPaySuccess({
        orgID: wx.getStorageSync('orgID'),
        orderID: this.data.orderID,
        personID: wx.getStorageSync('personID'),
      })
      .then(res => {
        wx.hideLoading();
        console.log('支付回调------', res)
        if (res.code == 0) {
          wx.showToast({
            title: '支付回调成功',
            success: function() {
              let addressInfo = {
                name: that.data.orderInfo.receiverName,
                phone: that.data.orderInfo.receiverPhone,
                address: that.data.orderInfo.address,
                province: that.data.orderInfo.province,
                city: that.data.orderInfo.city,
                area: that.data.orderInfo.area,
                remarks: that.data.orderInfo.remarks,
                isDefault: that.data.orderInfo.isDefault
              }
              let obj = JSON.stringify(addressInfo)
              wx.navigateTo({
                url: '../../address/address-submit/address-submit?delta=' + that.data.delta + '&addressInfo=' + obj + '&orderID=' + that.data.orderID + '&modifyUser=' + that.data.orderInfo.modifyUser,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          })
        } else {
          wx.showToast({
            title: res.message,
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '支付回调失败',
        })
      })
  },

})