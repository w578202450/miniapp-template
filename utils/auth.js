/**
 * 登录
 */
var HTTP = require('http-util.js');
async function wxlogin() {
  wx.login({
    success: function (res) {
      console.log("===success--code===" + JSON.stringify(res.code));
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
  var prams = {
    code: code
  }
  
  HTTP.getWXAuth(prams).then(res => {
    if (res.code == 0){
      console.log("===success--open===" + JSON.stringify(res.data));
      getPatientInfo(res.data.openid);
    }
  })
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
      console.log("===success--base===" + JSON.stringify(res.data));
      wx.setStorage({
        key: 'personInfo',
        data: res.data
      })
    }
  })
}

module.exports = {
  wxlogin: wxlogin
}