// 引入腾讯云IM
import TIM from './miniprogram_npm/tim-wx-sdk/index.js';
import COS from './miniprogram_npm/cos-wx-sdk-v5/index.js';

const {
  Event
} = require('utils/event')
const AUTH = require('utils/auth');
let msgStorage = require("utils/msgstorage");
import {
  SDKAPPID,
  genTestUserSig
} from './utils/GenerateTestUserSig';
let HTTP = require('utils/http-util');

let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
//胶囊按钮位置信息
let systemInfo = wx.getSystemInfoSync();
let navBarHeight = (function () { //导航栏高度
  let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
  return 2 * gap + rect.height;
})();
// 变量
let userSig = ""; // [必选]身份签名，需要从自行搭建的签名服务获取
// let selctedIndex = 0; //公众号跳转带参数  0在线问诊 1个人中心
let logined = false; //是否处于登录状态
let nextPageName = ""; // 下一页的名字
let tim = null;
let that = null;


console.log(Event)
App({
  event: new Event(),
  onLaunch: function (option) {
    that = this;
    that.globalData.systemInfo = systemInfo;
    that.globalData.navBarHeight = navBarHeight;
    that.globalData.isShowPhoneDialog = false
    that.globalData.isShowCoupon = false
    this.globalData.currentPage = '首页'
    that.globalData.phoneDialogNextPage = ''
    that.globalData.isClickChat = false
    that.globalData.menuButtonBoundingClientRect = rect;
    // AUTH.getSetting()
    AUTH.upDataApp();
    AUTH.getNetworkType();
    AUTH.onNetworkStatusChange();
    // 处理来源的参数
    // wx.showModal({
    //   title: '进入小程序携带的参数',
    //   content: JSON.stringify(option),
    // });
    that.globalData.isHaveOptions = false; // 初始化进入小程序有无携带参数状态
    let options = option.query;
    // options = {
    //   orgID: "21090717240102293250511143",
    //   assistantStaffID: "21090814172199292530514240"
    // }
    wx.setStorageSync("shareOrgID", HTTP.getOrgId());
    /**
     * @Description: 扫码进入 设置渠道信息
     * @param {*} options
     * @Author: wangwangwang
     */   
    if (options.q) { // 通过扫码进入时：q的值为url带参
      that.globalData.isHaveOptions = true; // 进入小程序携带有参数
      let scan_url = decodeURIComponent(options.q);
      let s = that.initOptionsFun(scan_url, "s");
      let c = that.initOptionsFun(scan_url, "c");
      if (s) {
        that.globalData.channelData.channelStaffID = s;
        // 同时调接口获取人员名称
        const params = {
          orgID: HTTP.getOrgId(),
          channelCode: c,
          staffID: s,
        }
        that.initStaff(params);
      } else {
        that.globalData.channelData.channelStaffID = '';
        that.globalData.channelData.channelStaffName = '';
      }
      if (c) {
        that.globalData.channelData.orgChannelCode = c;
      }
    } else if (options.assistantStaffID && options.orgID) { // 通过分享的小程序进入时：直接带参
      if (options.orgID && options.orgID.length > 0) {
        that.globalData.isHaveOptions = true; // 进入小程序携带有参数
      }
      if (options.assistantStaffID && options.assistantStaffID.length > 0) {
        that.globalData.isHaveOptions = true; // 进入小程序携带有参数
        wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
      }
      if (options.p && options.p.length > 0) {
        that.globalData.p = options.p;
      }
    }
    that.imSetting(); // IM功能配置
  },


  // onUnload: function() {
  //   tim.logout().then(function(imResponse) {}).catch(function(imError) {
  //     console.warn('logout error:', imError);
  //   });
  // },

  onShow: function (option) {
    let options = option.query;
    if (options.q) { // 通过扫码进入时：q的值为url带参
      that.globalData.isHaveOptions = true; // 进入小程序携带有参数
      let scan_url = decodeURIComponent(options.q);
      let s = that.initOptionsFun(scan_url, "s");
      let c = that.initOptionsFun(scan_url, "c");
      if (s) {
        that.globalData.channelData.channelStaffID = s;
        // 同时调接口获取人员名称
        const params = {
          orgID: HTTP.getOrgId(),
          channelCode: c,
          staffID: s,
        }
        that.initStaff(params);
      } else {
        that.globalData.channelData.channelStaffID = '';
        that.globalData.channelData.channelStaffName = '';
      }
      if (c) {
        that.globalData.channelData.orgChannelCode = c;
      }
    }
    if (that.globalData.isStartLogin && that.globalData.loginNum > 0) {
      // 处理来源的参数
      // wx.showModal({
      //   title: '进入小程序携带的参数2',
      //   content: JSON.stringify(option),
      // });
      that.globalData.isHaveOptions = false; // 初始化进入小程序有无携带参数状态
      let isHaveOrgID = false;
      let isHaveAssiID = false;
      let shareOrgID = "";
      let shareAssistantStaffID = "";
      if (options.q) { // 通过扫码进入时：q的值为url带参
        that.globalData.isHaveOptions = true; // 进入小程序携带有参数
        let scan_url = decodeURIComponent(options.q);
        let s = that.initOptionsFun(scan_url, "s");
        let c = that.initOptionsFun(scan_url, "c");
        if (s) {
          that.globalData.channelData.channelStaffID = s;
          // 同时调接口获取人员名称
          const params = {
            orgID: HTTP.getOrgId(),
            channelCode: c,
            staffID: s,
          }
          that.initStaff(params);
        }
        if (c) {
          that.globalData.channelData.orgChannelCode = c;
        }
      } else if (options.assistantStaffID && options.orgID) { // 通过分享的小程序进入时：直接带参
        if (options.orgID && options.orgID.length > 0) {
          shareOrgID = options.orgID;
          isHaveOrgID = true;
        }
        if (options.assistantStaffID && options.assistantStaffID.length > 0) {
          shareAssistantStaffID = options.assistantStaffID;
          isHaveAssiID = true;
        }
        if (options.p && options.p.length > 0) {
          that.globalData.p = options.p;
        }
      }
      if (isHaveOrgID && isHaveAssiID) {
        that.globalData.isHaveOptions = true; // 进入小程序携带有参数
        if (shareOrgID != wx.getStorageSync("shareOrgID") || shareAssistantStaffID != wx.getStorageSync("shareAssistantStaffID")) {
          console.log("切换医生医助");
          wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
          wx.showLoading({
            title: '拼命加载中...',
          });
          that.startLoginFun();
        }
      }
    }
  },

  watch: function (method, globalDataName) {
    var obj = that.globalData;
    Object.defineProperty(obj, globalDataName, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        that._name = value;
        method(value); // 传递值，执行传入的方法
        // console.log("set:" + that._name);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.globalDataName的时候，这里就会执行。
        // console.log("get:" + that._name);
        return that._name
      }
    })
  },

  //右上角分享功能
  onShareAppMessage: function (res) {},

  /**
   * IM配置
   */
  imSetting() {
    // 创建 TIM SDK 实例
    tim = TIM.create({
      SDKAppID: SDKAPPID
    });
    // 设置日志级别
    // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
    // 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务
    // 注册 COS SDK 插件
    tim.registerPlugin({
      'cos-wx-sdk': COS
    });
    // 监听事件
    tim.on(TIM.EVENT.SDK_READY, function (event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      that.globalData.isInitInfo = true;
      console.log("============TIM SDK已处于READY状态==================");
    });

    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.data - 存储 Message 对象的数组 - [Message]
      // console.log("===全局收消息===" + JSON.stringify(event));
      // 全局收消息分发
      msgStorage.saveReceiveMsg(event.data);
    });

    tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
      // 收到消息被撤回的通知
      // console.log("===收到消息被撤回===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // console.log("===会话列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // console.log("===群组列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function (event) {
      // 收到新的群系统通知
      // console.log("===收到群系统通知===" + JSON.stringify("群系统通知的类型:" + event.data.type
      //   + ",Message对象:" + event.data.message));
    });

    tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
      // 收到自己或好友的资料变更通知
      // console.log("===存储 Profile 对象的数组===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
      // 收到黑名单列表更新通知
      // console.log("===存储 userID 的数组===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.ERROR, function (event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // console.log("===错误码===" + "错误码:" + event.data.code + ",错误信息:" + event.data.message);
    });

    tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // console.log("===SDK 进入 not ready 状态通知===");
    });

    tim.on(TIM.EVENT.KICKED_OUT, function (event) {
      // 收到被踢下线通知
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      // console.log("===收到被踢下线通知===" + event.name + ",被踢下线的原因:" + event.data.type);
    });
    that.globalData.tim = tim;
    that.globalData.TIM = TIM;
    wx.showLoading({
      title: '拼命加载中...',
    });
    that.startLoginFun();
  },

  hideTabBarFun: function () {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // 做了个延时重试一次，作为保底。
          wx.hideTabBar();
        }, 500)
      }
    });
  },

  /**转换传递的url参数 q */
  initOptionsFun: function (scan_url, name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = scan_url.match(reg);
    if (arr != null) {
      return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    } else {
      return "";
    }
  },

  /**开始登录 */
  startLoginFun: function () {
    tim.logout(); // 登录前先清除（可能在线）登录的账号
    userSig = "";
    logined = false;
    nextPageName = "";
    console.log("开始IM登录");
    that.globalData.unionid = wx.getStorageSync('unionid');
    that.globalData.openid = wx.getStorageSync('openID');
    logined = that.globalData.unionid && that.globalData.openid;
    if (that.globalData.unionid && that.globalData.openid) {
      that.globalData.userInfo = wx.getStorageSync('userInfo');
      that.getPatientInfo();
    } else {
      console.log("IM登录失败：unionid或openID不存在");
      that.globalData.isStartLogin = true; // 是否开始了自动登录
      that.globalData.isInitInfo = false; // 登录初始化用户数据失败
      // that.fetchTempCode();
    }
    that.globalData.loginNum = that.globalData.loginNum + 1;
  },

  /** 获取基础数据*/
  getPatientInfo: function () {
    let assistantStaffID = wx.getStorageSync("shareAssistantStaffID");
    let orgID = wx.getStorageSync("shareOrgID");
    let that = this
    let prams = {
      unionID: that.globalData.unionid,
      openID: that.globalData.openid,
      nickName: that.globalData.userInfo.nickName ? that.globalData.userInfo.nickName : '',
      avatarUrl: that.globalData.userInfo.avatarUrl ? that.globalData.userInfo.avatarUrl : '',
      sex: that.globalData.userInfo.sex ? that.globalData.userInfo.sex : '',
      city: that.globalData.userInfo.city ? that.globalData.userInfo.city : '',
      province: that.globalData.userInfo.province ? that.globalData.userInfo.province : '',
      // assistantStaffID,
      orgID,
    }
    console.log("微信登录参数--" + JSON.stringify(prams));
    HTTP.getPatientInfo(prams).then(res => {
      if (res.code == 0) {
        console.log("登录后拿到的患者对话信息：" + JSON.stringify(res.data));
        that.globalData.personID = res.data.personID;
        that.globalData.patientID = res.data.keyID;
        that.globalData.orgID = res.data.orgID;
        that.globalData.personInfo = res.data;
        wx.setStorageSync('personInfo', res.data);
        wx.setStorage({
          key: 'orgID',
          data: res.data.orgID,
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
          key: 'shareDoctorStaffID',
          data: res.data.doctorStaffID
        });
        wx.setStorage({
          key: 'shareOrgID',
          data: res.data.orgID
        });
        wx.setStorage({
          key: 'shareAssistantStaffID',
          data: res.data.assistantStaffID
        });
        HTTP.getAssistantIsShow({
          doctorStaffID: res.data.doctorStaffID,
          assistantStaffID: res.data.assistantStaffID
        }).then((res) => {
          if (res.code === 0) {
            if (res.data.isShow === 0) {
              that.globalData.isDoctor = true
            }
          }
        })

        that.getUserSig(res.data.keyID); // 获取userSig
      } else {
        that.globalData.isStartLogin = true; // 是否开始了自动登录
        wx.hideLoading();
        wx.showToast({
          title: res.message,
          icon: 'none'
        });
      }
    }).catch(e => {
      that.globalData.isStartLogin = true; // 是否开始了自动登录
      wx.hideLoading();
      wx.showToast({
        title: '网络异常'
      });
    })
  },

  /**
   * 获取userSig
   */
  getUserSig: function (userId) {
    wx.showLoading({
      title: '登录中...',
    });
    let prams = {
      userId: userId
    };
    HTTP.getUserSig(prams).then(res => {
      if (res.code == 0) {
        userSig = res.data.userSig;
        wx.setStorage({
          key: 'userSig',
          data: res.data.userSig
        });
        if (userSig) {
          that.loginIM(userId); // IM登录
        } else {
          that.globalData.isStartLogin = true; // 是否开始了自动登录
          wx.hideLoading();
          wx.showToast({
            title: '获取userSig失败'
          });
        }
      } else {
        that.globalData.isStartLogin = true; // 是否开始了自动登录
        wx.hideLoading();
        wx.showToast({
          title: '获取userSig失败'
        });
      }
    })
  },

  initStaff: function (params) {
    HTTP.getStaffInfo(params).then(res => {
      if (res.code === 0) {
        that.globalData.channelData.channelStaffName = res?.data?.staffName;
      }
    })
  },

  /** IM登录 */
  loginIM: function (userId) {
    tim.login({
      userID: userId,
      userSig: genTestUserSig(userId).userSig
    }).then(function (imResponse) {
      console.log("===IM登录成功==="); // 登录成功
      wx.setStorageSync('myUsername', userId);
      wx.hideLoading();
      that.globalData.isInitInfo = true; // 是否登录成功
      that.globalData.isStartLogin = true; // 是否开始了自动登录
    }).catch(function (imError) {
      that.globalData.isInitInfo = false
      console.log("===IM登录失败===", JSON.stringify(imError)); // 登录失败的相关信息
      wx.hideLoading();
      wx.showToast({
        title: 'IM登录失败'
      })
    });
  },
  /**
   * 微信登录
   * 1.登录成功缓存当前临时code 判断登录态用
   */
  fetchTempCode: function () {
    wx.removeStorageSync("sessionKey");
    wx.removeStorageSync("code");
    wx.removeStorageSync('openID');
    wx.removeStorageSync('unionid')
    AUTH.fetchTempCode().then(function (res) {
      wx.hideLoading();
      if (res.code) {
        wx.setStorageSync('code', res.code);
      }
    })
  },

  globalData: {
    isDoctor: false,
    tim: null,
    TIM: null,
    p: "",
    doctorType: '',
    isInitInfo: false, // false：未登录  ：true已登录
    loginNum: 0, // 登录次数
    isHaveOptions: false, // 进入小程序是否携带参数
    isStartLogin: false, // 是否尝试了自动登录
    userInfo: {},
    personInfo: {},
    doctorInfo: {},
    assistantInfo: {},
    isConnected: true,
    unionid: '', //unionidId
    patientID: '', //病人id
    openid: '',
    orgName: '',
    personID: '',
    orgID: '',
    channelData: {
      orgChannelCode: '',
      channelStaffID: '',
      channelStaffName: '',
    },
    menuButtonBoundingClientRect: {}, //右上角胶囊的信息
    systemInfo: {}, //小程序系统信息
    navBarHeight: '', //导航栏高度
    imagePlaceholder: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png", // 图片占位
    tabbar: {
      color: "#86888B",
      selectedColor: "#438BEF",
      backgroundColor: "#ffffff",
      borderStyle: "#d7d7d7",
      list: [{
          pagePath: "/pages/index/service-index/service-index",
          text: "首页",
          iconPath: "/images/tabbar/tabbar-home-normal.png",
          selectedIconPath: "/images/tabbar/tabbar-home-selected.png",
          selected: true
        },
        {
          pagePath: "/pages/inquiry-index/inquiry-index",
          text: "问诊",
          iconPath: "/images/tabbar/inqueryNew.png",
          selectedIconPath: "/images/tabbar/inqueryNew.png",
          selected: false
        },
        {
          pagePath: "/pages/personal-center/personal-center",
          text: "我的",
          iconPath: "/images/tabbar/tabbar-mine-normal.png",
          selectedIconPath: "/images/tabbar/tabbar-mine-selected.png",
          selected: false
        }
      ],
      position: "bottom"
    } // 自定义导航栏数据
  },

})