const HTTP = require('../../../utils/http-util')

let app = getApp()

Page({
  addressInfo: null,
  noData: false,
  data: {
    list: []
  },
  currentIndex: 0,

  onLoad: function() {
    this.loadDatas()
  },

  onPullDownRefresh() {
    this.loadDatas()
  },

  /**
   * 加载订单列表
   */
  loadDatas() {
    this.data.list = [];
    var that = this;
    wx.showNavigationBarLoading()
    HTTP.getOrderByPerson({
        buyerID: wx.getStorageSync('personInfo').personID,
        orgID: app.globalData.orgID,
        pageIndex: 1,
        pageSize: 100
      })
      .then(res => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        that.setData({
          noNetwork: false
        })
        if (res.code == 0) {
          if (res.data.datas && res.data.datas.length == 0) {
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
              orgID: app.globalData.orgID,
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
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        that.setData({
          noNetwork: true
        })
      })
  },
  /**
   * 获取对于的诊断结果
   */
  getRpByList(params) {
    wx.showNavigationBarLoading()
    HTTP.getRpByList(params)
      .then(res => {
        wx.hideNavigationBarLoading()
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
        wx.hideNavigationBarLoading()
      })
  },
  /**
   * 添加地址
   */
  addressAction: function(e) {
    var index = e.currentTarget.dataset.index;
    var addressInfo = null
    if (!this.data.list[index].receiverName ||
      !this.data.list[index].receiverPhone||
      !this.data.list[index].address ||
      !this.data.list[index].province ||
      !this.data.list[index].city ||
      !this.data.list[index].area){
        addressInfo = null
    } else {
      addressInfo = {
        name: this.data.list[index].receiverName,
        phone: this.data.list[index].receiverPhone,
        address: this.data.list[index].address,
        province: this.data.list[index].province,
        city: this.data.list[index].city,
        area: this.data.list[index].area,
        remarks: this.data.list[index].remarks ? this.data.list[index].remarks : '',
        isDefault: this.data.list[index].isDefault ? this.data.list[index].isDefault : 0
      }
    } 

    let modifyUser = this.data.list[index].modifyUser ? this.data.list[index].modifyUser : ''
    let orderID = this.data.list[index].orderID ? this.data.list[index].orderID : orderID;

    var navigateToUrl = ''

    if (addressInfo){
      let obj = JSON.stringify(addressInfo)
      navigateToUrl = '../../address/address-submit/address-submit?addressInfo=' + obj + '&orderID=' + orderID + '&modifyUser=' + modifyUser
    } else {
      navigateToUrl = '../../address/address-submit/address-submit?orderID=' + orderID + '&modifyUser=' + modifyUser
    }
  
    wx.navigateTo({
      url: navigateToUrl,
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
    if (!this.data.list[index].keyID){
      wx.showToast({
        title: '缺少订单id',
        icon:'none'
      })
      return;
    }
    wx.navigateTo({
      url: "/pages/order/order-details/order-details?orderID=" + this.data.list[index].keyID,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 无数据
  noDataOption: function(e) {
    wx.navigateTo({
      url: '/pages/online-inquiry/inquiry/chat/chat',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  noNetworkOption() {
    this.loadDatas()
  }

})