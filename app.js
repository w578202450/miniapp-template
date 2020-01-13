// 引入腾讯云IM
import TIM from './miniprogram_npm/tim-wx-sdk/index.js'
import COS from './miniprogram_npm/cos-wx-sdk-v5/index.js'
import {
  SDKAPPID
} from './utils/GenerateTestUserSig'
// import {
//   genTestUserSig
// } from './utils/GenerateTestUserSig';
// const AUTH = require('utils/auth')
const HTTP = require('utils/http-util')
const UTIL = require('utils/util')

// 创建 TIM SDK 实例
const tim = TIM.create({
  SDKAppID: SDKAPPID
})

// 设置日志级别
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务
// 注册 COS SDK 插件
tim.registerPlugin({
  'cos-wx-sdk': COS
})

App({
  onLaunch: function () {
    // AUTH.wxlogin();

    // wx.getSetting({
    //   success: res => {
    //     console.log('-------授权成功')
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   },
    //   fail:res =>{
    //     console.log('-------授权失败')
    //   }
    // })

    let that = this;
    // 监听事件，例如：
    tim.on(TIM.EVENT.SDK_READY, function (event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
      // console.log(`============${event.name}==================`);
    });

    tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
      // 收到消息被撤回的通知
      // event.name - TIM.EVENT.MESSAGE_REVOKED
      // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
      // console.log(`============${event.name}==================`);
      // console.log("===收到消息被撤回===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
      // console.log(`============${event.name}==================`);
      // console.log("===会话列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
      // console.log(`============${event.name}==================`);
      // console.log("===群组列表===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, function (event) {
      // 收到新的群系统通知
      // event.name - TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED
      // event.data.type - 群系统通知的类型，详情请参见 GroupSystemNoticePayload 的 operationType 枚举值说明
      // event.data.message - Message 对象，可将 event.data.message.content 渲染到到页面
      // console.log(`============${event.name}==================`);
      // console.log("===收到群系统通知===" + JSON.stringify(event.data));
    });

    tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
      // 收到自己或好友的资料变更通知
      // event.name - TIM.EVENT.PROFILE_UPDATED
      // event.data - 存储 Profile 对象的数组 - [Profile]
    });

    tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
      // 收到黑名单列表更新通知
      // event.name - TIM.EVENT.BLACKLIST_UPDATED
      // event.data - 存储 userID 的数组 - [userID]
    });

    tim.on(TIM.EVENT.ERROR, function (event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
      // console.log(`============${event.name}==================`);
      // console.log("===错误码===" + event.data.code + "===错误信息===" + event.data.message);
    });

    tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
      // console.log(`============${event.name}==================`);
    });

    tim.on(TIM.EVENT.KICKED_OUT, function (event) {
      // 收到被踢下线通知1
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      // console.log("===收到被踢下线通知===" + event.name + "===被踢下线的原因===" + event.data.type);
    });

    // IM登录
    // let userInfo = wx.getStorageSync("personInfo");
    // tim.login({
    //   userID: userInfo.keyID,
    //   userSig: genTestUserSig(userInfo.keyID).userSig
    //   // userID: "20010620211271745513006001",
    //   // userSig: genTestUserSig("20010620211271745513006001").userSig
    // }).then(function (imResponse) {
    //   console.log("===IM登录成功===" + JSON.stringify(imResponse.data)); // 登录成功
    // }).catch(function (imError) {
    //   console.warn("===登录失败===", imError); // 登录失败的相关信息
    // });
  },
  onUnload: function () {
    app.tim.logout().then(function (imResponse) {
      console.log("===登出成功===" + imResponse.data); // 登出成功
    }).catch(function (imError) {
      console.warn('logout error:', imError);
    });
  },
  globalData: {
    userInfo: null,
    personInfo: {},
    baseUrl: 'http://10.0.0.210:6112/'
  },
  tim: tim,
  TIM: TIM
})