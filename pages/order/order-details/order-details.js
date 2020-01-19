const HTTP = require('../../../utils/http-util')

Page({
  data: {
    rpID: '',
    orderID: '',
    orderInfo: null
  },
  onReady: function() {
    this.tmcnavbar = this.selectComponent("#tmcnavbar");
  },

  onLoad: function(e) {
    this.data.orderID = e.orderID;
    this.loadDatas()
  },
  /**
   * 获取订单详情
   */
  loadDatas() {
    wx.showNavigationBarLoading()
    var that = this;
    HTTP.goodsOrder({
        orderID: this.data.orderID,
        orgID: wx.getStorageSync('orgID')
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 0) {
          this.data.orderInfo = res.data
          this.setData({
            orderInfo: this.data.orderInfo
          })
          this.fetchRpDetails(res.data.rpID)
          this.data.rpID = res.data.rpID
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideNavigationBarLoading()
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
    var that = this;
    wx.showNavigationBarLoading()
    HTTP.getRp({
        rpID: rpID,
        orgID: wx.getStorageSync('orgID')
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 0) {
          this.setData({
            rpMedicines: res.data.rpMedicines
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideNavigationBarLoading()
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
      url: '../../personal-center/prescription-details/prescription-details?index=0&isPreviewRp=1&rpID=' + this.data.rpID,
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
    wx.showLoading({
      title: '支付中',
    })
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
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }

      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  },
  /**
   * 支付验证
   */
  tradeOrder: function(paymentID) {
    console.log('---支付校验---', paymentID)
    var that = this
    wx.showLoading({
      title: '支付中...'
    })
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
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  },
  /**
   * 微信支付
   */
  wxPayOptions(payInfo) {
    var that = this
    wx.showLoading({
      title: '支付中...'
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
      title: '支付中...'
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
            title: '支付成功',
            success: function() {
              //1.刷新上一个界面的状态和当前界面数据
              that.loadDatas()
              that.refreshPrePage()
              //2.跳转到地址管理界面
              that.skipAddressSubmit()
            }
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '支付失败',
        })
      })
  },

  refreshPrePage() {
    let currentPage = null; //当前页面
    let prevPage = null; //上一个页面
    let pages = getCurrentPages();
    if (pages.length >= 2) {
      currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.loadDatas()
    }
  },
  /**
   * 跳转到确认收货地址界面
   */
  skipAddressSubmit() {
    var addressInfo = null
    if (!this.data.orderInfo.receiverName ||
      !this.data.orderInfo.receiverPhone ||
      !this.data.orderInfo.address ||
      !this.data.orderInfo.province ||
      !this.data.orderInfo.city ||
      !this.data.orderInfo.area
    ){
      addressInfo = null
    } else {
      addressInfo = {
        name: this.data.orderInfo.receiverName,
        phone: this.data.orderInfo.receiverPhone,
        address: this.data.orderInfo.address,
        province: this.data.orderInfo.province,
        city: this.data.orderInfo.city,
        area: this.data.orderInfo.area,
        remarks: this.data.orderInfo.remarks,
        isDefault: this.data.orderInfo.isDefault ? this.data.orderInfo.isDefault : 0
      }
    }

    var navigateToUrl = ''
    if (addressInfo){
      let obj = JSON.stringify(addressInfo)
      url = '../../address/address-submit/address-submit?addressInfo=' + obj + '&orderID=' + this.data.orderID + '&modifyUser=' + this.data.orderInfo.modifyUser
    } else {
      url = '../../address/address-submit/address-submit?orderID=' + this.data.orderID + '&modifyUser=' + this.data.orderInfo.modifyUser
    }
    
    wx.navigateTo({
      url: navigateToUrl,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 确认收货
   */
  confirmGoods() {
    wx.showModal({
      content: '确定收货？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等...',
          });
          HTTP.deleteAddress({
              orgID: wx.getStorageSync('orgID'),
              deliveryStatusID: '3',
              modifyUser: this.data.orderInfo.modifyUser,
              orderID: this.data.orderInfo.keyID
            })
            .then(res => {
              wx.hideLoading();
              if (res.code == 0) {
                wx.showToast({
                  title: '收货成功',
                  success: function() {
                    that.loadDatas()
                    that.refreshPrePage()
                  }
                })
              }

            }).catch(e => {
              wx.hideLoading();
            })

        } else if (res.cancel) {

        }
      }

    })
  }

})