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
    let time=null
    pageObj.onShow = function () {
      let currentInstance = getPageInstance();
      let that = this
      time=setInterval(() => {
        let pageName=pageObj.data.pageName
        if(pageName==='院长详情页'){
          let data=currentInstance.data
          if(data.materialInfo.videoMaterialSrc==='https://res.100cbc.com/tmc/hospital/2381/hosDetail.html'){
            pageName='医院详情页'
          }
        }
        if (wx.getStorageSync('personInfo').keyID) {
          HTTP.heart({
              patientID: wx.getStorageSync('personInfo').keyID,
              path: currentInstance.route,
              channelCode: "tmcpro",
              channelName: "小程序",
              pathName: pageName || ''
            })
            .then(res => {

            }).catch(e => {
              console.error(e)
            })
        }
      }, 2000);
    }
    pageObj.onHide=function(){
      clearInterval(time)
    }

    pageObj.onUnload=function(){
      clearInterval(time)
    }
  }
  return Page(pageObj)
}


function getPageInstance() { // 获取去往的页面
  var pages = getCurrentPages(); // getCurrentPages小程序获取页面栈函数
  return pages[pages.length - 1];
}