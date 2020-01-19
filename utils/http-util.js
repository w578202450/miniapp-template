const version = 0 //0开发、1测试 2发布                                                                                                          
let API_BASE_URL = (function() {
  if (version == 0) {
    return 'http://10.0.0.210:6112/'
  } else if (version == 1) {
    return 'https://tmcpro-cs.jk.100cbc.com/'
  } else {
    return 'https://tmcpro.jk.100cbc.com/'
  }
})();

var request = function request(url, needDomain, method, data) {

  var _url = needDomain ? (API_BASE_URL + url) : url;
  console.log("------------------------");
  console.log("请求地址:" + _url);
  console.log("请求入参:" + JSON.stringify(data));
  console.log("请求方式:" + method);
  console.log("------------------------");

  return new Promise(function(resolve, reject) {

    wx.request({
      method: method,
      url: _url,
      header: {
        'content-type': 'application/json',
        'token': 'aaaa'
      },
      data: data,
      success: function success(request) {
        resolve(request.data);
        console.log("数据请求成功:", url, request.data)
        if (request.data.code != 0) {
          // wx.showToast({
          //   title: request.data.message,
          //   icon: "none"
          // })
        }
      },
      fail: function fail(error) {
        reject(error);
        console.log("数据请求失败:", url, error)
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
Promise.prototype.finally = function(callback) {
  var Promise = this.constructor;
  return this.then(function(value) {
    Promise.resolve(callback()).then(function() {
      return value;
    });
  }, function(reason) {
    Promise.resolve(callback()).then(function() {
      throw reason;
    });
  });
};

// 1.通过module.exports方式提供给外部调用
module.exports = {
  /*
   *获取测试数据
   */
  getTestData: function getTestData(api) {
    return request(api, true, 'get', {
      systemCode: "TMC",
      groupCode: "D_TMC_PATIENT_RELATION",
      parentDictCode: ""
    });
  },
  /*
   *获取微信openid
   */
  getWXAuth: function getWXAuth(parmas) {
    return request('api/peachUser/wx/getWXAuth', true, 'post', parmas);
  },
  /*
   *获取微信个人信息
   */
  getPatientInfo: function getPatientInfo(parmas) {
    return request('api/tmc/patient/getPatientInfoByUnionID', true, 'post', parmas);
  },
  /*
   *查询患者处方列表
   */
  getRpListByPerson: function getRpListByPerson(parmas) {
    return request('api/tmc/rp/getRpListByPerson', true, 'get', parmas);
  },
  /*
   *查询患者的多方对话
   */
  getPatientMultiTalk: function getPatientMultiTalk(parmas) {
    return request('api/tmc/multiTalk/getPatientMultiTalk', true, 'get', parmas);
  },
  /*
   *图文创建问诊记录
   */
  createInquiry: function createInquiry(parmas) {
    return request('api/tmc/inquiryRecord/createInquiry', true, 'post', parmas);
  },
  /*
   *获取UserSig
   */
  getUserSig: function getUserSig(parmas) {
    return request('api/rp/initial/getUserSig', true, 'get', parmas);
  },
  /*
   *获取roomId
   */
  getRoomId: function getRoomId(parmas) {
    return request('/api/rp/initial/getRoomId', true, 'get', parmas);
  },
  /*
   *云处方创建视频问诊记录
   */
  createVideoInquiry: function createVideoInquiry(parmas) {
    return request('api/rp/inquiry/create', true, 'post', parmas);
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
  savePatientDoc: function savePatientDoc(parmas) {
    return request('api/tmc/patient/savePatientDoc', true, 'post', parmas);
  },

  /*
   *获取药品订单
   */
  getOrderByPerson: function getOrderByPerson(parmas) {
    return request('api/tmc/goodsOrder/getOrderByPerson', true, 'get', parmas);
  },
  /*
   *批量获取处方详情
   */
  getRpByList: function getRpByList(parmas) {
    return request('api/tmc/rp/getRpByList', true, 'post', parmas);
  },
  /*
   *订单详情页
   */
  goodsOrder: function goodsOrder(parmas) {
    return request('api/tmc/goodsOrder/detail', true, 'get', parmas);
  },
  /*
   *根据处方id获取处方详情
   */
  getRp: function getRp(parmas) {
    return request('api/tmc/rp/get', true, 'get', parmas);
  },

  /*
   *根据员工id查询医生信息
   */
  getDoctorInfo: function getDoctorInfo(parmas) {
    return request('api/peachUser/hospitalStaff/getDoctorInfoByStaffID', true, 'get', parmas);
  },

  /*
   *获取医生资质编号
   */
  getDoctorQualification: function getDoctorQualification(parmas) {
    return request('api/peachUser/doctorCertify/getDoctorQualification', true, 'get', parmas);
  },

  /*
   *预支付
   */
  orderPrePay: function orderPrePay(parmas) {
    return request('api/tmc/goodsOrder/orderPrePay', true, 'get', parmas);
  },
  /*
   *订单校验
   */
  tradeOrder: function tradeOrder(parmas) {
    return request('api/payment/wxAppPay/tradeOrder', true, 'post', parmas);
  },

  /*
   *支付成功回调
   */
  orderPaySuccess: function orderPaySuccess(parmas) {
    return request('api/tmc/goodsOrder/orderPaySuccess', true, 'get', parmas);
  },

  /*
   *添加收货地址
   */
  addAddress: function addAddress(parmas) {
    return request('api/peachUser/personDeliveryAddr/addAddress', true, 'post', parmas);
  },

  /*
   *修改收货地址
   */
  updateAddress: function updateAddress(parmas) {
    return request('api/peachUser/personDeliveryAddr/updateAddress', true, 'post', parmas);
  },

  /*
   *设置默认
   */
  setDefault: function setDefault(parmas) {
    return request('api/peachUser/personDeliveryAddr/setDefault', true, 'post', parmas);
  },

  /*
   *个人收货地址列表
   */
  getAddress: function getAddress(parmas) {
    return request('api/peachUser/personDeliveryAddr/getAddress', true, 'get', parmas);
  },

  /*
   *删除收货地址
   */
  deleteAddress: function deleteAddress(parmas) {
    return request('api/peachUser/personDeliveryAddr/delete', true, 'post', parmas);
  },
  /*
   *设置订单配送地址
   */
  fillDeliveryAddr: function fillDeliveryAddr(parmas) {
    return request('api/tmc/goodsOrder/fillDeliveryAddr', true, 'post', parmas);
  },

  /*
   *修改订单状态
   */
  changeStatus: function changeStatus(parmas) {
    return request('api/tmc/goodsOrder/changeStatus', true, 'post', parmas);
  },
  /*
   *获取医生专治疾病
   */
  getDoctorDiseaseByDoctorID: function getDoctorDiseaseByDoctorID(parmas) {
    return request('api/peachUser/hospitalDoctor/getDoctorDiseaseByDoctorID', true, 'get', parmas);
  },











}