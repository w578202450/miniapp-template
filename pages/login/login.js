const app = getApp()
var HTTP = require('../../utils/http-util.js');
import {
  genTestUserSig
} from '../../utils/GenerateTestUserSig';
var tim = getApp().globalData.tim;
var TIM = getApp().globalData.TIM;

Page({
  data: {
    userSig: '', // [必选]身份签名，需要从自行搭建的签名服务获取
    disabled: true
  },

  onLoad: function() {
    /**
     * 本地缓存读取 
     * 1.存在unionid 直接进行用户数据请求
     * 2.不存在unionid 进行微信登录
     */
    app.globalData.unionid = wx.getStorageSync('unionid')
    app.globalData.openid = wx.getStorageSync('openID')
    app.globalData.userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : ''
    if (app.globalData.unionid && app.globalData.openid) {
      this.getPatientInfo(app.globalData.unionid)
    } else {
      this.fetchWxCode()
    }
  },
  /** 
   * 微信登录
   * 1.登录成功缓存当前临时code 判断登录态用 
   */
  fetchWxCode() {
    wx.showLoading({
      title: '登录中...',
    })
    let that = this
    wx.login({
      success(res) {
        wx.hideLoading()
        that.setData({
          disabled: false
        })
        if (res.code) {
          app.globalData.code = res.code
          app.globalData.code = wx.setStorageSync('code', res.code)
          console.log('获取到微信临时code-----', res.code)
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
          console.log('登录失败！' + res.errMsg)
        }
      },

      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
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
    console.log('获取到微信临时code-----', app.globalData.code)
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.unionid = wx.getStorageSync('unionid')
    app.globalData.openid = wx.getStorageSync('openID')
    wx.setStorageSync('encryptedData', e.detail.encryptedData)
    wx.setStorageSync('iv', e.detail.iv)
    wx.setStorageSync('userInfo', e.detail.userInfo)
    if (app.globalData.unionid && app.globalData.openid) {
      this.getPatientInfo(app.globalData.unionid)
    } else {
      let that = this
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          app.globalData.code = wx.getStorageSync('code')
          app.globalData.sessionKey = wx.getStorageSync('sessionKey')
          that.getounionid(app.globalData.sessionKey)
        },
        fail() {
          app.globalData.userInfo = e.detail.userInfo
          that.getounionid('')
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
  getounionid(sessionKey) {
    wx.showLoading({
      title: '登录中...',
    })
    let that = this
    var prams = {
      code: app.globalData.code ? app.globalData.code : '',
      encryptedData: app.globalData.encryptedData ? app.globalData.encryptedData : '',
      iv: app.globalData.iv ? app.globalData.iv : '',
      sessionKey: sessionKey
    }
    HTTP.getWXAuth(prams).then(res => {
      wx.hideLoading()
      if (res.code == 0) {
        // unionid
        wx.setStorageSync('sessionKey', res.data.session_key)
        wx.setStorageSync('unionid', res.data.unionid)
        wx.setStorageSync('openID', res.data.openid)
        app.globalData.sessionKey = res.data.session_key
        that.getPatientInfo(res.data.unionid)
      } else {
        that.setData({
          disabled: false
        })
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


  //   onLoad: function() {
  //     let that = this
  //     wx.getStorage({
  //       key: 'userinfo',
  //       success: function(res) {
  //         app.globalData.userInfo = res.data
  //         that.wxlogin()
  //       },
  //     })
  //   },

  //   // 微信授权
  //   getUserInfo: function(e) {
  //     let that = this
  //     wx.checkSession({
  //       success() {
  //         //session_key 未过期，并且在本生命周期一直有效
  //         that.getounionid(wx.getStorageSync('sessionKey'))
  //       },
  //       fail() {
  //         wx.setStorageSync('encryptedData', e.detail.encryptedData)
  //         wx.setStorageSync('iv', e.detail.iv)
  //         if (e.detail.userInfo) {
  //           app.globalData.userInfo = e.detail.userInfo
  //           wx.setStorage({
  //             key: 'userinfo',
  //             data: e.detail.userInfo,
  //             success: function (res) {
  //               that.wxlogin()
  //             }
  //           })
  //         }
  //       }
  //     })

  //   },
  //   // 微信登录获取临时code
  //   wxlogin() {
  //     wx.showLoading({
  //       title: '登录中...',
  //     })
  //     let that = this
  //     wx.login({
  //       success: function(res) {
  //         wx.setStorageSync('wxCode', res.code)
  //         that.getounionid("");
  //       },
  //       fail: function(res) {
  //         wx.hideLoading()
  //         wx.showModal({
  //           title: '登录失败',
  //           content: res.msg,
  //           showCancel: false
  //         })
  //       },
  //     })
  //   },
  //   /**
  //    * 获取openid 判断和缓存的openid是否一致
  //    * 1.和缓存的openid是一致
  //    * 1.1再判断本地是否缓存了相应的基础信息，存在就直接跳转到首页，不存在就请求基础数据
  //    * 2.和缓存的openid是不一致
  //    * 2.1根据新的openid获取相应的基础数据并缓存新的openid
  //    * */
  //   getounionid(sessionKey) {
  //     let that = this
  //     var prams = {
  //       code: wx.getStorageSync('wxCode'),
  //       encryptedData: wx.getStorageSync('encryptedData'),
  //       iv: wx.getStorageSync('iv'),
  //       sessionKey: sessionKey
  //     }
  //     HTTP.getWXAuth(prams).then(res => {
  //       if (res.code == 0) {
  //         // unionid
  //         wx.setStorageSync('sessionKey', res.data.session_key)
  //         that.getPatientInfo(res.data.unionid)
  //       } else {
  //         wx.hideLoading()
  //         wx.showToast({
  //           title: res.message,
  //           icon: 'none'
  //         })
  //       }
  //     }).catch(e => {
  //       wx.hideLoading()
  //       wx.showToast({
  //         title: '网络异常'
  //       })
  //     })
  //   },
  /**
   * 获取userSig
   */
  getUserSig: function(userId) {
    wx.showLoading({
      title: '登录中...',
    })
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
  loginIM: function(userId) {
    let that = this;
    // wx.showModal({
    //   title: '微信授权信息',
    //   content: "userId:" + userId + ",userSig:" + that.data.userSig
    // })
    wx.setStorageSync('myUsername', userId);
    // IM登录
    tim.login({
      userID: userId,
      userSig: genTestUserSig(userId).userSig /*that.data.userSig*/
    }).then(function(imResponse) {
      console.log("===IM登录成功===" + JSON.stringify(imResponse.data)); // 登录成功
      wx.hideLoading();
      that.setData({
        loginBtnDisabled: true
      })
      wx.switchTab({
        url: '/pages/online-inquiry/online-inquiry'
      });
    }).catch(function(imError) {
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

  getPatientInfo(unionID) {
    wx.showLoading({
      title: '登录中...',
    })
    let that = this
    var prams = {
      unionID: unionID,
      nickName: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName: '',
      avatarUrl: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : '',
      sex: app.globalData.userInfo.sex ? app.globalData.userInfo.sex : '',
      city: app.globalData.userInfo.city ? app.globalData.userInfo.city : '',
      province: app.globalData.userInfo.province ? app.globalData.userInfo.province : '',
    }
    HTTP.getPatientInfo(prams).then(res => {
      that.setData({
        disabled: false
      })
      if (res.code == 0) {
        app.globalData.orgName = res.data.orgName
        app.globalData.personID = res.data.personID
        app.globalData.patientID = res.data.keyID
        app.globalData.orgID = res.data.orgID
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
            key: 'unionID',
            data: unionID
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
      that.setData({
        disabled: false
      })
      wx.hideLoading()
      wx.showToast({
        title: '网络异常'
      })
    })
  }

})