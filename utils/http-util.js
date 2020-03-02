const version = 0; //0开发、1测试 2发布  
// const _SDKAPPID = (function() {
//   if (version == 1) { // 1测试(测试SDKAPPID为1400200900)
//     return "1400200900"
//   } else { // 0开发，2发布(开发和发布SDKAPPID为1400283798)
//     return "1400283798"
//   }
// })();
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
        console.log("数据请求成功:", url, request.data);
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

  /**上传文件的路径（图片） */
  uploadFileUrl: function uploadFileUrl() {
    if (version == 0) {
      return 'https://file-cs.jk.100cbc.com/api/sys/file'
      // return 'http://10.0.0.210:6104/api/sys/file'
    } else if (version == 1) {
      return 'https://file-cs.jk.100cbc.com/api/sys/file'
    } else if (version == 2) {
      return 'https://file.jk.100cbc.com/api/sys/file'
    }
  },

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
  getWXAuth: function getWXAuth(params) {
    return request('api/peachUser/wx/getWXAuth', true, 'post', params);
  },
  /*
   *获取微信个人信息
   */
  getPatientInfo: function getPatientInfo(params) {
    return request('api/tmc/patient/getPatientInfoByUnionID', true, 'post', params);
  },
  /*
   *查询患者处方列表
   */
  getRpListByPerson: function getRpListByPerson(params) {
    return request('api/tmc/rp/getRpListByPerson', true, 'get', params);
  },
  /*
   *查询患者的多方对话
   */
  getPatientMultiTalk: function getPatientMultiTalk(params) {
    return request('api/tmc/multiTalk/getPatientMultiTalk', true, 'get', params);
  },
  /*
   *图文创建问诊记录
   */
  createInquiry: function createInquiry(params) {
    return request('api/tmc/inquiryRecord/createInquiry', true, 'post', params);
  },
  /*
   *获取UserSig
   */
  getUserSig: function getUserSig(params) {
    return request('api/rp/initial/getUserSig', true, 'get', params);
  },
  /*
   *获取roomId
   */
  getRoomId: function getRoomId(params) {
    return request('/api/rp/initial/getRoomId', true, 'get', params);
  },
  /*
   *云处方创建视频问诊记录
   */
  createVideoInquiry: function createVideoInquiry(params) {
    return request('api/rp/inquiry/create', true, 'post', params);
  },
  /*
   *处方详情
   */
  getRpInfo: function getRpInfo(params) {
    return request('api/tmc/rp/getRpInfoByInquiryID', true, 'get', params);
  },
  /*
   *获取患者健康信息
   */
  getPatientDoc: function getPatientDoc(params) {
    return request('api/tmc/patient/getPatientDoc', true, 'get', params);
  },
  /*
   *保存患者档案
   */
  savePatientDoc: function savePatientDoc(params) {
    return request('api/tmc/patient/savePatientDoc', true, 'post', params);
  },

  /*
   *获取药品订单
   */
  getOrderByPerson: function getOrderByPerson(params) {
    return request('api/tmc/goodsOrder/getOrderByPerson', true, 'get', params);
  },

  /*
   *批量获取处方详情
   */
  getRpByList: function getRpByList(params) {
    return request('api/tmc/rp/getRpByList', true, 'post', params);
  },

  /*
   *订单详情页
   */
  goodsOrder: function goodsOrder(params) {
    return request('api/tmc/goodsOrder/detail', true, 'get', params);
  },

  /*
   *根据处方id获取处方详情
   */
  getRp: function getRp(params) {
    return request('api/tmc/rp/get', true, 'get', params);
  },

  /**
   * 无登录缓存信息时，查询默认推荐的医生信息
   */
  getDefaultDocInfo: function getDefaultDocInfo(params) {
    return request('api/tmc/patient/getDefaultPatientInfo', true, 'get', params);
  },

  /*
   *根据员工id查询医生信息
   */
  getDoctorInfo: function getDoctorInfo(params) {
    return request('api/peachUser/hospitalStaff/getDoctorInfoByStaffID', true, 'get', params);
  },

  /*
   *获取医生资质编号
   */
  getDoctorQualification: function getDoctorQualification(params) {
    return request('api/peachUser/doctorCertify/getDoctorQualification', true, 'get', params);
  },

  /*
   *预支付
   */
  orderPrePay: function orderPrePay(params) {
    return request('api/tmc/goodsOrder/orderPrePay', true, 'get', params);
  },

  /*
   *校验预创单
   */
  checkOrderPrePay: function checkOrderPrePay(params) {
    return request('api/payment/transPayment/checkOrderPrePay', true, 'get', params);
  },
  /*
   *订单校验
   */
  tradeOrder: function tradeOrder(params) {
    return request('api/payment/wxAppPay/tradeOrder', true, 'post', params);
  },

  /*
   *支付成功回调
   */
  orderPaySuccess: function orderPaySuccess(params) {
    return request('api/tmc/goodsOrder/orderPaySuccess', true, 'get', params);
  },

  /*
   *添加收货地址
   */
  addAddress: function addAddress(params) {
    return request('api/peachUser/personDeliveryAddr/addAddress', true, 'post', params);
  },

  /*
   *修改收货地址
   */
  updateAddress: function updateAddress(params) {
    return request('api/peachUser/personDeliveryAddr/updateAddress', true, 'post', params);
  },

  /*
   *设置默认
   */
  setDefault: function setDefault(params) {
    return request('api/peachUser/personDeliveryAddr/setDefault', true, 'post', params);
  },

  /*
   *个人收货地址列表
   */
  getAddress: function getAddress(params) {
    return request('api/peachUser/personDeliveryAddr/getAddress', true, 'get', params);
  },

  /*
   *删除收货地址
   */
  deleteAddress: function deleteAddress(params) {
    return request('api/peachUser/personDeliveryAddr/delete', true, 'post', params);
  },
  /*
   *设置订单配送地址
   */
  fillDeliveryAddr: function fillDeliveryAddr(params) {
    return request('api/tmc/goodsOrder/fillDeliveryAddr', true, 'post', params);
  },

  /*
   *修改订单状态
   */
  changeStatus: function changeStatus(params) {
    return request('api/tmc/goodsOrder/changeStatus', true, 'post', params);
  },
  /*
   *获取医生专治疾病
   */
  getDoctorDiseaseByDoctorID: function getDoctorDiseaseByDoctorID(params) {
    return request('api/peachUser/hospitalDoctor/getDoctorDiseaseByDoctorID', true, 'get', params);
  },
  /*
   *问诊id查处方详情
   */
  getRpInfoByInquiryID: function getRpInfoByInquiryID(params) {
    return request('api/tmc/rp/getRpInfoByInquiryID', true, 'get', params);
  },

  /**
   * 获取SDKAPPID
   */
  genSDKappid: function genSDKappid() {
    var SDKAPPID = _SDKAPPID;
    return {
      sdkappid: SDKAPPID
    };
  },

  /**
   * 修改医生响应状态(视频拒绝、取消时)
   */
  updateDocInquiryType: function updateDocInquiryType(params) {
    return request('api/rp/inquiry/updateInquiryType', true, 'post', params);
  },

  /**
   * 修改响应时间(接听视频时)
   */
  changeDocResponseInquiry: function changeDocResponseInquiry(params) {
    return request('api/rp/inquiry/responseInquiry', true, 'post', params);
  },

  /**
   * 结束问诊（挂断视频）
   */
  endVideoInquiry: function endVideoInquiry(params) {
    return request('api/rp/inquiry/end', true, 'post', params);
  },

  /**展示医生列表
   */
  doctorShowList: function doctorShowList(params) {
    return request('api/tmc/doctorShow/list', true, 'get', params);
  },

  /**
   * 获取患者评价
   */
  orderCommentGet: function orderCommentGet(params) {
    return request('api/tmc/orderComment/get', true, 'get', params);
  },

  /**
   * 获取患者评价列表
   */
  orderCommentList: function orderCommentList(params) {
    return request('api/tmc/orderComment/list', true, 'get', params);
  },

  /**
   * 保存评价
   */
  orderCommentSave: function orderCommentSave(params) {
    return request('api/tmc/orderComment/save', true, 'post', params);
  },

  /**
   * 医生手记
   */
  /**
   * 获取医生手记
   */
  inquiryCaseGet: function inquiryCaseGet(params) {
    return request('api/tmc/inquiryCase/get', true, 'get', params);
  },

  /**
   * 获取医生手记列表
   */
  inquiryCaseList: function inquiryCaseList(params) {
    return request('api/tmc/inquiryCase/list', true, 'get', params);
  },

  /**
   * 文章
   */
  /**
   * 文章列表查询 
   * */
  articleList: function articleList(params) {
    return request('api/hospital/article/list', true, 'get', params);
  },

  /**
   * 患者分享查询
   */
  patientShareGet: function patientShareGet(params) {
    return request('api/tmc/patientShare/get', true, 'get', params);
  },

  /**
   * 患者分享列表查询
   */
  patientShareList: function patientShareList(params) {
    return request('api/tmc/patientShare/list', true, 'get', params);
  },

  /**
   * 文章模块分类
   */
  getToolClassifyById: function getToolClassify(params) {
    return request('http://10.0.0.99:6112/api/tmc/classify/getToolClassifyById', false, 'get', params);
  },

  /**
   * 首页
   */
  /**
   * 获取首页banner和医师团队介绍
   */
  getBannerTeamIntroduce: function getBannerTeamIntroduce(params) {
    return request('api/peachUser/orgPara/queryOrgPara', true, 'get', params);
  },

  /**
   * 获取用户浏览数和分享数
   */
  getBrowseShareCount: function getReadShareCount(params) {
    return request('/api/peachUser/orgVar/queryOrgVar', true, 'get', params);
  },

  /**
   * 获取医师团队列表
   */
  physicianTeamList: function physicianTeamList(params) {
    return request('api/tmc/doctorShow/list', true, 'get', params);
  }

}