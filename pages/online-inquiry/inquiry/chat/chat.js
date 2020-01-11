const app = getApp()
// const tim = app.tim
// const TIM = app.TIM
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var HTTP = require('../../../../utils/http-util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: "", // 手机屏幕自动滚动到达的位置
    userInfo: {}, // 当前用户信息
    // 多方对话对话信息
    talkInfo: {
      doctorInfo: {}, // 医生信息详情
      assistantInfo: {}, // 医助信息详情
      patientInfo: {}, // 患者信息详情
      multiTalkInfo: {} // 三者ID信息
    },
    inquiryInfo: {}, // 问诊信息
    // 聊天列表信息
    currentMessageList: [],
    nextReqMessageID: "", // 用于续拉，分页续拉时需传入该字段
    isCompleted: false, // 表示是否已经拉完所有消息
    httpLoading: false, // 是否请求中
    pageInfo: {
      pageIndex: 1,
      pageSize: 10
    },
    maySendContent: "", // 输入的聊天内容
    isOpenBottomBoolbar: false, // 是否打开工具栏
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
      },
      {
        title: "视频问诊",
        iconUrl: "../../../../images/chat/m-video.png",
        clickFun: "videoWxFun",
        isFifth: false
      }
    ],
    aimgurl: {}, // //临时图片的信息
    countIndex: 1, // 可选图片剩余的数量
    hidden: true, // 加载中是否隐藏
    scrollTop: 0, // 内容底部与顶部的距离
    isSendRecord: false,
    recordingTxt: "按住 说话",
    startPoint: "",
    sendRecordLock: true // 是否允许发送语音
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 从storage中获取患者信息
    that.getPersonInfo();
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
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    app.tim.on(app.TIM.EVENT.MESSAGE_RECEIVED, function(event) {
      let nowData = [...that.data.currentMessageList, ...event.data];
      that.setData({
        currentMessageList: nowData
      });
      that.toViewBottomFun();
    });
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
      return;
    }
    wx.showNavigationBarLoading(); //在标题栏中显示加载中的转圈效果
    app.tim.getMessageList({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID,
      nextReqMessageID: that.data.nextReqMessageID,
      count: 10
    }).then(function(imResponse) {
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
      key: 'personInfo',
      success: function(res) {
        that.setData({
          userInfo: res.data
        });
        if (that.data.userInfo.keyID) {
          // 查询患者的多方对话
          that.getPatientMultiTalk();
        }
      }
    })
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
      // 创建问诊
      that.createInquiry();
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
      // 获取历史消息
      that.getHistoryMessage();
    })
  },

  /*打开会话时,消息设置成已读 */
  setMessageRead: function() {
    let that = this;
    // 将某会话下所有未读消息已读上报
    app.tim.setMessageRead({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID
    });
    console.log("===消息设置成已读===");
  },

  /*打开会话时,获取最近消息列表 */
  getHistoryMessage: function() {
    let that = this;
    app.tim.getMessageList({
      conversationID: "GROUP" + that.data.inquiryInfo.keyID,
      count: 10
    }).then(function(imResponse) {
      that.setData({
        currentMessageList: imResponse.data.messageList,
        nextReqMessageID: imResponse.data.nextReqMessageID,
        isCompleted: imResponse.data.isCompleted
      });
      that.toViewBottomFun();
      }).catch(function (imError) {
        that.setData({
          hidden: true
        });
        console.warn("===请求异常===error:", imError);
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
  doctorDetailTap: function() {
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*操作：输入框聚焦，关闭工具栏 */
  closeBottomBoolbarFun() {
    // 有问题，需要修改
    this.setData({
      isOpenBottomBoolbar: false
    });
  },

  /*操作：输入预发送信息 */
  adInputChange: function(e) {
    this.setData({
      maySendContent: e.detail.value,
    })
  },

  /*操作：发送（文本消息） */
  sendContentMsg: function(e) {
    let that = this;
    if (that.data.httpLoading || !that.data.maySendContent) {
      return;
    }
    // 开启隐性加载过程
    that.data.httpLoading = true;
    // 1. 创建消息实例，接口返回的实例可以上屏
    let message = app.tim.createTextMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: app.TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        text: that.data.maySendContent
      }
    });
    // 2. 发送消息
    app.tim.sendMessage(message).then(function(imResponse) {
      let nowData = [...that.data.currentMessageList, imResponse.data.message];
      that.setData({
        currentMessageList: nowData,
        maySendContent: ""
      });
      that.data.httpLoading = false; // 关闭隐性加载过程
      that.toViewBottomFun();
    }).catch(function(imError) {
      console.warn("===发送失败===sendMessage error:", imError);
    });
  },

  /*操作：打开、关闭 底部工具栏 */
  isOpenBottomBoolbarFun: function() {
    this.setData({
      isOpenBottomBoolbar: !this.data.isOpenBottomBoolbar
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
    that.data.httpLoading = true; // 开启隐性加载过程
    // 1. 创建消息实例
    let message = app.tim.createImageMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: app.TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        file: that.data.aimgurl
      },
      onProgress: function(event) {} // 发送图片进度
    });
    // 2. 发送数据
    app.tim.sendMessage(message).then(function(imResponse) {
      let nowData = [...that.data.currentMessageList, imResponse.data.message];
      that.setData({
        currentMessageList: nowData,
        maySendContent: ""
      });
      that.data.httpLoading = false; // 关闭隐性加载过程
      that.toViewBottomFun();
    }).catch(function(imError) {
      console.warn("===发送图片失败===error:", imError);
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
  openKeyboardFun:function() {
    this.setData({
      isSendRecord: false
    });
  },

  /*操作：切换为语音 */
  willSendRecordMsg: function() {
    let that = this;
    that.setData({
      isSendRecord: true
    });
  },

  /*操作：开始长按录音按钮 */
  handleTouchStart: function (e) {
    // 记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
    this.startRecordMsg();
    this.setData({
      startPoint: e.touches[0],
      recordingTxt: "松开 结束",
      sendRecordLock: true
    });
    wx.showToast({
      title: "正在录音，上划取消发送",
      icon: "none",
      duration: 60000 // 先定义个60秒，后面可以手动调用wx.hideToast()隐藏
    });
  },

  /*操作：结束长按录音按钮 */
  handleTouchEnd: function (e) {
    wx.hideToast();// 结束录音、隐藏Toast提示框
    this.stopRecordMsg(); 
    this.setData({
      recordingTxt: "按住 说话"
    });
  },

  /*操作：点击了长按录音按钮 */
  handleClick: function (e) {
  },

  /*操作：长按录音按钮过程中 */
  handleLongPress: function (e) {
  },
  /*操作：滑动取消 */
  handleMove:function(e) {
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
    // 2.开始录音
    recorderManager.start(recordOptions);
    recorderManager.onStart(() => {});
    // 3.监听录音错误事件
    recorderManager.onError(function(errMsg) {
      console.warn("录音异常error:", errMsg);
    });
  },

  /*操作：停止录音并发送 */
  stopRecordMsg: function() {
    let that = this;
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
        const message = app.tim.createAudioMessage({
          to: that.data.inquiryInfo.keyID,
          conversationType: app.TIM.TYPES.CONV_GROUP,
          payload: {
            file: res
          }
        });
        console.log(message);
        // 5. 发送消息
        app.tim.sendMessage(message).then(function (imResponse) {
          console.log(imResponse);
          // 发送成功
          let nowData = [...that.data.currentMessageList, imResponse.data.message];
          that.setData({
            currentMessageList: nowData,
            maySendContent: ""
          });
          that.toViewBottomFun();
        }).catch(function (imError) {
          // 发送失败
          console.warn("sendRecord error:", imError);
        });
      }
    });
  },

  /*操作：播放语音 */
  playRecordFun: function(e) {
    innerAudioContext.src = e.currentTarget.dataset.recordurl;
    innerAudioContext.autoplay = true;
    innerAudioContext.onPlay(() => {
      // 开始播放
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    });
    innerAudioContext.onEnded(() => {
      innerAudioContext.stop();
      // 结束播放
    });
  },

  /*操作：视频通话 */
  videoWxFun: function() {
    console.log("视频啦");
    wx.navigateTo({
      // url: '../../../../pages/personal-center/health-information/health-information',
      url: '../../../../pages/online-inquiry/inquiry/video/room',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*操作：点击消息窗口 */
  clickViewCommunicationFun: function() {
    this.setData({
      isOpenBottomBoolbar: false
    });
    // this.toViewBottomFun();
  }
})