// 常量
const app = getApp();
const AUTH = require('/auth');
let HTTP = require('/http-util');
import {
  genTestUserSig
} from '/GenerateTestUserSig';
let tim = getApp().globalData.tim;
let TIM = getApp().globalData.TIM;

// 变量
let userSig = ""; // [必选]身份签名，需要从自行搭建的签名服务获取
let selctedIndex = 0; //公众号跳转带参数  0在线问诊 1个人中心
let logined = false; //是否处于登录状态
let optionsData = {}; // 传递的参数
let nextPageName = ""; // 下一页的名字

// 方法
/**
 * 授权登录 
 * 1.记录用户微信数据（个人信息 当前密钥）
 * 2.判断当前缓存是否存在unionid 存在就直接进行用户数据请求
 * 3.缓存不存在unionid 进行微信登录
 * 4.判断登录态session_key是否过期
 * 4.1session_key没过期：读取本地临时sessionKey和当前code 拿到当前的encryptedData和iv进行unionid请求
 * 4.2session_key过期：拿到当前code encryptedData iv 进行unionid请求
 */

/**
 * 准备登录：本地缓存读取 
 * 1.存在unionid 直接进行用户数据请求
 * 2.不存在unionid 进行微信登录
 */
function startLoginFun(options) {
  console.log("尝试自动登录前传递的参数" + JSON.stringify(options));
  userSig = "";
  selctedIndex = 0;
  logined = false;
  optionsData = {};
  nextPageName = "";
  if (options.isHaveData) {
    optionsData = { ...options
    };
  }
  if (options.selctedIndex == 0 || options.selctedIndex) {
    selctedIndex = options.selctedIndex;
  }
  console.log("开始IM登录");
  app.globalData.unionid = wx.getStorageSync('unionid');
  app.globalData.openid = wx.getStorageSync('openID');
  logined = app.globalData.unionid && app.globalData.openid;
  if (logined) {
    app.globalData.userInfo = wx.getStorageSync('userInfo');
    getPatientInfo(app.globalData.unionid);
  } else {
    console.log("IM登录失败：logined不存在");
    app.globalData.isInitInfo = false;
    fetchTempCode();
  }
}

/**
 * 获取基础数据
 */
function getPatientInfo(unionID) {
  wx.showLoading({
    title: '登录中...',
  });
  let prams = {
    unionID: unionID,
    nickName: app.globalData.userInfo.nickName ? app.globalData.userInfo.nickName : '',
    avatarUrl: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : '',
    sex: app.globalData.userInfo.sex ? app.globalData.userInfo.sex : '',
    city: app.globalData.userInfo.city ? app.globalData.userInfo.city : '',
    province: app.globalData.userInfo.province ? app.globalData.userInfo.province : '',
  }
  HTTP.getPatientInfo(prams).then(res => {
    if (res.code == 0) {
      app.globalData.orgName = res.data.orgName;
      app.globalData.personID = res.data.personID;
      app.globalData.patientID = res.data.keyID;
      app.globalData.orgID = res.data.orgID;
      app.globalData.personInfo = res.data;
      wx.setStorage({
        key: 'personInfo',
        data: res.data
      });
      wx.setStorage({
        key: 'orgID',
        data: res.data.orgID,
      });
      wx.setStorage({
        key: 'unionID',
        data: unionID
      });
      wx.setStorage({
        key: 'personID',
        data: res.data.personID
      });
      wx.setStorage({
        key: 'patientID',
        data: res.data.keyID
      });
      wx.setStorage({
        key: 'orgName',
        data: res.data.orgName
      });
      // 获取userSig
      getUserSig(res.data.keyID);
    } else {
      wx.hideLoading()
      wx.showToast({
        title: res.message,
        icon: 'none'
      })
    }
  }).catch(e => {
    wx.hideLoading();
    wx.showToast({
      title: '网络异常'
    })
  })
}

/**
 * 获取userSig
 */
