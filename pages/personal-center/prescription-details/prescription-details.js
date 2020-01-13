const HTTP = require('../../../utils/http-util')

Page({
  data: {
    rpID: '',
    index: '',
    tipHidden: true, //是否展示tip提示
    payHidden: true, //是否展示支付界面
    addressInfo: null,
    orderID: '',
    prePrice: 0
  },

  onLoad: function(e) {
    console.log('---eee', e)
    this.data.rpID = e.rpID
    this.data.index = e.index;
    this.data.tipHidden = this.data.index == '0' ? true : false;
    this.data.payHidden = this.data.index == '0' ? true : false;
    this.getRp(e.rpID)

  },

  /**
   *获取处方详情 
   **/
  getRp(rpID) {
    HTTP.getRp({
        rpID: rpID,
        orgID: '19122116554357936820511001'
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (this.data.index == '1') { //消息界面跳转 处理订单
            this.fetchOrderDetails(res.data.orderID)
          }
          this.setData({
            rpData: res.data,
            tipHidden: this.data.tipHidden,
            payHidden: this.data.payHidden
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
   *获取订单详情
   **/
  fetchOrderDetails(orderID) {
    this.data.orderID = orderID
    HTTP.goodsOrder({
        orderID: orderID,
        orgID: '19122116554357936820511001'
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.data.addressInfo = {
            name: res.data.receiverName,
            phone: res.data.receiverPhone,
            address: res.data.address
          }
          this.data.prePrice = res.data.prePrice
          this.setData({
            prePrice: res.data.prePrice
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: e,
          icon: 'none'
        })
      })
  },

  payAction: function() {
    this.navigateToAddress()
    // var that = this
    // HTTP.orderPrePay({
    //   orgID: wx.getStorageSync('orgID'),
    //   orderID: this.data.orderID,
    //   price: this.data.prePrice,
    //   personID: wx.getStorageSync('personID')
    // })
    //   .then(res => {
    //     wx.hideLoading();
    //     if (res.code == 0) {
    //       this.tradeOrder(res.data.paymentID);
    //     }

    //   }).catch(e => {
    //     wx.hideLoading();
    //   })

  },

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

  orderPaySuccess() {
    HTTP.orderPaySuccess({
        orgID: wx.getStorageSync('orgID'),
        orderID: this.data.orderID,
        personID: wx.getStorageSync('personID'),
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '支付回调成功',
          })
          this.navigateToAddress()
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


  navigateToAddress() {

    console.log('this.data.addressInfo.name---',this.data.addressInfo.name)
    console.log('this.data.addressInfo.phone---', this.data.addressInfo.phone)
    console.log('this.data.addressInfo.address---', this.data.addressInfo.address)

    if (this.data.addressInfo.name && this.data.addressInfo.phone && this.data.addressInfo.address) {
      wx.navigateTo({
        url: "/pages/address/address-submit/address-submit?name=" + this.data.addressInfo.name + ' &phone=' + this.data.addressInfo.phone + ' &address=' + this.data.addressInfo.address,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) {
        },
      })
    } else {
      wx.navigateTo({
        url: "/pages/address/address-submit/address-submit",
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) {
          
        },
      })
    }
    
  },
})