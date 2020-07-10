const version = 1; //0开发、1测试 2生产
const md5 = require('/md5.js');
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
    // return "http://10.0.0.34:6112/"
  } else if (version == 1) {
    return 'https://tmcpro-cs.jk.100cbc.com/'
  } else {
    return 'https://tmcpro.jk.100cbc.com/'
  }
})();

var request = function request(url, needDomain, method, data) {

  var _url = needDomain ? (API_BASE_URL + url) : url;
  // console.log("------------------------");
  // console.log("请求地址:" + _url);
  // console.log("请求地址:" + _url + "请求入参:" + JSON.stringify(data));
  // console.log("请求方式:" + method);
  // console.log("------------------------");

  return new Promise(function(resolve, reject) {
    let date = Date.parse(new Date());
    let clientType = "wxpro";
    let dataValues = md5.objKeySort(data);
    let signed = md5.md5(encodeURIComponent(dataValues + clientType + date + "ka5qEcegfYS3r4dH"));
    wx.request({
      method: method,
      url: _url,
      header: {
        'content-type': 'application/json',
        'token': 'aaaa',
        'clientType': clientType,
        'timestamp': date,
        'sign': signed
      },
      data: data,
      success: function success(request) {
        resolve(request.data);
        if (request.statusCode == 200) {
          // console.log("数据请求成功:", url, request.data);
        } else {
          // console.log("数据请求失败:", url, request);
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

  /**上传文件的路径（图片） */
  uploadFileUrl: function uploadFileUrl() {
    if (version == 0) {
      return 'http://10.0.0.210:6104/api/sys/file'
    } else if (version == 1) {
      return 'https://file-cs.jk.100cbc.com/api/sys/file'
    } else if (version == 2) {
      return 'https://file.jk.100cbc.com/api/sys/file'
    }
  },

  /**侯氏医院ID */
  houShiOrgIDFun: function() {
    if (version == 0) {
      return ['19101017081245518100511003']
    } else if (version == 1) {
      return ['19121923373037086560511253']
    } else if (version == 2) {
      return ['20012118570385423810511240', '20031709473895879610511240']
    }
  },

  /**哈尔滨友好医院ID */
  harbinyouhaoOrgIDFun: function() {
    if (version == 0) {
      return ['20050916495074555320511240']
    } else if (version == 1) {
      return ['20050916495074555320511240']
    } else if (version == 2) {
      return ['20050916495074555320511240']
    }
  },

  /**大冢医药机构ID */
  dazhongOrgIDFun: function() {
    if (version == 0) {
      return ['20040910375869839140511253']
    } else if (version == 1) {
      return ['20040910375869839140511253']
    } else if (version == 2) {
      return ['20040909515893667880511240']
    }
  },

  /**桃子互联网医院减肥中心机构ID */
  loseweightOrgIDFun: function() {
    if (version == 0) {
      return ['20041517422841582280511240']
    } else if (version == 1) {
      return ['20041517422841582280511240']
    } else if (version == 2) {
      return ['20041517422841582280511240']
    }
  },

  /**桃子互联网医院妇科诊疗中心机构ID */
  gynecologyOrgIDFun: function() {
    if (version == 0) {
      return ['20040111371269634190511240']
    } else if (version == 1) {
      return ['20040111371269634190511240']
    } else if (version == 2) {
      return ['20040111371269634190511240']
    }
  },

  /**桃子互联网医院男科诊疗中心机构ID */
  andrologyOrgIDFun: function() {
    if (version == 0) {
      return ['20040212494191470440511240']
    } else if (version == 1) {
      return ['20040212494191470440511240']
    } else if (version == 2) {
      return ['20040212494191470440511240']
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
   *心跳
   */
  heart: function heart(params) {
    return request('api/tmc/patientTrace/heart', true, 'post', params);
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
  // 订单结果查询
  queryOrderByTransID: function addGroupMember(parmas) {
    return request('api/payment/transPayment/queryOrderByTransID', true, 'post', parmas);
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

  /**
   * 确认收货
   */
  sureSuccessDelivery: function sureSuccessDelivery(params) {
    return request('api/tmc/goodsOrder/updateDeliveryStatus', true, 'post', params);
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
    /*
   *手机号
   */
  decryptionPhone: function heart(params) {
    return request('api/peachUser/personUser/getPersonPhone', true, 'post', params);
  },
  /*
   *自动合并
   */
  autoMerge: function heart(params) {
    return request('api/tmc/merge/autoMerge', true, 'post', params);
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
   * 获取医生手记详情
   */
  inquiryCaseDetail: function inquiryCaseDetail(params) {
    return request('api/tmc/inquiryCase/detail', true, 'get', params);
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
    return request('api/tmc/classify/getToolClassifyById', true, 'get', params);
  },
  /**
   * 分类获取文章列表
   */
  articleByClassifyId: function articleByClassifyId(params) {
    return request('api/tmc/article/list', true, 'get', params);
  },
  /**
   * 首页
   */
  /**
   * 获取首页banner和医师团队介绍
   */
  getBannerTeamIntroduce: function getBannerTeamIntroduce(params) {
    return request('api/hospitalUser/orgPara/queryOrgPara', true, 'get', params);
    // return request('http://10.0.0.99:6216/orgPara/queryOrgPara', false, 'get', params);
  },

  /**
   * 获取用户浏览数和分享数
   */
  getBrowseShareCount: function getBrowseShareCount(params) {
    return request('api/hospitalUser/orgVar/queryOrgVar', true, 'get', params);
    // return request('http://10.0.0.99:6216/orgVar/queryOrgVar', false, 'get', params);
  },

  /**
   * 获取医师团队列表
   */
  getPhysicianTeamList: function getPhysicianTeamList(params) {
    return request('api/tmc/doctorShow/list', true, 'get', params);
    // return request('http://10.0.0.210:6215/doctorShow/list', false, 'get', params);
  },


  /**
   * 通过医助查询到的签约医生
   */
  getSignedDoctor: function getSignedDoctor(params) {
    return request('api/tmc/doctorShow/getDoctorShowByAssistantStaffID', true, 'get', params);
    // return request('http://10.0.0.210:6112/api/tmc/doctorShow/getDoctorShowByAssistantStaffID', false, 'get', params);
  },

  /**
   * 查询医院详情信息
   */
  getHospitalInfo: function getHospitalInfo(params) {
    return request('api/peachUser/hospitalMng/getHospital', true, 'get', params);
  },

  /**
   * 获取科室信息
   */
  getSectionByKeyID: function getSectionByKeyID(params) {
    return request('api/peachUser/hospitalSection/getSectionByKeyID', true, 'get', params);
  },

  /**
   * 自动进群失败，主动拉入群
   */
  addGroupMember: function addGroupMember(parmas) {
    return request('api/tmc/multiTalk/addGroupMember', true, 'post', parmas);
  },
  /**
   * 查询文章详情的文章评论
   */
  listComment: function listComment(parmas) {
    return request('api/tmc/articleComment/listComment', true, 'get', parmas);
  },

  /**
   * 发布评论
   */
  articleCommentPublish: function articleCommentPublish(parmas) {
    return request('api/tmc/articleComment/publish', true, 'post', parmas);
  },

  /**
   * 根据talkID查询历史问诊ID
   * */
  getInquiryIDByTalk: function addGroupMember(parmas) {
    return request('api/tmc/history/getInquiryIDByTalk', true, 'get', parmas);
  },

  /**
   * 根据问诊ID获取聊天记录
   * */
  findHistoryMsgByInquiryID: function addGroupMember(parmas) {
    return request('api/tmc/history/findHistoryMsgByInquiryID', true, 'get', parmas);
  },
  /**
   * 根据文章详情
   * */
  getArticleByKeyID: function getArticleByKeyID(parmas) {
    return request('api/tmc/article/getArticleByKeyID', true, 'get', parmas);
  },
  //---------------------评论统计点赞系统
  /**
   * 统计计数接统一口
   */
  statisticsIncrease: function statisticsIncrease(parmas) {
    return request('api/comment/statistics/increase', true, 'post', parmas);
  },
  /**
   * 操作点赞统一接口
   */
  queryStatus: function queryStatus(parmas) {
    return request('api/comment/operateUser/clickStatus', true, 'get', parmas);
  },
  /**
   * 查询统计数据统一接口
   */
  queryStatistics: function queryStatistics(parmas) {
    return request('api/comment/statistics/get', true, 'get', parmas);
  },
  /**
   * 查询统计数据列表统一接口
   */
  queryStatisticsList: function queryStatistics(parmas) {
    return request('api/comment/statistics/getByList', true, 'post', parmas);
  },
  /**
   * 查询评论列表统一接口
   */
  queryCommentList: function queryCommentList(parmas) {
    return request('api/comment/comment/listByID', true, 'get', parmas);
  },
  /**
   * 发布评论统一接口
   */
  publishComment: function publishComment(parmas) {
    return request('api/comment/comment/publish', true, 'post', parmas);
  },
  /**用户是否还再小程序中 */
  isInWXSystem: function isInWXSystem(parmas) {
    return request('api/tmc/wxservice/testTao', true, 'get', parmas);
  },
  /**用户进入问诊了，告诉系统给他发个欢迎语 */
  sendCustomMsgPost: function sendCustomMsgPost(parmas) {
    return request('api/tmc/msg/sendCustomMsg', true, 'post', parmas);
  },
  /**查询医生医助信息*/
  getDoctorInfoByStaffIDs: function getDoctorInfoByStaffIDs(parmas) {
    return request('api/peachUser/hospitalStaff/getDoctorInfoByStaffIDs', true, 'post', parmas);
  },
  /** 查询我的优惠券列表 */
  queryPatientCouponList: function queryPatientCouponList(params){
    return request('api/tmc/coupon/queryPatientCouponList',true,'get',params)
  },
  /** 发放优惠券 */
  sendCoupon: function sendCoupon(params){
    return request('api/tmc/coupon/sendCoupon',true,'get',params)
  }
}
