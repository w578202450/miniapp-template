const app = getApp()
const AUTH = require('../../utils/auth')
var HTTP = require('../../utils/http-util');
const commonFun = require('../../utils/common');
import {
  genTestUserSig
} from '../../utils/GenerateTestUserSig';
var tim = getApp().globalData.tim;
var TIM = getApp().globalData.TIM;

Page({
  data: {
    userSig: '', // [必选]身份签名，需要从自行搭建的签名服务获取
    disabled: true, // 授权按钮是否不可点击
    loginBtnDisabled: false, // 授权按钮是否不可点击
    selctedIndex: 0, //公众号跳转带参数  0在线问诊 1个人中心
    logined: false, //是否处于登录状态
    lastPageName: ""
  },

  onLoad: function(e) {
    let that = this;
    console.log(e);
    if (e.pageName) {
      that.setData({
        lastPageName: e.pageName
      });
    }
    if (e.selctedIndex) {
      this.data.selctedIndex = e.selctedIndex;
    }
    /**
     * 本地缓存读取 
     * 1.存在unionid 直接进行用户数据请求
     * 2.不存在unionid 进行微信登录
     */
    app.globalData.unionid = wx.getStorageSync('unionid');
    app.globalData.openid = wx.getStorageSync('openID');
    this.data.logined = app.globalData.unionid && app.globalData.openid;
    if (this.data.logined) {
      app.globalData.userInfo = wx.getStorageSync('userInfo');
      this.getPatientInfo(app.globalData.unionid);
    } else {
      this.fetchTempCode();
    }
  },

  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  },

  /** 
   * 微信登录
   * 1.登录成功缓存当前临时code 判断登录态用 
   */
  fetchTempCode() {
    let that = this
    AUTH.fetchTempCode().then(function(res) {
      that.setData({
        disabled: false
      })
      if (res.code) {
        wx.setStorageSync('code', res.code)
      }
    })
  },


  /**
   * 授权登录 
   * 1.记录用户微信数据（个人信息 当前密钥）
   * 2.判断当前缓存是否存在unionid 存在就直接进行用户数据请求
   * 3.缓存不存在unionid 进行微信登录
   * 4.判断登录态session_key是否过期
   * 4.1session_key没过期：读取本地临时sessionKey和当前code 拿到当前的encryptedData和iv进行unionid请求
   * 4.2session_key过期：拿到当前code encryptedData iv 进行unionid请求
   */
  getUserInfo(e) {
    let that = this;
    console.log("手动授权信息：" + JSON.stringify(e.detail));
    if (!e.detail.encryptedData) {
      // 返回首页
      // wx.switchTab({
      //   url: '/pages/online-inquiry/online-inquiry',
      // });
      // 返回对应的tab页
      if (that.data.lastPageName == "online-inquiry") {
        // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        wx.switchTab({
          url: '/pages/online-inquiry/online-inquiry',
        });
      } else if (that.data.lastPageName == "personal-center") {
        // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        wx.switchTab({
          url: '/pages/personal-center/personal-center'
        });
      }
      return
    };
    wx.setStorageSync('encryptedData', e.detail.encryptedData);
    wx.setStorageSync('iv', e.detail.iv);
    wx.setStorageSync('userInfo', e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo;
    if (that.data.logined) {
      that.getPatientInfo(app.globalData.unionid);
    } else {
      // 检查登录态是否过期
      wx.checkSession({
        success(res) {
          that.getounionid(true);
        },
        fail(err) {
          that.getounionid(false);
        }
      })
    }
  },

  /**
   * unionid请求
   * 1.unionid请求成功：缓存临时session_key和unionid 并进行后台用户数据请求
   * 1.1缓存session_key：避免多次点击造成的登录态失效，出现的微信授权失败问题
   * 1.2缓存unionid：用于直接登录
   */
  getounionid(isLoginStatus) {
    let that = this
    AUTH.getounionid(isLoginStatus).then(function(res) {
      that.getPatientInfo(res);
    }, function(error) {
      that.setData({
        disabled: false
      })
    })
  },

  /**
   * 获取基础数据
   */
  getPatientInfo(unionID) {
    wx.showLoading({
      title: '登录中...',
    });
    let that = this
    var prams = {
      unionID: unionID,
      nickName: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName : '',
      avatarUrl: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : '',
      sex: app.globalData.userInfo.sex ? app.globalData.userInfo.sex : '',
      city: app.globalData.userInfo.city ? app.globalData.userInfo.city : '',
      province: app.globalData.userInfo.province ? app.globalData.userInfo.province : '',
    }
    HTTP.getPatientInfo(prams).then(res => {
      that.setData({
        disabled: false
      });
      if (res.code == 0) {
        app.globalData.orgName = res.data.orgName;
        app.globalData.personID = res.data.personID;
        app.globalData.patientID = res.data.keyID;
        app.globalData.orgID = res.data.orgID;
        app.globalData.personInfo = res.data;
        app.globalData.isInitInfo = true;
        wx.setStorage({
          key: 'personInfo',
          data: res.data
        });
        wx.setStorage({
          key: 'orgID',
          data: res.data.orgID,
        });
        wx.setStorage({
          key: 'unionID',
          data: unionID
        });
        wx.setStorage({
          key: 'personID',
          data: res.data.personID
        });
        wx.setStorage({
          key: 'patientID',
          data: res.data.keyID
        });
        wx.setStorage({
          key: 'orgName',
          data: res.data.orgName
        });
        // 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
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
      that.setData({
        disabled: false
      })
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
    wx.showLoading({
      title: '登录中...',
    });
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
        // console.log("获取userSig：" + that.data.userSig);
        if (that.data.userSig) {
          // IM登录
          that.loginIM(userId);
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '获取userSig失败'
        });
      }
    })
  },

  /**
   * IM登录
   */
  loginIM: function(userId) {
    let that = this;
    // IM登录
    tim.login({
      userID: userId,
      userSig: genTestUserSig(userId).userSig /*that.data.userSig*/
    }).then(function(imResponse) {
      console.log("===IM登录成功==="); // 登录成功
      wx.setStorageSync('myUsername', userId);
      wx.hideLoading();
      that.setData({
        loginBtnDisabled: true
      });
      if (that.data.lastPageName == "online-inquiry") {
        wx.navigateTo({
          url: '/pages/online-inquiry/inquiry/chat/chat',
        });
      } else if (that.data.lastPageName == "personal-center") {
        // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
        wx.switchTab({
          url: '/pages/personal-center/personal-center'
        });
      }
      // if (that.data.selctedIndex == 1) {
      //   // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      //   wx.switchTab({
      //     url: '/pages/personal-center/personal-center'
      //   });
      // } else {
      //   // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      //   wx.switchTab({
      //     url: '/pages/online-inquiry/online-inquiry'
      //   });
      // }
    }).catch(function(imError) {
      console.warn("===登录失败===", imError); // 登录失败的相关信息
      wx.hideLoading();
      wx.showToast({
        title: 'IM登录失败'
      })
    });
  }

})