const app = getApp();
import {
  SDKAPPID
} from '../../../../utils/GenerateTestUserSig'

import {
  genTestUserSig
} from '../../../../utils/GenerateTestUserSig';
var HTTP = require('../../../../utils/http-util');
var msgStorage = require("../../../../utils/msgstorage");
var tim = app.globalData.tim;
var TIM = app.globalData.TIM;

Page({
  // /**
  //  * 页面的初始数据
  //  */
  // data: {
  //   template: 'float',
  //   webrtcroomComponent: null,
  //   roomID: '123', // 房间id
  //   beauty: 0,
  //   muted: false,
  //   debug: false,
  //   frontCamera: true,
  //   role: ROLE_TYPE.PRESENTER, // presenter 代表主播，audience 代表观众
  //   userId: '20010620211271745513006001',
  //   userSig: genTestUserSig("20010620211271745513006001").userSig,
  //   sdkAppID: SDKAPPID,
  //   isErrorModalShow: false,
  //   autoplay: true,
  //   enableCamera: true,
  //   smallViewLeft: 'calc(100vw - 30vw - 2vw)',
  //   smallViewTop: '20vw',
  //   smallViewWidth: '30vw',
  //   smallViewHeight: '40vw',
  // },


  // /**
  //  * 监听webrtc事件
  //  */
  // onRoomEvent(e) {
  //   var self = this;
  //   switch (e.detail.tag) {
  //     case 'error':
  //       if (this.data.isErrorModalShow) { // 错误提示窗口是否已经显示
  //         return;
  //       }
  //       this.data.isErrorModalShow = true;
  //       wx.showModal({
  //         title: '提示',
  //         content: e.detail.detail,
  //         showCancel: false,
  //         complete: function () {
  //           self.data.isErrorModalShow = false;
  //           self.goBack();
  //         }
  //       });
  //       break;
  //   }
  // },

  // /**
  //  * 切换摄像头
  //  */
  // changeCamera: function () {
  //   this.data.webrtcroomComponent.switchCamera();
  //   this.setData({
  //     frontCamera: !this.data.frontCamera
  //   })
  // },

  // /**
  //  * 开启/关闭摄像头
  //  */
  // onEnableCameraClick: function () {
  //   this.data.enableCamera = !this.data.enableCamera;
  //   this.setData({
  //     enableCamera: this.data.enableCamera
  //   });
  // },


  // /**
  //  * 设置美颜
  //  */
  // setBeauty: function () {
  //   this.data.beauty = (this.data.beauty == 0 ? 9 : 0);
  //   this.setData({
  //     beauty: this.data.beauty
  //   });
  // },

  // /**
  //  * 切换是否静音
  //  */
  // changeMute: function () {
  //   this.data.muted = !this.data.muted;
  //   this.setData({
  //     muted: this.data.muted
  //   });
  // },

  // /**
  //  * 是否显示日志
  //  */
  // showLog: function () {
  //   this.data.debug = !this.data.debug;
  //   this.setData({
  //     debug: this.data.debug
  //   });
  // },

  // /**
  //  * 进入房间
  //  */
  // joinRoom: function () {
  //   // 设置webrtc-room标签中所需参数，并启动webrtc-room标签
  //   this.setData({
  //     userID: this.data.userId,
  //     userSig: this.data.userSig,
  //     sdkAppID: this.data.sdkAppID,
  //     roomID: this.data.roomID
  //   }, () => {
  //     this.data.webrtcroomComponent.start();
  //   })
  // },

  // /**
  //  * 返回上一页
  //  */
  // goBack() {
  //   // var pages = getCurrentPages();
  //   // if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/video_call_footage/room/room')) {
  //   //   wx.navigateBack({
  //   //     delta: 1
  //   //   });
  //   // }
  // },


  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {
  //   this.data.roomID = options.roomID || '';
  //   this.data.userId = options.userId;
  //   this.data.userSig = options.userSig;
  //   this.data.template = options.template;
  //   this.data.sdkAppID = options.sdkAppID;

  //   this.data.webrtcroomComponent = this.selectComponent('#webrtcroom');

  //   this.setData({
  //     template: options.template
  //   });

  //   this.joinRoom();

  //   // 动态设置当前页面的标题 房间号+userid
  //   wx.setNavigationBarTitle({
  //     title: this.data.roomID + '-' + this.data.userId
  //   })
  // },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {
  //   var self = this;
  //   console.log('room.js onShow');
  //   // 保持屏幕常亮
  //   wx.setKeepScreenOn({
  //     keepScreenOn: true
  //   })
  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {
  //   console.log('room.js onHide');
  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {
  //   console.log('room.js onUnload');
  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },


  // onBack: function () {
  //   wx.navigateBack({
  //     delta: 1
  //   });
  // },
  data: {
    //...
    userInfo: {}, // 当前用户信息
    roomID: '123', // [必选]房间号，可以由您的服务指定
    userID: '', // [必选]用户 ID，可以由您的服务指定，或者使用小程序的 openid
    userSig: '', // [必选]身份签名，需要从自行搭建的签名服务获取
    inquiryInfo: {}, // 问诊信息
    sdkAppID: '1400200900', // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
    template: 'float', // [必选]标识组件使用的界面模版，组件内置了 bigsmall，float，grid 三种布局
    privateMapKey: '', // 房间权限 key，需要从自行搭建的签名服务获取
    // 如果您没有在【控制台】>【实时音视频】>【您的应用名称】>【帐号信息】中启用权限密钥，可不用填
    beauty: 3, // 美颜指数，取值 0 - 9，数值越大效果越明显
    muted: false, // true 静音 false 不静音
    debug: true, // true 打印推流 debug 信息 fales 不打印推流 debug 信息
    enableIM: false, // 是否启用IM
    // 其他配置参数可查看 API 文档
    inquiryId: '', // 问诊记录id
    customMsgType: '', // 自定义消息类型(根据payload{childType}确定)
    username: {
      type: Object,
      value: {},
    },
  },

  // 通过 onIMEvent 返回 IM 消息事件，如果 enableIM 已关闭，则可以忽略 onIMEvent
  onIMEvent: function(e) {
    switch (e.detail.tag) {
      case 'big_group_msg_notify':
        //收到群组消息
        console.debug(e.detail.detail)
        console.log("收到群组消息:" + e.detail.detail)
        break;
      case 'login_event':
        //登录事件通知
        console.debug(e.detail.detail)
        break;
      case 'connection_event':
        //连接状态事件
        console.debug(e.detail.detail)
        break;
      case 'join_group_event':
        //进群事件通知
        console.debug(e.detail.detail)
        break;
    }
  },

  // 标签通过 onRoomEvent 返回内部事件
  onRoomEvent: function(e) {
    switch (e.detail.tag) {
      case 'error':
        {
          //发生错误
          var code = e.detail.code;
          var detail = e.detail.detail;
          break;
        }
    }
  },

  // 云处方创建视频问诊记录
  createVideoInquiry: function() {
    let that = this;
    let prams = {
      bizID: 'tmc',
      bizType: 'tmc',
      clientID: '19100717375019793291301001',
      sponsorsID: that.data.userInfo.keyID,
      sponsorsName: that.data.userInfo.patientName,
      receiverID: that.data.inquiryInfo.keyID,
      receiverName: that.data.inquiryInfo.keyID,
      patientName: that.data.userInfo.patientName,
      requestRole: "0",
      patientInfo: {
        patientName: that.data.userInfo.patientName,
        patientSex: that.data.userInfo.sex,
        patientAge: 0,
        patientPhone: that.data.userInfo.phone,
        patientIdNo: that.data.userInfo.idNumber
      }
    };
    console.log("视频问诊:sponsorsID:" + that.data.userInfo.keyID +
      ",sponsorsName:" + that.data.userInfo.patientName +
      ",receiverID:" + that.data.inquiryInfo.keyID +
      ",receiverName:" + that.data.inquiryInfo.keyID +
      ",patientName:" + that.data.userInfo.patientName +
      ",patientSex:" + that.data.userInfo.sex +
      ",patientPhone:" + that.data.userInfo.phone +
      ",patientIdNo:" + that.data.userInfo.idNumber
    );
    HTTP.createVideoInquiry(prams).then(res => {
      console.log("云处方创建视频问诊记录:" + res.data.inquiryId);
      that.setData({
        inquiryId: res.data.inquiryId
      });
      // 发送自定义消息
      that.sendCustomMsg();
    })
  },

  // 获取roomId
  // getRoomId: function() {
  //   let that = this;
  //   let prams = {
  //     inquiryId: that.data.inquiryId, // 问诊记录id	
  //     sponsorsId: that.data.userInfo.keyID, // 发起者id(患者id)
  //     receiverId: that.data.inquiryInfo.keyID // 接受者id(医生id)
  //   };
  //   console.log("获取roomId参数:inquiryId:" + that.data.inquiryId
  //     + ",sponsorsId:" + that.data.userInfo.keyID
  //     + ",receiverID:" + that.data.inquiryInfo.keyID
  //   );
  //   HTTP.getRoomId(prams).then(res => {
  //     console.log("获取roomId:" + res.data.roomID);
  //     that.setData({
  //       roomID: res.data.roomID
  //     });
  //   })
  // },

  /*从storage中获取患者信息 */
  getPersonInfo: function() {
    let that = this;
    // let userInfo = wx.getStorageSync("personInfo");
    wx.getStorage({
      key: "personInfo",
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
        that.getUserSig();
        console.log("===患者信息===" + JSON.stringify(that.data.userInfo));
        that.getInquiryInfo();
      }
    })
  },

  /**
   * 获取UserSig
   */
  getUserSig: function() {
    let that = this;
    let userSig = wx.getStorageSync("userSig");
    that.setData({
      userSig: userSig
    });
    console.log("===userSig===" + userSig);
    // wx.getStorage({
    //   key: 'userSig',
    //   success: function(res) {
    //     that.setData({
    //       userSig: res.data.userSig
    //     });
    //     console.log("===userSig===" + JSON.stringify(res.data.userSig));
    //   },
    // })
  },

  /**
   * 获取群聊问诊信息
   */
  getInquiryInfo: function() {
    let that = this;
    let inquiryInfo = wx.getStorageSync("inquiryInfo");
    that.setData({
      inquiryInfo: inquiryInfo
    });
    console.log("===获取群聊问诊信息===" + JSON.stringify(inquiryInfo));
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('room.js onShow');
    let that = this;
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    let username = this.data.username;
    let myUsername = wx.getStorageSync("myUsername");
    console.log("username:" + JSON.stringify(username));
    // let sessionKey = username.groupId ?
    //   username.groupId + myUsername :
    //   username.your + myUsername;
    // let chatMsg = wx.getStorageSync(sessionKey) || [];
    // console.log("chatMsg:" + chatMsg);
    msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey) {
        console.log("分发到视频界面消息:" + JSON.stringify(renderableMsg));
        // TODO
        // customType
      let customType = renderableMsg.payload.data.customType;
        // childType
      let childType = renderableMsg.payload.data.childType;
        // data
      let data = renderableMsg.payload.data.data;
      console.log("payload{data}:" + JSON.stringify(data));
        // 问诊ID
        // let inquiryId = event.data.payload.data.data.inquiryId;
        // console.log("payload{data.inquiryId}:" + inquiryId);
        // 房间号
      let roomid = renderableMsg.payload.data.data.roomId;
        console.log("===roomID===" + roomid);
        // 视频问诊的消息类型处理
        if (childType == "video") {
          that.setData({
            roomID: roomid,
            customMsgType: childType
          })
        }
    });
  // // 收消息
  // tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
  //   // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
  //   // event.name - TIM.EVENT.MESSAGE_RECEIVED
  //   // event.data - 存储 Message 对象的数组 - [Message]
  //   console.log("===视频问诊接收消息===" + JSON.stringify(event.data));
  //   if (event.data.type == "TIMCustomElem") { // 自定义消息
  //     // customType
  //     let customType = event.data.payload.data.customType;
  //     // childType
  //     let childType = event.data.payload.data.childType;
  //     // data
  //     let data = event.data.payload.data.data;
  //     console.log("payload{data}:" + JSON.stringify(data));
  //     // 问诊ID
  //     // let inquiryId = event.data.payload.data.data.inquiryId;
  //     // console.log("payload{data.inquiryId}:" + inquiryId);
  //     // 房间号
  //     let roomid = event.data.payload.data.data.roomId;
  //     console.log("===roomID===" + roomid);
  //     // 视频问诊的消息类型处理
  //     if (childType == "video") {
  //       that.setData({
  //         roomID: roomid,
  //         customMsgType: childType
  //       })
  //     }
  //   }
  // });
},

/* 操作：发送自定义消息 */
sendCustomMsg: function(e) {
  let that = this;
  let parmas = {
    customType: "sys",
    childType: "video",
    data: {
      inquiryId: that.data.inquiryId /*"20011711191832397541325001"*/ ,
      bizId: "tmc",
      requestRole: "0"
    }
  };
  console.log("视频问诊发送自定义消息内容：" + JSON.stringify(parmas));
  // 创建消息实例
  let message = tim.createCustomMessage({
    to: that.data.inquiryInfo.keyID,
    conversationType: TIM.TYPES.CONV_GROUP, // 群聊
    payload: {
      data: parmas,
      description: "[视频问诊消息]",
      extension: 'tmc'
    }
  });
  // 发送消息
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    console.log('视频问诊发送自定义消息成功:' + JSON.stringify(imResponse));
  }).catch(function(imError) {
    // 发送失败
    console.warn('视频问诊发送自定义消息失败:', JSON.stringify(imError));
  });
},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function() {
  console.log('room.js onHide');
},

