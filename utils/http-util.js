
var API_BASE_URL = 'http://10.0.0.210:6112/';

var request = function request(url, needDomain,method, data) {
  
  var _url = needDomain ? (API_BASE_URL + url) : url;
  console.log("------------------------");
  console.log("请求地址:"+ _url);
  console.log("请求入参:"+ JSON.stringify(data));
  console.log("请求方式:" + method);
  console.log("------------------------");

  return new Promise(function (resolve, reject) {
    
    wx.request({
      method: method,
      url: _url,
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: function success(request) {
        resolve(request.data);
        console.log("数据请求成功:", request.data)
      },
      fail: function fail(error) {
        reject(error);
        console.log("数据请求失败:", error)
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
  },
/*
  *查询患者处方列表
  */
  getRpListByPerson: function getRpListByPerson(parmas){
    return request('api/tmc/rp/getRpListByPerson', true, 'get', parmas);
  },
  /*
  *查询患者的多方对话
  */
  getPatientMultiTalk: function getPatientMultiTalk(parmas){
    return request('api/tmc/multiTalk/getPatientMultiTalk', true, 'get', parmas);
  },
   /*
  *创建问诊
  */
  createInquiry: function createInquiry(parmas){
    return request('api/tmc/inquiryRecord/createInquiry', true, 'post', parmas);
  }

}