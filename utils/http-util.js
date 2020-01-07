
var API_BASE_URL = 'http://10.0.0.210:6112/';

var request = function request(url, needDomain,method, data) {
  var _url = needDomain ? (API_BASE_URL + url) : url;
  return new Promise(function (resolve, reject) {
    console.log("----url-----",_url);
    wx.request({
      method: method,
      url: _url,
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: function success(request) {
        resolve(request.data);
      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(function (value) {
    Promise.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    Promise.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

// 1.通过module.exports方式提供给外部调用
module.exports = {
  /*
  *获取微信openid
  */
  getWXAuth: function getWXAuth(parmas){
    return request('http://10.0.0.23:6203/wx/getWXAuth', false, 'post', parmas);
  },
  /*
  *获取微信个人信息
  */
  getPatientInfo: function getPatientInfo(parmas){
    return request('api/tmc/patient/getPatientInfoByOpenID', true, 'get', parmas);
  }
}