startWebrtc: function() {
  let that = this;
  var webrtcroomCom = that.selectComponent('#myroom');
  if (webrtcroomCom) {
    webrtcroomCom.start();
  }
},

onLoad: function(options) {
  // console.log(options);
  let that = this;
  this.getPersonInfo(); // 从storage中获取患者信息和userSig
  // that.setData({
  //     userID: that.data.userInfo.keyID,
  //     sdkAppID: that.data.sdkAppID,
  //     roomID: that.data.roomID,
  //     userSig: that.data.userSig
  //   }),
  //   console.log(
  //     "userID:" + that.data.userInfo.keyID +
  //     ",sdkAppID:" + that.data.sdkAppID +
  //     ",roomID:" + that.data.roomID +
  //     ",userSig:" + that.data.userSig);
  // 创建问诊   
  this.createVideoInquiry();
  that.setData({
      userID: that.data.userInfo.keyID,
      sdkAppID: that.data.sdkAppID,
      roomID: that.data.roomID,
      userSig: that.data.userSig
    }),
    console.log("进入房间参数：" +
      "userID:" + that.data.userInfo.keyID +
      ",sdkAppID:" + that.data.sdkAppID +
      ",roomID:" + that.data.roomID +
      ",userSig:" + that.data.userSig);
  // 获取房间号进入房间
  this.startWebrtc();
},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function() {
  // 设置房间标题
  wx.setNavigationBarTitle({
    title: '视频问诊'
  });
}
})