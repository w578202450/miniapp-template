const HTTP = require('../../../utils/http-util')

let app = getApp()

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
        orgID: app.globalData.orgID
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 0) {
          this.data.orderInfo = res.data
          this.setData({
            orderInfo: this.data.orderInfo,
            orgName: app.globalData.orgName
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
        orgID: app.globalData.orgID
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
    if (!this.data.rpID) {
      wx.showToast({
        title: '确实处方id',
      });
      return
    }
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
    });
  },
  /**
   * 在线支付
   */
  payOption() {
    if (!this.data.orderInfo.prePrice) {
      wx.showToast({
        title: '缺少金额',
        icon: 'none'
      })
      return;
    }
    this.orderPrePay();
  },
  /**
   * 预创单
   */
  orderPrePay() {
    var that = this
    wx.showLoading({
      title: '支付中...',
    });
    HTTP.orderPrePay({
        orgID: app.globalData.orgID,
        orderID: this.data.orderInfo.keyID,
        price: this.data.orderInfo.prePrice,
        personID: this.data.orderInfo.buyerID
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          that.checkOrderPrePay(res.data.paymentID);
          // this.tradeOrder(res.data.paymentID);
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
   * 校验预创单
   */
  checkOrderPrePay(paymentID) {
    var that = this
    wx.showLoading({
      title: '支付中',
    })
    HTTP.checkOrderPrePay({
        transID: paymentID,
        sysCode: 'person-tmc'
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data.payResult == 1) { //已支付成功
            this.orderPaySuccess()
          } else if (res.data.payResult == 0) { //未支付成功
            this.tradeOrder(paymentID);
          }
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
    if (!paymentID) {
      wx.showToast({
        title: '参数paymentID为nil',
        icon: 'none'
      })
      return;
    }
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
          // wx.showToast({
          //   title: '支付校验成功',
          // })
          that.wxPayOptions(res.data)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '连接失败',
          icon: 'none',
          duration: 2000
        })
      })
  },
  /**
   * 微信支付
   */
  wxPayOptions(payInfo) {
    var that = this;
    wx.requestPayment({
      'timeStamp': payInfo.timestamp,
      'nonceStr': payInfo.nonce_str,
      'package': "prepay_id=" + payInfo.prepay_id,
      'signType': 'MD5',
      'paySign': payInfo.sign,
      'success': function(res) {
        console.log('微信支付成功----', res)
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'none',
        //   duration: 2000
        // })
        that.orderPaySuccess();
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
    });
    console.log('开始支付回调');
    HTTP.orderPaySuccess({
        orgID: app.globalData.orgID,
        orderID: this.data.orderID,
        personID: wx.getStorageSync('personID'),
      })
      .then(res => {
        wx.hideLoading();
        console.log('支付回调------', res)
        if (res.code == 0) {
          // wx.showToast({
          //   title: '支付成功',
          //   success: function() {
          //     console.log('支付回调成功')
          //     //1.刷新上一个界面的状态和当前界面数据
          //     that.loadDatas()
          //     that.refreshPrePage()
          //     //2.跳转到地址管理界面
          //     that.skipAddressSubmit()
          //   }
          // })
          wx.showToast({
            title: "支付成功",
            icon: 'none',
            duration: 2000
          });
          console.log('支付回调成功');
          //1.刷新上一个界面的状态和当前界面数据
          that.loadDatas();
          that.refreshPrePage();
          //2.跳转到地址管理界面
          that.skipAddressSubmit();
        } else {
          console.log('支付回调失败', res.message)
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 2000
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
    console.log('开始跳转this.data.orderInfo---', this.data.orderInfo)
    var addressInfo = null
    if (!this.data.orderInfo.receiverName ||
      !this.data.orderInfo.receiverPhone ||
      !this.data.orderInfo.address ||
      !this.data.orderInfo.province ||
      !this.data.orderInfo.city ||
      !this.data.orderInfo.area
    ) {
      addressInfo = null
    } else {
      addressInfo = {
        name: this.data.orderInfo.receiverName,
        phone: this.data.orderInfo.receiverPhone,
        address: this.data.orderInfo.address,
        province: this.data.orderInfo.province,
        city: this.data.orderInfo.city,
        area: this.data.orderInfo.area,
        remarks: this.data.orderInfo.remarks ? this.data.orderInfo.remarks : '',
        isDefault: this.data.orderInfo.isDefault ? this.data.orderInfo.isDefault : 0
      }
    }
    var navigateToUrl = ''
    let modifyUser = this.data.orderInfo.modifyUser ? this.data.orderInfo.modifyUser : ''
    if (addressInfo) {
      let obj = JSON.stringify(addressInfo)
      navigateToUrl = '../../address/address-submit/address-submit?addressInfo=' + obj + '&orderID=' + this.data.orderID + '&modifyUser=' + modifyUser
    } else {
      navigateToUrl = '../../address/address-submit/address-submit?orderID=' + this.data.orderID + '&modifyUser=' + modifyUser
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
              orgID: app.globalData.orgID,
              deliveryStatusID: '3',
              modifyUser: this.data.orderInfo.modifyUser ? this.data.orderInfo.modifyUser : '',
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