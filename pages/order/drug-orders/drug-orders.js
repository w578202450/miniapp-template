const HTTP = require('../../../utils/http-util')

Page({
  noNetwork: false,
  noData: false,
  data: {
    list: []
  },
  onLoad: function () {
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
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
      })
  },
  getRpByList(params){
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
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
        this.setData({
          list: this.data.list
        })
      }).catch(e => {
        wx.hideLoading();
      })
  },

  addressAction: function(){
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  orderDetailsAction:function(){
    wx.navigateTo({
      url: '/pages/order/order-details/order-details',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  payOrder:function(e){
    var that = this
    console.log('ddddd----',e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    HTTP.orderPrePay({
      orgID:wx.getStorageSync('orgID'),
      orderID: this.data.list[index].keyID,
      price: this.data.list[index].prePrice,
      personID: this.data.list[index].buyerID
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          this.tradeOrder(res.data.accountTransID, res.data.paymentID);
        } else {
          wx.showToast({
            title: res.message,
            icon:'none'
          })
        }
        
      }).catch(e => {
        wx.hideLoading();
      })
    
  },

  tradeOrder:function(accountTransID, paymentID){
    console.log('---支付校验---', accountTransID, paymentID)
    var that = this
    HTTP.tradeOrder({
      body: '医护上门',
      detail: '医护上门PICC换药',
      transID: accountTransID,
      sysCode: 'person-app'
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '支付校验成功',
          })
          that.wxPayOptions()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();
      })
  },

  wxPayOptions(){
    wx.requestPayment(
      {
        'timeStamp': '',
        'nonceStr': '',
        'package': '',
        'signType': 'MD5',
        'paySign': '',
        'success': function (res) {
          wx.showToast({
            title: '支付成功',
          })
         },
        'fail': function (res) { },
        'complete': function (res) { }
      })
  },

  orderPaySuccess(){
    HTTP.orderPaySuccess({
      // orgID: ,
      // orderID: ,
      // personID: ,
    })
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '支付成功',
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.hideLoading();
      })
  },

  // 无网络
  noNetworkOption: function () {
    this.loadDatas()
  },
  // 无数据
  noDataOption: function (e) {
    wx.navigateTo({
      url: '../../online-inquiry/inquiry/chat/chat',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})