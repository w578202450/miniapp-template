// 引入腾讯云IM
import TIM from './miniprogram_npm/tim-wx-sdk/index.js'
import COS from './miniprogram_npm/cos-wx-sdk-v5/index.js'
import {
  SDKAPPID
} from './utils/GenerateTestUserSig'

App({
  onLaunch: function() {
    this.upDataApp()
    let that = this;
    let msgStorage = require("utils/msgstorage");

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

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })
        }
      }
    });
    // 监听事件，例如：
    tim.on(TIM.EVENT.SDK_READY, function(event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      console.log("============TIM SDK已处于READY状态==================");
    });

    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log("===全局收消息===" + JSON.stringify(event.data));
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
    
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
    this.globalData.tim = tim,
    this.globalData.TIM = TIM
  },
 
  onUnload: function() {
    tim.logout().then(function(imResponse) {
      console.log("===登出成功===" + imResponse.data); // 登出成功
    }).catch(function(imError) {
      console.warn('logout error:', imError);
    });
  },

  onShow: function() {
    
  },
  /**
   * 版本更新
   */
  upDataApp: function() {
    if (wx.canIUse('getUpdateManager')) { //判断当前微信版本是否支持版本更新
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) { // 请求完新版本信息的回调
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          });
          updateManager.onUpdateFailed(function() {
            wx.showModal({ // 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        } else {
        }
      })
    } else {
      wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  globalData: {
    tim: null,
    TIM: null,
    userInfo: {},
    personInfo: {},
    doctorInfo: {},
    isConnected:true,
    unionid: '',//unionidId
    patientID:'',//病人id
    encryptedData:'',//密码
    iv:'',//密码
    code:'',//临时code
    sessionKey:''
  },
  
})