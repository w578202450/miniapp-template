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
    roomID: '', // [必选]房间号，可以由您的服务指定
    userID: '', // [必选]用户 ID，可以由您的服务指定，或者使用小程序的 openid
    userSig: '', // [必选]身份签名，需要从自行搭建的签名服务获取
    inquiryInfo: {}, // 问诊信息
    sdkAppID: SDKAPPID /*'1400200900'*/ , // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
    template: 'float', // [必选]标识组件使用的界面模版，组件内置了 bigsmall，float，grid 三种布局
    privateMapKey: '', // 房间权限 key，需要从自行搭建的签名服务获取
    // 如果您没有在【控制台】>【实时音视频】>【您的应用名称】>【帐号信息】中启用权限密钥，可不用填
    beauty: 3, // 美颜指数，取值 0 - 9，数值越大效果越明显
    muted: false, // true 静音 false 不静音
    debug: false, // true 打印推流 debug 信息 fales 不打印推流 debug 信息
    // 其他配置参数可查看 API 文档
    inquiryId: '', // 问诊记录id
    customMsgType: '', // 自定义消息类型(根据payload{childType}确定)
    enableCamera: true,
    enableIM: false, // 不启用IM
    isInCalling: false, // 是否视频中
    doctorInfo: {}, // 医生信息
    isAcceptCall: false, // 是否展示接听按钮
    isHiddenAcceptInterface: true, // 是否隐藏接听界面
    isHiddenCallInterface: true, //是否隐藏拨打界面
    isEnterRoom: false, // 是否进入房间(接听之前cancel,接通之后)
    hidden: false // 是否隐藏接听按钮
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    msgStorage.off('newChatMsg')
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
    console.log('createVideoInquiry---', JSON.stringify(this.data.inquiryInfo))
    let that = this;
    let prams = {
      bizID: 'tmc',
      bizType: 'tmc',
      clientID: '19100717375019793291301001',
      sponsorsID: app.globalData.personInfo.keyID,
      sponsorsName: app.globalData.personInfo.patientName,
      receiverID: wx.getStorageSync('inquiryInfo').keyID,
      receiverName: wx.getStorageSync('inquiryInfo').keyID,
      patientName: app.globalData.personInfo.patientName,
      requestRole: "0",
    };
    // console.log("视频问诊:sponsorsID:" + that.data.userInfo.keyID +
    //   ",sponsorsName:" + app.globalData.personInfo.patientName +
    //   ",receiverID:" + that.data.inquiryInfo.keyID +
    //   ",receiverName:" + that.data.inquiryInfo.keyID +
    //   ",patientName:" + app.globalData.personInfo.patientName +
    //   ",patientSex:" + that.data.userInfo.sex +
    //   ",patientPhone:" + that.data.userInfo.phone +
    //   ",patientIdNo:" + that.data.userInfo.idNumber
    // );
    HTTP.createVideoInquiry(prams).then(res => {
      console.log("云处方创建视频问诊记录:" + res.data.inquiryId);
      that.setData({
        inquiryId: res.data.inquiryId
      });
    })
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
  },

  sendCustomMsg: function(msgPayload) {
    let that = this;
    let data = msgPayload.data;
    let description = msgPayload.description;
    let extension = msgPayload.extension;
    // 创建消息实例
    let message = tim.createCustomMessage({
      to: wx.getStorageSync('inquiryInfo').keyID,
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        data: data,
        description: description,
        extension: extension
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


  /**
   * 进入房间
   */
  joinRoom: function() {
    let that = this;
    that.setData({
      userID: that.data.userInfo.keyID, // [必选]用户 ID，可以由您的服务指定，或者使用小程序的openid
      sdkAppID: that.data.sdkAppID, // [必选]开通实时音视频服务创建应用后分配的 sdkAppID
      roomID: that.data.roomID, // [必选]房间号，可以由您的服务指定
      userSig: that.data.userSig, // [必选]身份签名，需要从自行搭建的签名服务获取
      privateMapKey: '' // 一般不需要填
    }, function() {
      this.data.webrtcroomComponent.start();
    })
  },

  /**
   * 退出房间
   */
  exitRoom: function() {
    let that = this;
    this.data.webrtcroomComponent.stop();
  },

  /**
   * 开启（或关闭）本地声音采集
   */
  changeMute: function(isMuteMute) {
    let that = this;
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
   * 挂断视频
   */
  hangUpVideo: function(e) {

    let that = this;

    let index = e.currentTarget.dataset.index;

    console.log("---------------挂断视频-------------------" + JSON.stringify(that.data));

    if (index == 0) { //取消拨打

      if (!that.data.roomID) {
        let dataParams = {
          customType: "sys",
          childType: "video",
          data: {
            bizId: "tmc",
            type: "cancel",
            requestRole: "0"
          }
        };
        let msgPayload = {
          data: JSON.stringify(dataParams),
          description: "[视频问诊消息]",
          extension: 'tmc'
        };
        that.sendCustomMsg(msgPayload);
        that.goBack();
      } else {
        let dataParams = {
          customType: "sys",
          childType: "video",
          data: {
            bizId: "tmc",
            type: "hangUp",
            requestRole: "0"
          }
        };
        let msgPayload = {
          data: JSON.stringify(dataParams),
          description: "[视频问诊消息]",
          extension: 'tmc'
        };
        that.sendCustomMsg(msgPayload);
        that.exitRoom();
        that.goBack();
      }
    } else {
      let dataParams = {};
      if (that.data.roomID) {
        dataParams = {
          customType: "sys",
          childType: "video",
          data: {
            bizId: "tmc",
            type: "hangUp",
            requestRole: "0"
          }
        };
      } else {
        dataParams = {
          customType: "sys",
          childType: "video",
          data: {
            bizId: "tmc",
            type: "reject",
            requestRole: "0"
          }
        };
      }
      let msgPayload = {
        data: JSON.stringify(dataParams),
        description: "[视频问诊消息]",
        extension: 'tmc'
      };
      that.sendCustomMsg(msgPayload);
      that.exitRoom();
      that.goBack();
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
    });
  },

  onLoad: function(options) {
    console.log("-----111----" + JSON.stringify(options));
    let that = this;
    this.data.webrtcroomComponent = this.selectComponent('#myroom');
    /**
     * 收消息
     */
    let myUsername = wx.getStorageSync("myUsername");
    msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey) {
      console.log("分发到视频界面消息:" + JSON.stringify(renderableMsg));
      // msgType
      let msgType = renderableMsg.type;
      // console.log("msg{Type}:" + msgType);
      if (msgType == "TIMCustomElem") { // 自定义消息
        let jsonData = JSON.parse(renderableMsg.payload.data);
        // customType
        let customType = jsonData.customType;
        // childType
        let childType = jsonData.childType;
        console.log("payload.data.{childType}:" + childType);
        // data
        let data = jsonData.data;
        console.log("payload{data}:" + JSON.stringify(data));
        // 视频问诊的消息类型处理
        if (childType == "video") {
          // 是否接收还是拒绝
          let isaccept = jsonData.data.type;
          console.log("payload.data.data.{type}:" + isaccept);
          if (isaccept == "reject") { // 对方拒绝
            // 退出房间
            wx.showToast({
              title: '医生忙碌中...'
            });
            that.exitRoom();
            that.goBack();
          } else if (isaccept == "accept") { // 对方接收
            wx.showToast({
              title: '医生已接听...'
            });
            // 房间号
            let roomid = jsonData.data.roomId;
            console.log("payload.data.data.{roomId}:" + roomid);
            that.setData({
              roomID: roomid
            });
            if (roomid) {
              that.setData({
                isInCalling: true
              });
              // 进入房间
              that.joinRoom();
            }
          } else if (isaccept == "hangUp") { // 对方挂断
            // 退出房间
            that.exitRoom();
            that.goBack();
          }
        }
      }
    });
    /**
     * 获取基础信息
     */
    wx.getStorage({
      key: 'personInfo',
      success: function(res) {
        // 获取患者信息
        that.setData({
          userInfo: res.data
        });
        console.log("===患者信息===" + JSON.stringify(that.data.userInfo));
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

              },
            })
          },
        })
      },
    });
    // console.log(options);
    if (options.isCall == 1) { // 主动发起
      that.setData({
        isHiddenAcceptInterface: true,
        // isAcceptCall: true,
        isHiddenCallInterface: false,
      })

      that.callVideo();
    } else if (options.isCall == 2) { // 接收发起
      that.setData({
        isHiddenAcceptInterface: false,
        // isAcceptCall: true,
        isHiddenCallInterface: true,

        inquiryId: options.inquiryID,
      });
      console.log("======----" + this.data.inquiryID + "   " + options.inquiryID);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 设置房间标题
    wx.setNavigationBarTitle({
      title: '视频问诊'
    });
  },

  /**
   * 主动发起
   */
  callVideo: function() {
    let that = this;
    that.setData({
        hidden: false
      }),
      // 创建问诊   
      that.createVideoInquiry();
  },

  /**
   * 接听视频
   */
  acceptVideo: function() {
    let that = this;
    that.setData({
        hidden: true
      }),
      that.getRoomId();

  },

  // 获取roomId
  getRoomId: function() {
    let that = this;
    let prams = {
      inquiryId: that.data.inquiryId, // 问诊记录id	
      sponsorsId: that.data.userInfo.keyID, // 发起者id(患者id)
      receiverId: wx.getStorageSync('inquiryInfo').keyID // 接受者id(医生id)
    };
    console.log("获取roomId参数:inquiryId:" + that.data.inquiryId +
      ",sponsorsId:" + that.data.userInfo.keyID +
      ",receiverID:" + wx.getStorageSync('inquiryInfo').keyID
    );
    HTTP.getRoomId(prams).then(res => {
      console.log("获取roomId:" + JSON.stringify(res));
      that.setData({
        roomID: res.data.roomId
      });
      // 发送问诊ID
      // 发送自定义消息通知医生
      let dataParams = {
        customType: "sys",
        childType: "video",
        data: {
          roomId: res.data.roomId,
          bizId: "tmc",
          type: "accept",
          requestRole: "0"
        }
      };
      let msgPayload = {
        data: JSON.stringify(dataParams),
        description: "[视频问诊消息]",
        extension: 'tmc'
      };
      that.sendCustomMsg(msgPayload);
      that.joinRoom();
    })
  }
})