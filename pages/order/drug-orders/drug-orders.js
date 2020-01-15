const HTTP = require('../../../utils/http-util')

Page({
  addressInfo: null,
  noData: false,
  data: {
    list: []
  },
  currentIndex:0,

  onLoad: function() {
    this.loadDatas()
  },

  /**
   * 加载订单列表
   */
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
          console.log('res.data.datas.length---', res.data.datas.length)
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
      })
  },
  /**
   * 获取对于的诊断结果
   */
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
  /**
   * 添加地址
   */
  addressAction: function() {
    wx.navigateTo({
      url: '/pages/address/address-add/address-add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 立即支付
   */
  payOrder: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    this.data.currentIndex = index;
    
    wx.navigateTo({
      url: "/pages/order/order-details/order-details?orderID=" + this.data.list[index].keyID +'&delta=2',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 无数据
  noDataOption: function (e) {
    wx.navigateTo({
      url: '/pages/online-inquiry/inquiry/chat/chat',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})