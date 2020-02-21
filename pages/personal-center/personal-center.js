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

  onLoad: function(e) {
    let that = this;
    if (app.globalData.isInitInfo) {
      that.getUserInfoByStorge();
    }
  },

  onShow: function(e) {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
      },
      fail: function(err) {
        that.setData({
          userInfo: {}
        });
        console.log("获取用户缓存信息失败：" + JSON.stringify(err));
      }
    });
  },

  /**
   * 右上角分享功能
   */
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  },

  /**
   * 操作：登录
   */
  getUserInfo: function (e) {
    let that = this;
    if (!e.detail.encryptedData) {
      return
    };
    wx.setStorageSync('encryptedData', e.detail.encryptedData);
    wx.setStorageSync('iv', e.detail.iv);
    wx.setStorageSync('userInfo', e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo;
    if (app.globalData.unionid && app.globalData.openid) {
      commonFun.getPatientInfo(app.globalData.unionid);
    } else {
      // 检查登录态是否过期
      wx.checkSession({
        success(res) {
          commonFun.getounionid(true);
        },
        fail(err) {
          commonFun.getounionid(false);
        }
      })
    }
    that.setData({
      userInfo: e.detail.userInfo
    });
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
      },
      complete: function(e) {
        that.setData({
          isSearchState: true
        });
      }
    });
  },

  /**
   * 操作：跳转到功能栏对应页面
   * 1.未登录，授权登录
   * 2.已登录，跳转页面
   */
  toToolFun: function(e) {
    let that = this;
    if (that.data.userInfo && that.data.userInfo.nickName) {
      let url = e.currentTarget.dataset.toolurl;
      wx.navigateTo({
        url: url,
      });
    } else {
      wx.showToast({
        title: '若要使用该功能，请先进行微信授权登录',
        icon: "none",
        duration: 3000
      })
    }
  }
})