function getUserSig(userId) {
  wx.showLoading({
    title: '登录中...',
  });
  let prams = {
    userId: userId
  };
  HTTP.getUserSig(prams).then(res => {
    if (res.code == 0) {
      userSig = res.data.userSig
      wx.setStorage({
        key: 'userSig',
        data: res.data.userSig
      });
      // console.log("获取userSig：" + userSig);
      if (userSig) {
        loginIM(userId); // IM登录
      }
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '获取userSig失败'
      });
    }
  })
}

/**
 * IM登录
 */
function loginIM(userId) {
  // IM登录
  tim.login({
    userID: userId,
    userSig: genTestUserSig(userId).userSig
  }).then(function(imResponse) {
    console.log("===IM登录成功==="); // 登录成功
    wx.setStorageSync('myUsername', userId);
    wx.hideLoading();
    app.globalData.isInitInfo = true;
    if (nextPageName == "chat") {
      wx.navigateTo({
        url: '/pages/online-inquiry/inquiry/chat/chat',
      });
    }
  }).catch(function(imError) {
    console.warn("===IM登录失败===", imError); // 登录失败的相关信息
    wx.hideLoading();
    wx.showToast({
      title: 'IM登录失败'
    })
  });
}

/**
 * unionid请求
 * 1.unionid请求成功：缓存临时session_key和unionid 并进行后台用户数据请求
 * 1.1缓存session_key：避免多次点击造成的登录态失效，出现的微信授权失败问题
 * 1.2缓存unionid：用于直接登录
 */
function getounionid(isLoginStatus) {
  AUTH.getounionid(isLoginStatus).then(function(res) {
    getPatientInfo(res);
  }, function(err) {
    console.log(err);
  })
}

/** 
 * 微信登录
 * 1.登录成功缓存当前临时code 判断登录态用 
 */
function fetchTempCode() {
  AUTH.fetchTempCode().then(function(res) {
    console.log(res);
    if (res.code) {
      wx.setStorageSync('code', res.code);
    }
  })
}

/**
 * 点击按钮进行授权
 */
function getUserInfo(e) {
  console.log("手动授权信息：" + JSON.stringify(e));
  nextPageName = "";
  if (!e.detail.encryptedData) {
    return
  };
  if (e.nextPageName) {
    nextPageName = e.nextPageName;
  }
  wx.setStorageSync('encryptedData', e.detail.encryptedData);
  wx.setStorageSync('iv', e.detail.iv);
  wx.setStorageSync('userInfo', e.detail.userInfo);
  app.globalData.userInfo = e.detail.userInfo;
  if (logined) {
    getPatientInfo(app.globalData.unionid);
  } else {
    // 检查登录态是否过期
    wx.checkSession({
      success(res) {
        getounionid(true);
      },
      fail(err) {
        getounionid(false);
      }
    })
  }
}

/**
 * 右上角的分享功能
 */
function onShareAppMessageFun() {
  let shaOrgId = wx.getStorageSync("shareOrgID");
  let shaAssId = wx.getStorageSync("shareAssistantStaffID");
  let orgID = shaOrgId ? shaOrgId : "";
  let assistantStaffID = shaAssId ? shaAssId: "";
  let orgName = wx.getStorageSync("doctorInfo").workPlace;
  return {
    title: orgName,    // 转发的标题，默认是小程序的名称(可以写slogan等)
    path: '/pages/online-inquiry/online-inquiry?orgID=' + orgID + '&assistantStaffID=' + assistantStaffID // 默认是当前页面，必须是以‘/'开头的完整路径
    // imageUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    // -------------基础库 2.0.8版本起，不在获取分享结果的回调了-----------
    // success: function (res) {},
    // fail: function (res) {}
    // -----------------------------------------------------------------
  }
}

module.exports = {
  startLoginFun: startLoginFun,
  onShareAppMessageFun: onShareAppMessageFun,
  getUserInfo: getUserInfo,
  getPatientInfo: getPatientInfo,
  getounionid: getounionid
}