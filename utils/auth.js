
const WXAPI = require('apifm-wxapi')

async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

/**
 * 检查登录状态 返回true或者false
 */
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

/**
 * 授权登录
 */
async function login(page) {
  const _this = this
  wx.login({
    success: function (res) {
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
    }
  })
}

module.exports = {
  checkHasLogined: checkHasLogined,
  login: login
}