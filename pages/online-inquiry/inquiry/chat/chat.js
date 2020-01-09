const app = getApp()
const tim = app.tim
const TIM = app.TIM
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
      patientInfo: {},  // 患者信息详情
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
    scrollTop: ""
  },

  // 点击医生查看详情
  doctorDetailTap: function () {
    wx.navigateTo({
      url: '/pages/online-inquiry/doctor-details/doctor-details',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 从storage中获取患者信息
  getPersonInfo: function () {
    let that = this;
    wx.getStorage({
      key: 'personInfo',
      success: function (res) {
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

  // 查询患者的多方对话
  getPatientMultiTalk: function () {
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

  // 创建问诊
  createInquiry: function () {
    let that = this;
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

  // 打开会话时,消息设置成已读
  setMessageRead: function () {
    let that = this;
    // 将某会话下所有未读消息已读上报
    tim.setMessageRead({ conversationID: "GROUP" + that.data.inquiryInfo.keyID });
    console.log("===消息设置成已读===");
  },

  // 打开会话时,获取最近消息列表
  getHistoryMessage: function () {
    let that = this;
    let promise = tim.getMessageList({ conversationID: "GROUP" + that.data.inquiryInfo.keyID, count: 10 });
    promise.then(function (imResponse) {
      that.setData({
        currentMessageList: imResponse.data.messageList,
        nextReqMessageID: imResponse.data.nextReqMessageID,
        isCompleted: imResponse.data.isCompleted
      });
      // 滚动：信息底部
      that.toViewBottomFun();
    });

  },

  // // 下拉加载历史消息列表
  // getHistoryMessageNext: function () {
  //   let that = this;
  //   let promise = tim.getMessageList({ conversationID: "GROUP" + that.data.inquiryInfo.keyID, nextReqMessageID: that.data.nextReqMessageID, count: 10 });
  //   promise.then(function (imResponse) {
  //     const messageList = imResponse.data.messageList; // 消息列表
  //     console.log(JSON.stringify(messageList));
  //     that.data.currentMessageList = [...messageList, ...that.data.currentMessageList];
  //     console.log(that.data.currentMessageList);
  //     setTimeout(function () {
  //       wx.hideNavigationBarLoading(); // 完成数据操作后停止标题栏中的加载中的效果
  //       wx.stopPullDownRefresh(); // 停止下拉刷新过程
  //       console.log("------停止刷新------");
  //     }, 2000)
  //   });
  // },

  /*滚动：消息底部 */
  toViewBottomFun: function () {
    // 设置屏幕自动滚动到最后一条消息处
    this.setData({
      toView: `item${this.data.currentMessageList.length - 1}`
    });
  },

  /*输入框聚焦，关闭工具栏 */
  closeBottomBoolbarFun() {
    // 有问题，需要修改
    // this.setData({
    //   isOpenBottomBoolbar: false,
    //   toView: `item${this.data.currentMessageList.length - 1}`
    // });
  },

  /*操作：输入预发送信息 */
  adInputChange: function (e) {
    this.setData({
      maySendContent: e.detail.value,
    })
  },

  /*操作：点击工具栏某功能 */
  toolbarMenusFun: function (e) {
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
  chooseWxImage: function () {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["album"],
      success: function (res) {
        // 选择图片完成后的确认操作
        that.setData({
          aimgurl: res
        });
        // 发送图片消息
        that.sendImageMsg();
      }
    })
  },

  /*操作：打开相机 */
  cameraWxFun: function () {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: ["camera"],
      success: function (res) {
        // 选择图片完成后的确认操作
        that.setData({
          aimgurl: res
        });
        // 发送图片消息
        that.sendImageMsg();
      }
    })
  },

  /*操作：发送（图片消息） */
  sendImageMsg: function () {
    let that = this;
    if (that.httpLoading) {
      return;
    }
    // 开启隐性加载过程
    that.httpLoading = true;
    // 1. 创建消息实例
    let message = tim.createImageMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        file: that.data.aimgurl
      },
      onProgress: function (event) { } // 发送图片进度
    });
    // 2. 发送图片
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      let nowData = [...that.data.currentMessageList, imResponse.data.message];
      that.setData({
        currentMessageList: nowData,
        maySendContent: ""
      });
      // 关闭隐性加载过程
      that.httpLoading = false;
      that.toViewBottomFun();
    }).catch(function (imError) {
      // 发送失败
      console.warn('===发送图片失败===sendMessage error:', imError);
    });
  },

  /*操作：发送（文本消息） */
  sendContentMsg: function (e) {
    let that = this;
    if (that.httpLoading || !that.data.maySendContent) {
      return;
    }
    // 开启隐性加载过程
    that.httpLoading = true;
    //------------------------------发送文本消息------------------------------
    // 1. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createTextMessage({
      to: that.data.inquiryInfo.keyID, // 群ID
      conversationType: TIM.TYPES.CONV_GROUP, // 群聊
      payload: {
        text: that.data.maySendContent
      }
    });
    // 2. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      let nowData = [...that.data.currentMessageList, imResponse.data.message];
      that.setData({
        currentMessageList: nowData,
        maySendContent: ""
      });
      // 关闭隐性加载过程
      that.httpLoading = false;
      that.toViewBottomFun();
    }).catch(function (imError) {
      // 发送失败
      console.warn("===发送失败===sendMessage error:", imError);
    });
    //------------------------------发送文本消息------------------------------

    //------------------------------发送语音消息------------------------------
    // // 示例：使用微信官方的 RecorderManager 进行录音，参考 RecorderManager.start(Object object)
    // // 1. 获取全局唯一的录音管理器 RecorderManager
    // const recorderManager = wx.getRecorderManager();

    // // 录音部分参数
    // const recordOptions = {
    //   duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
    //   sampleRate: 44100, // 采样率
    //   numberOfChannels: 1, // 录音通道数
    //   encodeBitRate: 192000, // 编码码率
    //   format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
    // };

    // // 2.1 监听录音错误事件
    // recorderManager.onError(function(errMsg) {
    //   console.warn('recorder error:', errMsg);
    // });
    // // 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
    // recorderManager.onStop(function(res) {
    //   console.log('recorder stop', res);

    //   // 4. 创建消息实例，接口返回的实例可以上屏
    //   const message = tim.createAudioMessage({
    //     to: that.data.peerID,
    //     conversationType: TIM.TYPES.CONV_C2C,
    //     payload: {
    //       file: res
    //     }
    //   });

    //   // 5. 发送消息
    //   let promise = tim.sendMessage(message);
    //   promise.then(function(imResponse) {
    //     // 发送成功
    //     console.log(imResponse);
    //   }).catch(function(imError) {
    //     // 发送失败
    //     console.warn('sendMessage error:', imError);
    //   });
    // });

    // // 3. 开始录音
    // recorderManager.start(recordOptions);
    //------------------------------发送语音消息------------------------------
  },

  /*操作：视频通话 */
  videoWxFun: function () {
    console.log("视频啦");
    wx.navigateTo({
      // url: '../../../../pages/personal-center/health-information/health-information',
      url: '../../../../pages/online-inquiry/inquiry/video/room',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /*操作：点击消息窗口 */
  clickScrollViewFun: function () {
    this.setData({
      isOpenBottomBoolbar: false,
      toView: `item${this.data.currentMessageList.length - 1}`
    });
  },

  /*操作：打开、关闭 底部工具栏 */
  isOpenBottomBoolbarFun: function () {
    this.setData({
      isOpenBottomBoolbar: !this.data.isOpenBottomBoolbar,
      toView: `item${this.data.currentMessageList.length - 1}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 从storage中获取患者信息
    that.getPersonInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
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
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let promise = tim.logout();
    promise.then(function (imResponse) {
      console.log("===登出成功===" + imResponse.data); // 登出成功
    }).catch(function (imError) {
      console.warn('logout error:', imError);
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 操作：下拉加载数据
  onPullDownRefresh: function () {
    let that = this;
    if (that.data.isCompleted) {
      // 没有更多数据了
      wx.stopPullDownRefresh();
      return;
    }
    wx.showNavigationBarLoading(); //在标题栏中显示加载中的转圈效果
    let promise = tim.getMessageList({ conversationID: "GROUP" + that.data.inquiryInfo.keyID, nextReqMessageID: that.data.nextReqMessageID, count: 10 });
    promise.then(function (imResponse) {
      setTimeout(function () {
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})