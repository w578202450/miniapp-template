const HTTP = require('../../../utils/http-util')

Page({
  addressInfo: null,
  noNetwork: false,
  noData: false,
  orderID: '',
  data: {
    list: []
  },
  onLoad: function() {
    this.loadDatas()
  },

  // 加载数据
  loadDatas() {
    wx.showLoading({
      title: '加载订单列表...',
    });
    this.data.list = [];
    var that = this;
    HTTP.getOrderByPerson({
        buyerID: wx.getStorageSync('personInfo').personID,
        orgID: wx.getStorageSync('orgID'),
        pageIndex: 1,
        pageSize: 100
      })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data.datas.length == 0) {
            that.setData({
              noData: true
            })
          } else {
            this.data.list = this.data.list.concat(res.data.datas)

            var tempRpIds = []
            for (var index in this.data.list) {
              tempRpIds.push(this.data.list[index].rpID)
            }

            that.getRpByList({
              orgID: this.data.list[0].orgID,
              rpIDs: tempRpIds
            })
          }
        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
      })
  },
  getRpByList(params) {
    wx.showLoading({
      title: '加载处方详情...',
    });
    HTTP.getRpByList(params)
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          if (res.data) {
            for (var j in this.data.list) {
              this.data.list[j].diagnosis = res.data[this.data.list[j].rpID].diagnosis
              this.data.list[j].doctorName = res.data[this.data.list[j].rpID].doctorName
            }
          }
        }
        this.setData({
          list: this.data.list
        })
      }).catch(e => {
        wx.hideLoading();
      })
  },

  addressAction: function() {
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  orderDetailsAction: function() {
    wx.navigateTo({
      url: '/pages/order/order-details/order-details',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  payOrder: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    this.data.orderID = this.data.list[index].keyID
    this.data.addressInfo = {
      name: this.data.list[index].receiverName,
      phone: this.data.list[index].receiverPhone,
      address: this.data.list[index].address
    }
    HTTP.orderPrePay({
        orgID: wx.getStorageSync('orgID'),
        orderID: this.data.list[index].keyID,
        price: this.data.list[index].prePrice,
        personID: this.data.list[index].buyerID
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
    var that = this
    this.data.list = []
    this.data.addressInfo = {
      name: null,
      phone: null,
      address: null
    }
    this.data.noNetwork = false
    this.data.noData = false

    if (this.data.addressInfo.name && this.data.addressInfo.phone && this.data.addressInfo.address) {
      wx.navigateTo({
        url: "/pages/address/address-submit/address-submit?name=" + this.data.addressInfo.name + ' &phone=' + this.data.addressInfo.phone + ' &address=' + this.data.addressInfo.address,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) {
          that.loadDatas()
        },
      })
    } else {
      wx.navigateTo({
        url: "/pages/address/address-submit/address-submit",
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) {
          that.loadDatas()
        },
      })
    }
  },
})