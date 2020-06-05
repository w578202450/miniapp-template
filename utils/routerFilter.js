const appGlobalData = getApp().globalData;
const HTTP = require('./http-util')
/**
 * routerFillter --全局路由拦截器
 * @function
 * @param{Object} pageObj 当前页面的page对象
 * @param{Boolean} flag 是否开启权限判断
 */
exports.routerFillter = function (pageObj, flag = false) {
  if (flag) {
    let _onShow = pageObj.onShow
    pageObj.onShow = function () {
      let currentInstance = getPageInstance();
      let that = this
      setInterval(() => {
        if (wx.getStorageSync('personInfo').keyID) {
          HTTP.heart({
              patientID: wx.getStorageSync('personInfo').keyID,
              path: currentInstance.route,
              channelCode: "tmcpro",
              channelName: "小程序",
              pathName: pageObj.data.pageName || ''
            })
            .then(res => {

            }).catch(e => {
              console.error(e)
            })
        }
      }, 2000);
      // 这一步是自己定义获取登录状态的,只是个判断权限的
      // appGlobalData.getSignPrms.then((res) => {
      //   // 改回this指针
      //   res.status && _onShow.call(that)
      // }, (err) => {
      //   // 用户未登录，重定向个人页
      //   wx.switchTab({
      //     url: '/pages/manage/manage'
      //   })
      // })
    }
  }
  return Page(pageObj)
}


function getPageInstance() { // 获取去往的页面
  var pages = getCurrentPages(); // getCurrentPages小程序获取页面栈函数
  return pages[pages.length - 1];
}