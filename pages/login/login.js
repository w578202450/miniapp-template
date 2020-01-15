const app = getApp()
var HTTP = require('../../utils/http-util.js');
import {
  genTestUserSig
} from '../../utils/GenerateTestUserSig';

Page({
  data: {
    userSig: '' // [必选]身份签名，需要从自行搭建的签名服务获取
  },
  onLoad: function() {
    let that = this
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        app.globalData.userInfo = res.data
        that.wxlogin()
      },
    })
  },

  // 微信授权
  getUserInfo: function(e) {
    let that = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      wx.setStorage({
        key: 'userinfo',
        data: e.detail.userInfo,
        success: function(res) {
          that.wxlogin()
        }
      })
    }

  },
  // 微信登录获取临时code
  wxlogin() {
    wx.showLoading({
      title: '登录中...',
    })
    let that = this
    wx.login({
      success: function(res) {
        that.getopenid(res.code);
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showModal({
          title: '登录失败',
          content: res.msg,
          showCancel: false
        })
      },
    })
  },
  /**
   * 获取openid 判断和缓存的openid是否一致
   * 1.和缓存的openid是一致
   * 1.1再判断本地是否缓存了相应的基础信息，存在就直接跳转到首页，不存在就请求基础数据
   * 2.和缓存的openid是不一致
   * 2.1根据新的openid获取相应的基础数据并缓存新的openid
   * 
   */
  getopenid(code) {
    let that = this
    var prams = {
      code: code
    }
    HTTP.getWXAuth(prams).then(res => {
      if (res.code == 0) {
        that.getPatientInfo(res.data.openid)
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络异常'
      })
    })
  },
  /**
   * 获取userSig
   */
  getUserSig: function(userId) {
    let that = this;
    let prams = {
      userId: userId
    };
    HTTP.getUserSig(prams).then(res => {
      if (res.code == 0) {
        that.setData({
          userSig: res.data.userSig
        });
        wx.setStorage({
          key: 'userSig',
          data: res.data.userSig
        });
        console.log("获取userSig：" + that.data.userSig);
        if (that.data.userSig) {
          // IM登录
          that.loginIM(userId);
        }
      } else {
        console.log("获取userSig失败：" + "code:" + res.data.code + ",message:" + res.data.message);
        wx.hideLoading();
        wx.showToast({
          title: '获取userSig失败'
        })
      }
    })
  },
  /**
   * IM登录
   */
  loginIM: function (userId) {
    let that = this;
    // IM登录
    app.tim.login({
      userID: userId,
      userSig: /*genTestUserSig(res.data.keyID).userSig*/ that.data.userSig
    }).then(function (imResponse) {
      console.log("===IM登录成功===" + JSON.stringify(imResponse.data)); // 登录成功
      wx.hideLoading();
      that.setData({
        loginBtnDisabled:true
      })
      wx.switchTab({
        url: '/pages/online-inquiry/online-inquiry'
      });
    }).catch(function (imError) {
      console.warn("===登录失败===", imError); // 登录失败的相关信息
      wx.hideLoading();
      wx.showToast({
        title: 'IM登录失败'
      })
    });
  },
  /**
   * 获取基础数据
   */

  getPatientInfo(openID) {
    let that = this
    var prams = {
      openID: openID,
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      sex: app.globalData.userInfo.sex,
      city: app.globalData.userInfo.city,
      province: app.globalData.userInfo.province,
    }
    HTTP.getPatientInfo(prams).then(res => {
      if (res.code == 0) {
        wx.setStorage({
            key: 'personInfo',
            data: res.data
          }),
          wx.setStorage({
            key: 'orgID',
            data: res.data.orgID,
          }),
          wx.setStorage({
            key: 'patientID',
            data: res.data.keyID
          }),
          wx.setStorage({
            key: 'openID',
            data: openID
          }),
          wx.setStorage({
            key: 'personID',
            data: res.data.personID
          }),

          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.record']) {
                wx.authorize({
                  scope: 'scope.record',
                  success() {
                    // wx.startRecord()
                  }
                })
              }
            }
          }),

        // 获取userSig
        that.getUserSig(res.data.keyID);
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: '网络异常'
      })
    })
  }

})