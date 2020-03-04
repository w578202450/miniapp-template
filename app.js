// 引入腾讯云IM
import TIM from './miniprogram_npm/tim-wx-sdk/index.js'
import COS from './miniprogram_npm/cos-wx-sdk-v5/index.js'
const AUTH = require('utils/auth')
let msgStorage = require("utils/msgstorage")
import {
  SDKAPPID
} from './utils/GenerateTestUserSig'

let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
//胶囊按钮位置信息
let systemInfo = wx.getSystemInfoSync();
let navBarHeight = (function() { //导航栏高度
  let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
  return 2 * gap + rect.height;
})();

App({
  onLaunch: function() {
    this.globalData.systemInfo = systemInfo;
    this.globalData.navBarHeight = navBarHeight;
    this.globalData.menuButtonBoundingClientRect = rect;
    // AUTH.getSetting()
    AUTH.upDataApp();
    AUTH.getNetworkType();
    AUTH.onNetworkStatusChange();
    this.imSetting();
  },

  onUnload: function() {
    tim.logout().then(function(imResponse) {}).catch(function(imError) {
      console.warn('logout error:', imError);
    });
  },

  onShow: function() {

  },

  watch: function(method, globalDataName) {
    var obj = this.globalData;
    Object.defineProperty(obj, globalDataName, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this._name = value;
        method(value); // 传递值，执行传入的方法
      },
      get: function() {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.globalDataName的时候，这里就会执行。
        return this._name
      }
    })
  },

  //右上角分享功能
  onShareAppMessage: function(res) {},

  /**
   * IM配置
   */
  imSetting() {
    // 创建 TIM SDK 实例
    let tim = TIM.create({
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
    tim.on(TIM.EVENT.SDK_READY, function(event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      console.log("============TIM SDK已处于READY状态==================");
    });

    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log("===全局收消息===" + JSON.stringify(event));
      // if (event.data && event.data[0].type == "TIMCustomElem") {
      //   let jsonData = JSON.parse(event.data[0].payload.data);
      //   if (jsonData.customType === "sys" && jsonData.childType == "video") {
      //     if (jsonData.data.type == "inquiry" && jsonData.data.inquiryId) { // 视频请求进来了
      //       console.log("视频请求进来了");
      //       let inquiryID = jsonData.data.inquiryId;
      //       let isCall = 2;
      //       wx.navigateTo({
      //         url: '/pages/online-inquiry/inquiry/video/room?isCall=' + isCall + '&inquiryID=' + inquiryID,
      //         success: function (res) { },
      //         fail: function (res) { },
      //         complete: function (res) { },
      //       });
      //       console.log("视频跳转");
      //     } else if (jsonData.data.type == "hangUp" || jsonData.data.type == "cancel") { // 视频请求取消了
      //       console.log("视频请求取消了");
      //     }
      //   }
      // }
      // 全局收消息分发
      msgStorage.saveReceiveMsg(event.data);
    });

    tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
      // 收到消息被撤回的通知
      // console.log("===收到消息被撤回===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // console.log("===会话列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // console.log("===群组列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function(event) {
      // 收到新的群系统通知
      // console.log("===收到群系统通知===" + JSON.stringify("群系统通知的类型:" + event.data.type
      //   + ",Message对象:" + event.data.message));
    });

    tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
      // 收到自己或好友的资料变更通知
      // console.log("===存储 Profile 对象的数组===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
      // 收到黑名单列表更新通知
      // console.log("===存储 userID 的数组===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.ERROR, function(event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // console.log("===错误码===" + "错误码:" + event.data.code + ",错误信息:" + event.data.message);
    });

    tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // console.log("===SDK 进入 not ready 状态通知===");
    });

    tim.on(TIM.EVENT.KICKED_OUT, function(event) {
      // 收到被踢下线通知
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      // console.log("===收到被踢下线通知===" + event.name + ",被踢下线的原因:" + event.data.type);
    });
    this.globalData.tim = tim
    this.globalData.TIM = TIM
  },

  globalData: {
    tim: null,
    TIM: null,
    isInitInfo: false,
    isHaveOptions: false, // 进入小程序是否携带参数
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
    menuButtonBoundingClientRect: {}, //右上角胶囊的信息
    systemInfo: {}, //小程序系统信息
    navBarHeight: '', //导航栏高度
    imagePlaceholder: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png"// 图片占位
  },

})