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

  data: {
    webrtcroomComponent: null,
    userInfo: {}, // 当前用户信息
    roomID: '123', // [必选]房间号，可以由您的服务指定
    userID: '', // [必选]用户 ID，可以由您的服务指定，或者使用小程序的 openid
    userSig: '', // [必选]身份签名，需要从自行搭建的签名服务获取
    inquiryInfo: {}, // 问诊信息
    sdkAppID: SDKAPPID/*'1400200900'*/, // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
    template: 'float', // [必选]标识组件使用的界面模版，组件内置了 bigsmall，float，grid 三种布局
    privateMapKey: '', // 房间权限 key，需要从自行搭建的签名服务获取
    // 如果您没有在【控制台】>【实时音视频】>【您的应用名称】>【帐号信息】中启用权限密钥，可不用填
    beauty: 3, // 美颜指数，取值 0 - 9，数值越大效果越明显
    muted: false, // true 静音 false 不静音
    debug: false, // true 打印推流 debug 信息 fales 不打印推流 debug 信息
    enableIM: true, // 是否启用IM
    // 其他配置参数可查看 API 文档
    inquiryId: '', // 问诊记录id
    customMsgType: '', // 自定义消息类型(根据payload{childType}确定)
    enableCamera: true,
    username: {
      type: Object,
      value: {},
    },
    isInCalling: false, // 是否视频中
    doctorInfo: {} // 医生信息
  },

  /**
   * 通过 onIMEvent 返回 IM 消息事件，如果 enableIM 已关闭，则可以忽略 onIMEvent
   */
  onIMEvent: function(e) {
    switch (e.detail.tag) {
      case 'big_group_msg_notify':
        //收到群组消息
        console.debug(e.detail.detail);
        break;
      case 'login_event':
        //登录事件通知
        console.debug(e.detail.detail);
        break;
      case 'connection_event':
        //连接状态事件
        console.debug(e.detail.detail);
        break;
      case 'join_group_event':
        //进群事件通知
        console.debug(e.detail.detail);
        break;
    }
  },

  /**
   * 标签通过 onRoomEvent 返回内部事件
   */
  onRoomEvent: function(e) {
    let that = this;
    switch (e.detail.tag) {
      case 'error':
        {
          //发生错误
          let code = e.detail.code;
          let detail = e.detail.detail;
          // 错误提示窗口是否已经显示
          if (this.data.isErrorModalShow) {
            return;
          }
          this.data.isErrorModalShow = true;
          wx.showModal({
            title: '提示',
            content: code + ":" + detail,
            showCancel: false,
            complete: function() {
              this.data.isErrorModalShow = false;
              this.goBack();
            }
          });
          break;
        }
    }
  },

  /**
   * 云处方创建视频问诊记录
   */
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
      let msgPayload = {
        data: {
          customType: "sys",
          childType: "video",
          data: {
            inquiryId: res.data.inquiryId,
            bizId: "tmc",
            requestRole: "0"
          }
        },
        description: "[视频问诊消息]",
        extension: 'tmc'
      };
      that.sendCustomMsg(msgPayload);
    })
  },

  /**
   * 从storage中获取患者信息
   */
  // getPersonInfo: function() {
  //   let that = this;
  //   // let userInfo = wx.getStorageSync("personInfo");
  //   wx.getStorage({
  //     key: "personInfo",
  //     success: function(res) {
  //       that.setData({
  //         userInfo: res.data
  //       });
  //       that.getUserSig();
  //       console.log("===患者信息===" + JSON.stringify(that.data.userInfo));
  //       that.getInquiryInfo();
  //     }
  //   })
  // },

  /**
   * 获取UserSig
   */
  // getUserSig: function() {
  //   let that = this;
  //   let userSig = wx.getStorageSync("userSig");
  //   that.setData({
  //     userSig: userSig
  //   });
  //   console.log("===userSig===" + userSig);
  //   // wx.getStorage({
  //   //   key: 'userSig',
  //   //   success: function(res) {
  //   //     that.setData({
  //   //       userSig: res.data.userSig
  //   //     });
  //   //     console.log("===userSig===" + JSON.stringify(res.data.userSig));
  //   //   },
  //   // })
  // },

  /**
   * 获取群聊问诊信息
   */
  // getInquiryInfo: function() {
  //   let that = this;
  //   let inquiryInfo = wx.getStorageSync("inquiryInfo");
  //   that.setData({
  //     inquiryInfo: inquiryInfo
  //   });
  //   console.log("===获取群聊问诊信息===" + JSON.stringify(inquiryInfo));
  // },

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
      // msgType
      let msgType = renderableMsg.type;
      console.log("msg{Type}:" + msgType);
      if (msgType == "TIMCustomElem") { // 自定义消息
        // customType
        let customType = renderableMsg.payload.data.customType;
        // childType
        let childType = renderableMsg.payload.data.childType;
        console.log("payload.data.{childType}:" + childType);
        // data
        let data = renderableMsg.payload.data.data;
        console.log("payload{data}:" + JSON.stringify(data));
        // 视频问诊的消息类型处理
        if (childType == "video") {
          // 是否接收还是拒绝
          let isaccept = renderableMsg.payload.data.data.type;
          console.log("payload.data.data.{type}:" + isaccept);
          if (isaccept == "reject") { // 对方拒绝
            // 退出房间
            wx.showToast({
              title: '医生已拒绝...'
            });
            this.exitRoom();
            this.goBack();
          } else if (isaccept == "busy") { // 对方忙碌
            // 退出房间
            wx.showToast({
              title: '医生忙碌中...'
            });
            this.exitRoom();
            this.goBack();
          } else if (isaccept == "accept") { // 对方接收
            // 进入房间
            wx.showToast({
              title: '医生已接听...'
            });
            // 房间号
            let roomid = renderableMsg.payload.data.data.roomId;
            console.log("payload.data.data.{roomId}:" + roomid);
            that.setData({
              roomID: roomid
            });
            // 进入房间
            that.joinRoom();
          } else if (isaccept == "hangUp") { // 对方挂断
            // 退出房间
            wx.showToast({
              title: '医生已挂断...'
            });
            this.exitRoom();
            this.goBack();
          }
           else { /******** 收到的医生、医助发来的视频消息 ************/
          wx.showModal({
            title: '视频呼叫',
            content: '医生来电',
            cancelText: "拒绝",//默认是“取消”
            cancelColor: 'skyblue',//取消文字的颜色
            confirmText: "接听",//默认是“确定”
            confirmColor: 'skyblue',//确定文字的颜色
            success(res) {
              if (res.confirm) { // 接受
                console.log('用户点击接受视频');
                // 房间号
                let inquiryid = renderableMsg.payload.data.data.inquiryId;
                console.log("payload.data.data.{inquiryId}:" + inquiryid);
                that.setData({
                  inquiryId: inquiryid
                });
                // 进入房间
                that.joinRoom();
                // 根据问诊id获取房间号

                let parmas = {
                  customType: "sys",
                  childType: "video",
                  data: {
                    inquiryId: inquiryid/*that.data.inquiryId*/,
                    bizId: "tmc",
                    requestRole: "0"
                  }
                };
                 // 发送接受消息给医生、医助
                let msgPayload = {
                  data: {
                    customType: "sys",
                    childType: "video",
                    data: {
                      inquiryId: inquiryid,
                      bizId: "tmc",
                      requestRole: "0"
                    }
                  },
                  description: "[视频问诊消息]",
                  extension: 'tmc'
                };
                that.sendCustomMsg(msgPayload);

              } else if (res.cancel) { // 拒绝
                console.log('用户点击拒绝视频');
                that.goBack();
                // 发送拒绝消息给医生、医助
                let msgPayload = {
                  data: {
                    customType: "sys",
                    childType: "video",
                    data: {
                      bizId: "tmc",
                      requestRole: "0",
                      type:"reject"
                    }
                  },
                  description: "[视频问诊消息]",
                  extension: 'tmc'
                };
                that.sendCustomMsg(msgPayload);
              }
            }
          })
          }
        }
      }
    });
  },

  /* 操作：发送自定义消息 */
  // sendCustomMsg: function (parmas) {
  //   let that = this;
  //   let parmas = {
  //     customType: "sys",
  //     childType: "video",
  //     data: {
  //       inquiryId: that.data.inquiryId /*"20011711191832397541325001"*/ ,
  //       bizId: "tmc",
  //       requestRole: "0"
  //     }
  //   };
  //   console.log("视频问诊发送自定义消息内容：" + JSON.stringify(parmas));
  //   // 创建消息实例
  //   let message = tim.createCustomMessage({
  //     to: that.data.inquiryInfo.keyID,
  //     conversationType: TIM.TYPES.CONV_GROUP, // 群聊
  //     payload: {
  //       data: parmas,
  //       description: "[视频问诊消息]",
  //       extension: 'tmc'
  //     }
  //   });
  //   // 发送消息
  //   let promise = tim.sendMessage(message);
  //   promise.then(function(imResponse) {
  //     // 发送成功
  //     console.log('视频问诊发送自定义消息成功:' + JSON.stringify(imResponse));
  //   }).catch(function(imError) {
  //     // 发送失败
  //     console.warn('视频问诊发送自定义消息失败:', JSON.stringify(imError));
  //   });
  // },

  sendCustomMsg: function (msgPayload) {
    let that = this;
    // let msgPayload = {
    //   data:{
    //     customType: "sys",
    //     childType: "video",
    //     data: {
    //       inquiryId: that.data.inquiryId /*"20011711191832397541325001"*/,
    //       bizId: "tmc",
    //       requestRole: "0"
    //     }
    //   },
    //   description: "[视频问诊消息]",
    //   extension: 'tmc'
    // };
    console.log("视频问诊发送自定义消息内容：" + JSON.stringify(msgPayload));
    let data = msgPayload.data;
    let description = msgPayload.description;
    let extension = msgPayload.extension;
    // 创建消息实例
    let message = tim.createCustomMessage({
      to: that.data.inquiryInfo.keyID,
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        data: data,
        description: description,
        extension: extension
      }
    });
    // 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      console.log('视频问诊发送自定义消息成功:' + JSON.stringify(imResponse));
    }).catch(function (imError) {
      // 发送失败
      console.warn('视频问诊发送自定义消息失败:', JSON.stringify(imError));
    });
  },

    // 获取roomId
  getRoomId: function() {
    let that = this;
    let prams = {
      inquiryId: that.data.inquiryId, // 问诊记录id	
      sponsorsId: that.data.userInfo.keyID, // 发起者id(患者id)
      receiverId: that.data.inquiryInfo.keyID // 接受者id(医生id)
    };
    console.log("获取roomId参数:inquiryId:" + that.data.inquiryId
      + ",sponsorsId:" + that.data.userInfo.keyID
      + ",receiverID:" + that.data.inquiryInfo.keyID
    );
    HTTP.getRoomId(prams).then(res => {
      console.log("获取roomId:" + res.data.roomID);
      that.setData({
        roomID: res.data.roomID
      });
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('room.js onHide');
  },

  // startWebrtc: function() {
  //   let that = this;
  //   var webrtcroomCom = that.selectComponent('#myroom');
  //   if (webrtcroomCom) {
  //     webrtcroomCom.start();
  //   }
  // },

  // 进入房间
  joinRoom: function() {
    let that = this;
    that.setData({
      userID: that.data.userInfo.keyID, // [必选]用户 ID，可以由您的服务指定，或者使用小程序的openid
      sdkAppID: that.data.sdkAppID, // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
      roomID: that.data.roomID, // [必选]房间号，可以由您的服务指定
      userSig: that.data.userSig, // [必选]身份签名，需要从自行搭建的签名服务获取
      privateMapKey: '' // 一般不需要填
    }, function() {
      // var webrtcroomCom = that.selectComponent('#myroom');
      // if (webrtcroomCom) {
      //   webrtcroomCom.start();
      // }
      console.log("进入房间：" +
        "userID:" + userID +
        ",sdkAppID:" + sdkAppID +
        ",roomID:" + roomID +
        ",userSig:" + userSig);
      this.data.webrtcroomComponent.start();
    })
  },

  /**
   * 退出房间
   */
  exitRoom: function() {
    let that = this;
    // var webrtcroomCom = that.selectComponent('#myroom');
    // if (webrtcroomCom) {
    //   webrtcroomCom.stop();
    // }
    this.data.webrtcroomComponent.stop();
  },

  /**
   * 开启（或关闭）本地声音采集
   */
  changeMute: function(isMuteMute) {
    let that = this;
    // this.data.muted = !this.data.muted;
    // this.setData({
    //   muted: this.data.muted
    // });
    this.data.muted = isMuteMute; // true or false
    this.setData({
      muted: this.data.muted
    });
  },

  /**
   * 开启（或关闭）本地视频采集
   */
  enableCamera: function(isEnableCamera) {
    let that = this;
    // this.data.enableCamera = !this.data.enableCamera;
    this.setData({
      enableCamera: this.data.enableCamera
    });
  },

  /**
   * 切换摄像头
   */
  changeCamera: function() {
    let that = this;
    this.data.webrtcroomComponent.switchCamera();
  },

  /**
   * 返回上一页
   */
  goBack() {
    let that = this;
    var pages = getCurrentPages();
    if (pages.length > 1 && (pages[pages.length - 1].__route__ == 'pages/online-inquiry/inquiry/video/room')) {
      wx.navigateBack({
        delta: 1
      });
    }
  },

  onLoad: function(options) {
    let that = this;
    this.data.webrtcroomComponent = this.selectComponent('#myroom');
    // this.getPersonInfo(); // 从storage中获取患者信息和userSig
    // wx.getStorage({
    //   key: "personInfo",
    //   success: function(res) {
    //     that.setData({
    //       userInfo: res.data
    //     });
    //     // that.getUserSig();
    //     let userSig = wx.getStorageSync("userSig");
    //     that.setData({
    //       userSig: userSig
    //     });
    //     wx.getStorage({
    //       key: 'inquiryInfo',
    //       success: function(res) {
    //         that.setData({
    //           inquiryInfo: res.data
    //         });
    //         // 创建问诊   
    //         that.createVideoInquiry();
    //         that.joinRoom();
    //       },
    //     })
    //   }
    // })
    wx.getStorage({
      key: 'personInfo',
      success: function(res) {
        // 获取患者信息
        that.setData({
          userInfo: res.data
        });
        console.log("===患者信息===" + JSON.stringify(that.data));
        wx.getStorage({
          key: 'userSig',
          success: function(res) {
            // 获取userSig
            that.setData({
              userSig: res.data
            });
            console.log("===userSig===" + JSON.stringify(res.data));
            wx.getStorage({
              key: 'inquiryInfo',
              success: function(res) {
                // 获取inquiryInfo
                that.setData({
                  inquiryInfo: res.data
                });
                console.log("===获取群聊问诊信息===" + JSON.stringify(res.data));
                // 创建问诊   
                that.createVideoInquiry();
                // that.joinRoom();
              },
            })
          },
        })
      },
    })
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