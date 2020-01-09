
var API_BASE_URL = 'http://10.0.0.210:6102/';

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
        'content-type': 'application/json',
        'token':'aaaa'
      },
      data: data,
      success: function success(request) {
        resolve(request.data);
        console.log("数据请求成功:", request.data)
        if (request.data.code != 0){
          wx.showToast({
            title: request.data.message,
            icon: "none"
          })
        }
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
  *获取测试数据
  */
  getTestData: function getTestData(api){
    return request(api, true, 'get', {
      systemCode: "TMC",
      groupCode: "D_TMC_PATIENT_RELATION",
      parentDictCode: ""
    });
  },
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
  },
  /*
  *获取UserSig
  */
  getUserSig: function getUserSig(parmas) {
    return request('http://10.0.0.210:6110/api/rp/initial/getUserSig', false, 'get', parmas);
  },
  /*
  *获取roomId
  */
  getRoomId: function getRoomId(parmas) {
    return request('http://10.0.0.210:6110/api/rp/initial/getRoomId', false, 'get', parmas);
  },
  /*
   *处方详情
   */
  getRpInfo: function getRpInfo(parmas) {
    return request('api/tmc/rp/getRpInfoByInquiryID', true, 'get', parmas);
  },
  /*
   *获取患者健康信息
   */
  getPatientDoc: function getPatientDoc(parmas) {
    return request('api/tmc/patient/getPatientDoc', true, 'get', parmas);
  },
  /*
   *保存患者档案
   */
  savePatientDoc: function savePatientDoc(parmas){
    return request('api/tmc/patient/savePatientDoc', true, 'post', parmas);
  },

  /*
     *获取药品订单
     */
  getOrderByPerson: function getOrderByPerson(parmas) {
    return request('http://10.0.0.34:6214/goodsOrder/getOrderByPerson', false, 'get', parmas);
  },
  
  

}