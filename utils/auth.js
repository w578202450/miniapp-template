/**
 * 登录
 */
var HTTP = require('http-util.js');
async function wxlogin() {
  wx.login({
    success: function (res) {
      getopenid(res.code);
    },
    fail: function (res) {
      wx.showModal({
        title: '获取临时code失败',
        content: res.msg,
        showCancel: false
      })
    },
  })
}
/**
 * 获取openid
 */
async function getopenid(code) {
  // var prams = {
  //   code: code
  // }
  // HTTP.getWXAuth(prams).then(res => {
  //   if (res.code == 0){
  //     // getPatientInfo(res.data.openid);
  //     getPatientInfo("o6_DFuMBBkTTwYnKrXsGnrXFoaNE");
  //   }
  // })
  getPatientInfo("o6_DFuMBBkTTwYnKrXsGnrXFoaNE");
}
/**
 * 获取基础数据
 */
async function getPatientInfo(openID) {
  var prams = {
    openID: openID
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
      })
    }
  })
}

module.exports = {
  wxlogin: wxlogin
}