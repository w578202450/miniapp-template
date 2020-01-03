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
  HTTP.postRequest("http://10.0.0.23:6203/wx/getWXAuth", prams,
    function (res) {
      console.log("===success--open===" + JSON.stringify(res.data));
      getbaseinfo(res.data.openid);
    },
    function (err) {
      wx.showModal({
        title: '获取openid失败',
        content: res.msg,
        showCancel: false
      })
    })
}
/**
 * 获取基础数据
 */
async function getbaseinfo(openID) {
  var prams = {
    openID: openID
  }
  HTTP.getRequest("http://10.0.0.23:6112/api/tmc/patient/getPatientInfoByOpenID", prams,
    function (res) {
      if (res.code == 0) {
        console.log("===success--base===" + JSON.stringify(res.data));
      } else {
        wx.showToast({
          title: res.message,
          duration: 2000
        })
      }

    },
    function (err) {
      wx.showToast({
        title: '获取基础信息失败',
        duration: 2000
      })
    })
}

module.exports = {
  wxlogin: wxlogin
}