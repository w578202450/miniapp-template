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
      buyerID: '123',
      orgID: '19122116554357936820511001',
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
        }
        this.setData({
          list: this.data.list
        })
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        })
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