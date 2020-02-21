const app = getApp()
const commonFun = require('../../utils/common')

Page({
  data: {
    list: [{
        url: 'health-information/health-information',
        title: '我的健康信息'
      },
      {
        url: '/pages/order/drug-orders/drug-orders',
        title: '药品订单'
      },
      {
        url: 'prescription/prescription',
        title: '我的处方'
      },
      {
        url: "/pages/address/address-list/address-list?optionType=0",
        title: '收货地址'
      }
    ],
    isSearchState: false // 是否查询了一次
  },
  // url: "/pages/personal-center/prescription-details/prescription-details?index=1&rpID=111",
  // url: '/pages/address/address-list/address-list',
  onLoad: function(e) {
    let that = this;
    if (app.globalData.isInitInfo) {
      that.getUserInfoByStorge();
    } else {
      wx.navigateTo({
        url: '/pages/login/login?pageName=' + 'personal-center'
      });
    }
  },
  onShow: function(e) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res);
        that.setData({
          userInfo: res.data
        });
      }
    });
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  },

  /**操作：去登录 */
  toLoginFun: function() {
    // let that = this;
    // that.setData({
    //   isSearchState: true
    // });
    // wx.navigateTo({
    //   url: '/pages/login/login?pageName=' + 'personal-center'
    // });
  },

  /**获取用户缓存信息 */
  getUserInfoByStorge: function() {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log("获取用户缓存信息成功" + JSON.stringify(res));
        that.setData({
          userInfo: res.data
        });
      },
      fail: function(res) {
        console.log("获取用户缓存信息失败");
        wx.navigateTo({
          url: '/pages/login/login?pageName=' + 'personal-center'
        });
      },
      complete: function(e) {
        that.setData({
          isSearchState: true
        });
      }
    });
  },

  /**操作：跳转到功能栏对应页面 */
  toToolFun: function(e) {
    let that = this;
    if (that.data.userInfo && that.data.userInfo.nickName) {
      let url = e.currentTarget.dataset.toolurl;
      wx.navigateTo({
        url: url,
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login?pageName=' + 'personal-center'
      });
    }
  }
})