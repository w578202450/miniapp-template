/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-30 17:21:38
 */
import StoreManager, { IGlobalData, initGlobalData } from 'store/storeManager'

/**
 * 全局设置默认分享主页
 */
function injectShareForPage() {
  const _Page = Page
  Page = function (pageConfig) {
    // 设置全局默认分享
    pageConfig = Object.assign(
      {
        onShareAppMessage: function () {
          return {
            title: 'ideaPod',
            path: 'pages/index/index',
          }
        },
        onShareTimeline: function () {
          return {
            title: 'ideaPod',
          }
        },
      },
      pageConfig
    )

    _Page(pageConfig)
  }
}
injectShareForPage()

App({
  globalData: initGlobalData(),
  onLaunch() {
    StoreManager.getInstance(this).initLogs()
    // 登录
    wx.login({
      success: (res) => {
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: () => {
        wx.showToast({
          title: '111',
          icon: 'error',
        })
      },
    })
  },
})
