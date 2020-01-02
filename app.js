//app.js

const WXAPI = require('apifm-wxapi')
const AUTH = require('utils/auth')

App({
  onLaunch: function () {
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success: function(res) {
        const networkType = res.networkType
        if (networkType == 'none'){
          this.globalData.isConnected = false;
          wx.showToast({
            title: '当前无网络',
            icon:'loading',
            duration:2000
          })
        }
      },
    })

    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function () {
            this.goStartIndexPage()
          }
        })
      } else {
        this.globalData.isConnected = true
        wx.hideToast()
      }
    });

    WXAPI.login_wx(res.code).then(function (res) {
      if (res.code == 10000) {
        // 去注册
        //_this.register(page)
        return;
      }
      if (res.code != 0) {
        // 登录错误
        wx.showModal({
          title: '无法登录',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      wx.setStorageSync('token', res.data.token)
      wx.setStorageSync('uid', res.data.uid)
      if (page) {
        page.onShow()
      }
    })
    // 登录
    // wx.login({
    //   success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 登录错误
        // wx.showModal({
        //   title: '无法登录1',
        //   content: res.code,
        //   showCancel: false
        // })
    //   }
    // })
    // 获取用户信息
    
  /**
   * 自动登录
   */
  // onShow(e) {
    // AUTH.checkHasLogined().then(isLogined => {
    //   if (!isLogined) {
    //     AUTH.login()
    //   }
    // })
  // },
  globalData: {
    userInfo: null,
    isConnected: true
  }
})