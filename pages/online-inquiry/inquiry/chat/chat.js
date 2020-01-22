const app = getApp();
const recorderManager = wx.getRecorderManager();
var HTTP = require('../../../../utils/http-util');
var msgStorage = require("../../../../utils/msgstorage");
var tim = app.globalData.tim;
var TIM = app.globalData.TIM;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: "", // 手机屏幕自动滚动到达的位置
    userInfo: {}, // 当前用户信息
    wexinInfo: {}, // 当前用户微信信息
    doctorInfo: {}, // 医生信息<主要是拿到职称>
    assistantDoctorInfo: {}, // 医助信息详情
    // 多方对话对话信息
    talkInfo: {
      doctorInfo: {}, // 医生信息详情
      assistantInfo: {}, // 医助信息详情
      patientInfo: {}, // 患者信息详情
      multiTalkInfo: {} // 三者ID信息
    },
    inquiryInfo: {}, // 问诊信息 
    username: {
      type: Object,
      value: {},
    },
    currentMessageList: [], // 聊天列表信息
    nextReqMessageID: "", // 用于续拉，分页续拉时需传入该字段
    isCompleted: false, // 表示是否已经拉完所有消息
    httpLoading: false, // 是否请求中
    maySendContent: "", // 输入的聊天内容
    maySendContentSure: false, // 是否允许发送的内容格式
    isOpenBottomBoolbar: false, // 是否打开工具栏
    // 底部菜单栏
    toolbarMenus: [{
        title: "图片",
        iconUrl: "../../../../images/chat/m-image.png",
        clickFun: "chooseWxImage",
        isFifth: false
      },
      {
        title: "拍照",
        iconUrl: "../../../../images/chat/m-camera.png",
        clickFun: "cameraWxFun",
        isFifth: false
      }, {
        title: "视频问诊",
        iconUrl: "../../../../images/chat/m-video.png",
        clickFun: "videoWxFun",
        isFifth: false
      }
    ],
    aimgurl: {}, //临时图片的信息
    countIndex: 1, // 可选图片剩余的数量
    hidden: true, // 加载中是否隐藏
    scrollTop: 0, // 内容底部与顶部的距离
    isSendRecord: false,
    recordingTxt: "按住 说话",
    startPoint: {}, // 手指触摸屏幕的位置
    sendRecordLock: true, // 是否允许发送语音
    animated: true, // loading加载框动画
    innerAudioContext: null, // 音频播放事件
    recordIndex: "", // 播放的音频的下标
    recordFileUrl: "", // 播放的音频文件的路径
    recordIconUrlSelf: "../../../../images/chat/audioSelf.png", // 语音消息的图标 => 自己发的
    recordIconUrlOthers: "../../../../images/chat/audio.png", // 语音消息的图标 => 他人发的
    recordIconClickedUrlSelf: "../../../../images/chat/audioGifSelf.gif", // 播放语音时的GIF => 自己发的
    recordIconClickedUrlOthers: "../../../../images/chat/audioGif.gif" // 播放语音时的GIF => 他人发的
    // bottomMenusDistance: 0, // 底部工具栏距离底部的距离
    // inputShowed: false, // 输入框是否获取焦点
    // docInfoBoxTop: 0, // 医生医助信息栏与顶部的距离
    // systemInfo: {} // 当前手机类型相关信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getPersonInfo(); // 从storage中获取患者信息

    let innerAudioContext = wx.createInnerAudioContext();
    that.setData({
      innerAudioContext: innerAudioContext
    });
    innerAudioContext.onPlay(() => {
      // 录音播放中时
    });
    innerAudioContext.onStop(() => {
      // 录音播放停止时
      that.initItemRecordStatusFun();
    });
    innerAudioContext.onEnded(() => {
      // 录音播放结束时
      that.initItemRecordStatusFun();
    });
    innerAudioContext.onError(() => {
      // 录音播放错误时
      that.initItemRecordStatusFun();
    });

    let myUsername = wx.getStorageSync("myUsername");
    msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey) {
      // console.log("分发到聊天界面的消息：" + JSON.stringify(renderableMsg));
      // msgType
      let msgType = renderableMsg.type;
      // console.log("msg{Type}:" + msgType);
      if (msgType == "TIMSoundElem") { // 语音消息
        renderableMsg.recordStatus = false; // 播放状态
        if (Number(renderableMsg.payload.second) <= 15) {
          renderableMsg.recordViewWidth = renderableMsg.payload.second * 12 + 100; // 最大宽度不超过370,最小宽度要大于100
        } else {
          renderableMsg.recordViewWidth = (Number(renderableMsg.payload.second) - 15) * 2 + 280; // 最大宽度不超过420,最小宽度要大于100
        }
      } else if (msgType == "TIMCustomElem") {
        // 自定义消息
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
          // 视频问诊的消息类型处理
          if (childType == "video") {
            // 医生发起(接收视频)
            console.log("---------接收视频-------")
            if (jsonData.data.requestRole == 1 && jsonData.data.inquiryId) {
              let inquiryType = jsonData.data.type;
              console.log("医生发起(接收视频)inquiryID:" + jsonData.data.inquiryId);
              that.videoWxFun(jsonData.data.inquiryId);
            };

            //   console.log("payload.data.data.{type}:" + isaccept);
            //   if (isaccept == "reject") { // 对方拒绝
            //     // 退出房间
            //     wx.showToast({
            //       title: '医生已拒绝...'
            //     });
            //     this.exitRoom();
            //     this.goBack();
            //   } else if (isaccept == "busy") { // 对方忙碌
            //     // 退出房间
            //     wx.showToast({
            //       title: '医生忙碌中...'
            //     });
            //     this.exitRoom();
            //     this.goBack();
            //   } else if (isaccept == "accept") { // 对方接收
            //     that.setData({
            //       isInCalling: true
            //     });
            //     // 进入房间
            //     wx.showToast({
            //       title: '医生已接听...'
            //     });
            //     // 房间号
            //     let roomid = jsonData.data.roomId;
            //     console.log("payload.data.data.{roomId}:" + roomid);
            //     that.setData({
            //       roomID: roomid
            //     });
            //     // 进入房间
            //     that.joinRoom();
            //   } else if (isaccept == "hangUp") { // 对方挂断
            //     // 退出房间
            //     wx.showToast({
            //       title: '医生已挂断...'
            //     });
            //     this.exitRoom();
            //     this.goBack();
            //   }
          }
        }
      }
      let nowData = [...that.data.currentMessageList, renderableMsg];
      that.setData({
        currentMessageList: nowData
      });
      if (msgType != "TIMCustomElem") {
        that.toViewBottomFun();
      };
      // that.setMessageRead();
    });

    /**
     * 获取手机系统
     */
    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       systemInfo: res,
    //     })
    //     if (res.platform == "devtools") {
    //       // console.log("PC");
    //     } else if (res.platform == "ios") {
    //       // console.log("IOS");
    //     } else if (res.platform == "android") {
    //       // console.log("android");
    //     }
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
  },

  /**
   * 处理系统消息
   */
  dealSysMessage: function(data) {
    let that = this;
    let childType = data.childType;
    switch (childType) {
      case "video": // 视频问诊消息
        that.dealSysVideoMessage(data);
        break;
    }
  },

  /**
   * 处理hint消息
   */
  dealHintMessage: function(data) {

  },

  /**
   * 处理视频问诊消息
   */
  dealSysVideoMessage: function(data) {
    // console.log("===处理视频问诊消息===" + JSON.stringify(data));
    let that = this;
    let requestRole = data.requestRole;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.innerAudioContext.stop();
    msgStorage.off('newChatMsg')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 操作：下拉加载数据
  onPullDownRefresh: function() {
    let that = this;
    if (that.data.isCompleted) {
      // 没有更多数据了
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "没有更多历史消息了~",
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.showNavigationBarLoading(); //在标题栏中显示加载中的转圈效果
    tim.getMessageList({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID,
      nextReqMessageID: that.data.nextReqMessageID,
      count: 20
    }).then(function(imResponse) {
      imResponse.data.messageList.forEach(item => {
        if (item.type == "TIMSoundElem") {
          item.recordStatus = false; // 播放状态
          if (Number(item.payload.second) <= 15) {
            item.recordViewWidth = Number(item.payload.second) * 12 + 100; // 最大宽度不超过370,最小宽度要大于100
          } else {
            item.recordViewWidth = (Number(item.payload.second) - 15) * 2 + 280; // 最大宽度不超过370,最小宽度要大于100
          }
        }
      })
      setTimeout(function() {
        that.setData({
          currentMessageList: [...imResponse.data.messageList, ...that.data.currentMessageList],
          nextReqMessageID: imResponse.data.nextReqMessageID,
          isCompleted: imResponse.data.isCompleted
        });
        wx.hideNavigationBarLoading(); // 完成数据操作后停止标题栏中的加载中的效果
        wx.stopPullDownRefresh(); // 停止下拉刷新过程
      }, 1000);
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /*从storage中获取患者信息 */
  getPersonInfo: function() {
    let that = this;
    wx.getStorage({
      key: "personInfo",
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
        // console.log("患者信息:" + JSON.stringify(res.data));
        if (that.data.userInfo.keyID) {
          that.getPatientMultiTalk(); // 查询患者的多方对话
        }
      }
    });
    wx.getStorage({
      key: "userInfo",
      success: function(res) {
        that.setData({
          wexinInfo: res.data
        });
      }
    });
    // wx.getStorage({
    //   key: "doctorInfo",
    //   success: function(res) {
    //     that.setData({
    //       doctorInfo: res.data
    //     });
    //   }
    // });
    console.log("");
    wx.getStorage({
      key: "assistantInfo",
      success: function(res) {
        that.setData({
          assistantDoctorInfo: res.data
        });
      }
    });
  },

  /*查询患者的多方对话 */
  getPatientMultiTalk: function() {
    let that = this;
    let prams = {
      orgID: that.data.userInfo.orgID,
      patientID: that.data.userInfo.keyID,
      doctorStaffID: that.data.userInfo.doctorStaffID,
      assistantStaffID: that.data.userInfo.assistantStaffID
    };
    HTTP.getPatientMultiTalk(prams).then(res => {
      let resData = res.data;
      that.setData({
        talkInfo: {
          doctorInfo: resData.doctor,
          assistantInfo: resData.assistant,
          patientInfo: resData.patient,
          multiTalkInfo: resData.multiTalk
        }
      });
      wx.setStorageSync('doctorInfo', resData.doctor)
      console.log("医生信息:" + JSON.stringify(resData.doctor));
      that.createInquiry(); // 创建问诊
    })
  },

  /*创建问诊 */
  createInquiry: function() {
    let that = this;
    that.setData({
      hidden: false
    });
    let prams = {
      orgID: that.data.userInfo.orgID,
      patientID: that.data.userInfo.keyID,
      doctorStaffID: that.data.userInfo.doctorStaffID,
      doctorName: that.data.talkInfo.doctorInfo.doctorName,
      assistantStaffID: that.data.userInfo.assistantStaffID,
      assistantName: that.data.talkInfo.assistantInfo.doctorName
    };
    HTTP.createInquiry(prams).then(res => {
      that.setData({
        inquiryInfo: res.data
      });
      wx.setStorage({
        key: 'inquiryInfo',
        data: res.data
      });
      // console.log("创建问诊:" + JSON.stringify(res.data));
      that.getHistoryMessage(); // 获取历史消息
    })
  },

  /*打开会话时,获取最近消息列表 */
  getHistoryMessage: function() {
    let that = this;
    tim.getMessageList({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID,
      count: 20
    }).then(function(imResponse) {
      imResponse.data.messageList.forEach(item => {
        if (item.type == "TIMSoundElem") {
          item.recordStatus = false; // 播放状态
          if (Number(item.payload.second) <= 15) {
            item.recordViewWidth = item.payload.second * 12 + 100; // 最大宽度不超过370,最小宽度要大于100
          } else {
            item.recordViewWidth = (Number(item.payload.second) - 15) * 2 + 280; // 最大宽度不超过370,最小宽度要大于100
          }
        } else if (item.type == "TIMCustomElem") {
          // 自定义消息
        }
      })
      that.setData({
        currentMessageList: imResponse.data.messageList,
        nextReqMessageID: imResponse.data.nextReqMessageID,
        isCompleted: imResponse.data.isCompleted
      });
      // console.log(imResponse.data.messageList);
      that.toViewBottomFun();
    }).catch(function(imError) {
      that.setData({
        hidden: true
      });
      console.warn(imError);
    });
  },

  /*打开会话时,消息设置成已读 */
  setMessageRead: function() {
    let that = this;
    // 将某会话下所有未读消息已读上报
    tim.setMessageRead({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID
    });
  },

  /*自动：滚动到消息底部 */
  toViewBottomFun: function() {
    // 设置屏幕自动滚动到最后一条消息处
    let that = this;
    wx.createSelectorQuery().select('#viewCommunicationBody').boundingClientRect(function(rect) {
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 100
      })
      that.setData({
        hidden: true,
        scrollTop: rect.height - that.data.scrollTop
      });
    }).exec();
  },

  /*操作： 点击医生查看详情 */
  doctorDetailTap: function(e) {
    var index = e.currentTarget.dataset.index
    var doctorStaffID = index == '0' ? wx.getStorageSync('personInfo').doctorStaffID : wx.getStorageSync('personInfo').assistantStaffID
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details?staffID=' + doctorStaffID,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*操作：点击输入框时，关闭工具栏  */
  inputClickedFun: function() {
    // let that = this;
    // if (that.data.systemInfo.platform == "android" && that.data.isOpenBottomBoolbar) {
    //   this.setData({
    //     isOpenBottomBoolbar: false
    //   });
    // }
  },

  /*操作：键盘高度变化时 */
  menusInputHeightChangeFun: function(e) {

  },

  /*操作：输入框聚焦*/
  menusInputFocusFun: function(e) {
    // let that = this;
    // if (that.data.systemInfo.platform == "ios" && that.data.isOpenBottomBoolbar) {
    //   this.setData({
    //     docInfoBoxTop: e.detail.height + 30
    //   });
    // } else {
    //   this.setData({
    //     docInfoBoxTop: e.detail.height * 2
    //   });
    // }
  },

  /*操作：消息输入框失去焦点时 */
  menusInputBlurFun: function(e) {
    // this.setData({
    //   docInfoBoxTop: 0
    // });
  },

  /*操作：输入预发送信息 */
  adInputChange: function(e) {
    let that = this;
    that.setData({
      maySendContent: e.detail.value,
    });
    let value = that.data.maySendContent; // 先把输入的值复制一份，用于操作
    value = value.replace(/\s+/g, ""); // 用正则表达式去掉所有的空白字符（空格是其中一种）
    //去掉所有空格之后，再对它进行判断，  
    //如果字符串中还有别的内容，说明输入的内容不是空格，则可以发送
    if (value != "") {
      that.setData({
        maySendContentSure: true
      });
    } else {
      that.setData({
        maySendContentSure: false
      });
    }
  },

  /*操作：发送（文本消息） */
  sendContentMsg: function(e) {
    let that = this;
    if (that.data.httpLoading || !that.data.maySendContent) {
      return;
    }
    that.setData({
      httpLoading: true // 开启隐性加载过程
    });
    // 1. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createTextMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        text: that.data.maySendContent
      }
    });
    let nowData = [...that.data.currentMessageList, message];
    that.setData({
      currentMessageList: nowData,
      maySendContent: "",
      maySendContentSure: false,
      isOpenBottomBoolbar: false,
      httpLoading: false // 关闭隐性加载过程
    });
    that.toViewBottomFun();
    // 2. 发送消息
    tim.sendMessage(message).then(function(imResponse) {
      console.log("aaaaaaaaa");
    }).catch(function(imError) {
      that.setData({
        httpLoading: false // 关闭隐性加载过程
      });
      console.warn('imError-------', imError);
    });
  },

  /*操作：打开、关闭 底部工具栏 */
  isOpenBottomBoolbarFun: function() {
    this.setData({
      isOpenBottomBoolbar: !this.data.isOpenBottomBoolbar,
      isSendRecord: false
    });
    this.toViewBottomFun();
  },

  /*操作：点击工具栏某功能 */
  toolbarMenusFun: function(e) {
    let fun = e.currentTarget.dataset.clickfun;
    if (fun == "chooseWxImage") {
      this.chooseWxImage();
    } else if (fun == "cameraWxFun") {
      this.cameraWxFun();
    } else if (fun == "videoWxFun") {
      // 主动发起不需要传inquiryID;
      this.videoWxFun();
    }
  },

  /*操作：打开相册*/
  chooseWxImage: function() {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["album"],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          aimgurl: res
        });
        that.sendImageMsg();
      }
    })
  },

  /*操作：打开相机 */
  cameraWxFun: function() {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["camera"],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          aimgurl: res
        });
        that.sendImageMsg();
      }
    })
  },

  /*操作：发送（图片消息） */
  sendImageMsg: function() {
    let that = this;
    if (that.data.httpLoading) {
      return;
    }
    that.setData({
      httpLoading: true // 开启隐性加载过程
    });
    // 1. 创建消息实例
    const message = tim.createImageMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        file: that.data.aimgurl
      }
    });
    message.showLoadingState = true;
    let nowData = [...that.data.currentMessageList, message];
    that.setData({
      currentMessageList: nowData
    });
    that.toViewBottomFun();
    // 2. 发送数据
    tim.sendMessage(message).then(function(imResponse) {
      let nowDatas = [...that.data.currentMessageList];
      nowDatas[nowDatas.length - 1].showLoadingState = false;
      that.setData({
        currentMessageList: nowDatas,
        isOpenBottomBoolbar: false,
        httpLoading: false // 关闭隐性加载过程
      });
    }).catch(function(imError) {
      console.warn(imError);
      that.setData({
        httpLoading: false // 关闭隐性加载过程
      });
    });
  },

  /*操作：点击单张图片*/
  previewImage(e) {
    let url = e.currentTarget.dataset.imagesrc;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },

  /*操作：切换为键盘 */
  openKeyboardFun: function() {
    this.setData({
      isSendRecord: false,
      isOpenBottomBoolbar: false
    });
  },

  /*操作：切换为语音 */
  willSendRecordMsg: function() {
    this.setData({
      isSendRecord: true,
      isOpenBottomBoolbar: false
    });
  },

  /*操作：开始长按录音按钮 */
  handleTouchStart: function(e) {
    let that = this;
    that.startRecordMsg();
    that.setData({
      startPoint: e.touches[0],
      recordingTxt: "松开 结束",
      sendRecordLock: true
    });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.hideToast(); // 结束录音、隐藏Toast提示框
          recorderManager.stop();
          recorderManager.onStop(function(res) {});
          wx.showToast({
            title: "您未允许本小程序语音授权，无法发送语音",
            icon: "none",
            duration: 3000
          });
        }
      }
    });
  },

  /*操作：结束长按录音按钮 */
  handleTouchEnd: function(e) {
    this.stopRecordMsg();
    this.setData({
      recordingTxt: "按住 说话"
    });
  },

  /*操作：点击了长按录音按钮 */
  handleClick: function(e) {

  },

  /*操作：长按录音按钮过程中 */
  handleLongPress: function(e) {},
  /*操作：滑动取消 */
  handleMove: function(e) {
    let that = this;
    let moveLenght = e.touches[e.touches.length - 1].clientY - that.data.startPoint.clientY; // 手指移动距离
    if (Math.abs(moveLenght) > 50) {
      wx.showToast({
        title: "松开手指,取消发送",
        icon: "none",
        duration: 60000
      });
      // 触发了上滑取消发送，上锁
      that.setData({
        sendRecordLock: false
      });
    } else {
      wx.showToast({
        title: "正在录音，上划取消发送",
        icon: "none",
        duration: 60000
      });
      // 上划距离不足，依然可以发送，不上锁
      that.setData({
        sendRecordLock: true
      });
    }
  },
  /*操作：长按录制语音消息 */
  startRecordMsg: function() {
    // 示例：使用微信官方的 RecorderManager 进行录音，参考 RecorderManager.start(Object object)
    // 1. 获取全局唯一的录音管理器 RecorderManager
    // 录音部分参数
    const recordOptions = {
      duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: "aac" // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
    };
    wx.showToast({
      title: "正在录音，上划取消发送",
      icon: "none",
      duration: 60000 // 先定义个60秒，后面可以手动调用wx.hideToast()隐藏
    });
    // 2.开始录音
    recorderManager.start(recordOptions);
    recorderManager.onStart(() => {});
    // 3.监听录音错误事件
    recorderManager.onError(function(errMsg) {
      console.warn(errMsg);
    });
  },

  /*操作：停止录音并发送 */
  stopRecordMsg: function() {
    let that = this;
    wx.hideToast(); // 结束录音、隐藏Toast提示框
    recorderManager.stop();
    recorderManager.onStop(function(res) {
      if (res.duration < 1000) {
        wx.showToast({
          title: "录音时间太短",
          icon: "none",
          duration: 1000
        });
      } else if (that.data.sendRecordLock) {
        // 4. 创建消息实例，接口返回的实例可以上屏
        const message = tim.createAudioMessage({
          to: that.data.inquiryInfo.keyID,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            file: res
          }
        });
        message.recordStatus = false; // 播放状态
        if (Number(message.payload.second) <= 15) {
          message.recordViewWidth = message.payload.second * 12 + 100; // 最大宽度不超过370,最小宽度要大于100
        } else {
          message.recordViewWidth = (Number(message.payload.second) - 15) * 2 + 280; // 最大宽度不超过370,最小宽度要大于100
        }
        let nowData = [...that.data.currentMessageList, message];
        that.setData({
          currentMessageList: nowData,
          maySendContent: ""
        });
        that.toViewBottomFun();
        // 5. 发送消息
        tim.sendMessage(message).then(function(imResponse) {
          // 发送成功
        }).catch(function(imError) {
          // 发送失败
          console.log(imError);
        });
      }
    });
  },

  /*操作：播放语音 */
  playRecordFun: function(e) {
    let that = this;
    wx.stopVoice(); // 停止播放所有音频
    that.initItemRecordStatusFun();
    let recordurl = e.currentTarget.dataset.recordurl; // 获取播放音频的路径
    that.data.innerAudioContext.src = recordurl; // 设置播放音频的路径
    that.setData({
      recordIndex: e.currentTarget.dataset.recordindex // 语音在数组中的下标
    });
    if (recordurl == that.data.recordFileUrl) {
      that.data.innerAudioContext.stop(); // 播放同一个语音时，将其停止
      that.setData({
        recordFileUrl: "",
        ["currentMessageList[" + that.data.recordIndex + "].recordStatus"]: false
      });
    } else {
      that.data.innerAudioContext.play(); //不是同一个语音 直接播放点击的音频，记录此次语音路径
      that.setData({
        recordFileUrl: recordurl,
        ["currentMessageList[" + that.data.recordIndex + "].recordStatus"]: true
      });
    }
  },

  /*操作：初始化音频图标 */
  initItemRecordStatusFun: function() {
    let that = this;
    if (that.data.recordIndex != "") {
      that.setData({
        ["currentMessageList[" + that.data.recordIndex + "].recordStatus"]: false
      });
    }
  },

  /*操作：视频通话 */
  videoWxFun: function(inqID) {
    /**
     * isCall 1主动发起视频
     * isCall 2接收发起视频
     */
    let inquiryID = '';
    let isCall = 1;
    if (inqID) {
      inquiryID = inqID;
      isCall = 2;
    };
    wx.navigateTo({
      url: '../../../../pages/online-inquiry/inquiry/video/room?isCall=' + isCall + '&inquiryID=' + inquiryID,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    console.log("--------跳转到视频-----------" + inquiryID);
  },

  /*操作：点击消息窗口 */
  clickViewCommunicationFun: function() {
    this.setData({
      isOpenBottomBoolbar: false
    });
  },

  /*操作：点击处方卡片消息查看详情 */
  toRpDetailFun: function(e) {
    let inquiryID = e.currentTarget.dataset.rpid;
    // console.log("inquiryID:" + inquiryID);
    if (inquiryID) {
      wx.navigateTo({
        url: '../../../personal-center/prescription-details/prescription-details?&inquiryID=' + inquiryID,
      });
    }
  }
})