const app = getApp()
const tim = app.tim
const TIM = app.TIM

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '',
    // 用户信息
    userInfo: {
      keyID: "111",
      patientName: "大娃",
      faceImage: "../../../../images/home/home_doctor.png"
    },
    // 对话信息
    talkInfo: {
      patientInfo: {
        keyID: "111"
      },
      assistantInfo: {
        keyID: "222"
      },
      doctorInfo: {
        keyID: "333"
      }
    },
    // 聊天列表信息
    currentMessageList: [
      {
        keyID: "1",
        type: "TIM.TYPES.MSG_TEXT",
        personID: "111",
        personName: "大娃",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "医生，你好，我生病了。"
      },
      {
        keyID: "2",
        type: "TIM.TYPES.MSG_TEXT",
        personID: "222",
        personName: "胡助理",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "什么病？"
      },
      {
        keyID: "3",
        type: "TIM.TYPES.MSG_TEXT",
        personID: "333",
        personName: "路医生",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "请描述的详细一些，方便我们诊断。"
      },
      {
        keyID: "4",
        type: "TIM.TYPES.MSG_TEXT",
        personID: "111",
        personName: "大娃",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "脑壳痛，胸口闷，我有一点昏。脚杆青痛感觉不对头。"
      },
      {
        keyID: "5",
        type: "TIM.TYPES.MSG_IMAGE",
        personID: "111",
        personName: "大娃",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "",
        imgInfo: {
          imgUrl: "../../../../images/home/home_doctor.png"
        }
      },
      {
        keyID: "6",
        type: "TIM.TYPES.MSG_AUDIO",
        personID: "111",
        personName: "大娃",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "",
        payload: {
          second: 5
        }
      }
    ],
    httpLoading: false,
    pageInfo: {
      pageIndex: 1,
      pageSize: 10
    },
    maySendContent: "", // 输入的聊天内容
    isOpenBottomBoolbar: false, // 是否打开工具栏
    toolbarMenus: [{
        title: "图片",
        iconUrl: "../../../../images/chat/m-image.png",
        isFifth: false
      },
      {
        title: "拍照",
        iconUrl: "../../../../images/chat/m-camera.png",
        isFifth: false
      },
      {
        title: "视频问诊",
        iconUrl: "../../../../images/chat/m-video.png",
        isFifth: false
      }
    ],
    aimgurl: "", // //临时图片的路径
    countIndex: 1, // 可选图片剩余的数量
    imageData: [] // 所选上传的图片数据
  },

  /*查询：列表聊天历史信息 */
  getMsgListFun: function() {
    // 初始化数据
    //     that.setData({
    //       currentMessageList: res.data,
    //       maySendContent: ""
    //     });
    // 设置屏幕自动滚动到最后一条消息处
    this.setData({
      toView: `item${this.data.currentMessageList.length - 1}`
    });
  },

  /*输入框聚焦，关闭工具栏 */
  closeBottomBoolbarFun() {
    // 有问题，需要修改
    // this.setData({
    //   isOpenBottomBoolbar: false
    // });
  },

  /*操作：输入预发送信息 */
  adInputChange: function(e) {
    this.setData({
      maySendContent: e.detail.value,
    })
  },

  /*图片浏览及上传 */
  browse: function (e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#CED63A",
      success: function (res) {
        // console.log(res)
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album');
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera');
          }
        }
      }
    })
  },
 //------------------------------发送图片消息------------------------------
  /*打开相册、相机 */
  // 1. 选择图片
  chooseWxImage: function (type) {
    let that = this;
    wx.chooseImage({
      count: that.data.countIndex,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // 选择图片完成后的确认操作(只选一张，目前 SDK 不支持一次发送多张图片)
        that.setData({
          aimgurl: res.tempFilePaths
        });
        // // 2. 创建消息实例
        let message = tim.createImageMessage({
          to: 'user1',
          conversationType: TIM.TYPES.CONV_C2C,
          payload: { file: that.data.aimgurl[0] },
          onProgress: function (event) { console.log('file uploading:', event) }
        });
        // 3. 发送图片消息
        let promise = tim.sendMessage(message);
        promise.then(function (imResponse) {
          // 发送成功
          console.log("===发送图片消息成功===" +imResponse);
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      }
    })
  },
  //------------------------------发送图片消息------------------------------

  /*操作：发送（消息） */
  sendContentMsg: function(e) {
    let that = this;
    if (that.httpLoading) {
      return;
    }
    // 开启隐性加载过程
    that.httpLoading = true;
    //------------------------------发送文本消息------------------------------
    // 1. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createTextMessage({
      to: 'user1',
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text: that.data.maySendContent
      }
    });
    // 2. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function(imResponse) {
      // 发送成功
      console.log("===发送文本消息成功===" + imResponse);
      let nowData = [...that.data.currentMessageList, obj];
      that.setData({
        currentMessageList: nowData,
        maySendContent: ""
      });
      // 关闭隐性加载过程
      that.httpLoading = false;
      that.getMsgListFun();
    }).catch(function(imError) {
      // 发送失败
      // console.warn("===发送失败===" + 'sendMessage error:', imError);
    });
   //------------------------------发送文本消息------------------------------

  //------------------------------发送语音消息------------------------------
    // 示例：使用微信官方的 RecorderManager 进行录音，参考 RecorderManager.start(Object object)
    // 1. 获取全局唯一的录音管理器 RecorderManager
    const recorderManager = wx.getRecorderManager();

    // 录音部分参数
    const recordOptions = {
      duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
    };

    // 2.1 监听录音错误事件
    recorderManager.onError(function (errMsg) {
      console.warn('recorder error:', errMsg);
    });
    // 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
    recorderManager.onStop(function (res) {
      console.log('recorder stop', res);

      // 4. 创建消息实例，接口返回的实例可以上屏
      const message = tim.createAudioMessage({
        to: 'user1',
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          file: res
        }
      });

      // 5. 发送消息
      let promise = tim.sendMessage(message);
      promise.then(function (imResponse) {
        // 发送成功
        console.log(imResponse);
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    });

    // 3. 开始录音
    recorderManager.start(recordOptions);
  //------------------------------发送语音消息------------------------------
  },

  /*打开、关闭 底部工具栏 */
  isOpenBottomBoolbarFun() {
    this.setData({
      isOpenBottomBoolbar: !this.data.isOpenBottomBoolbar
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查询：聊天列表信息
    this.getMsgListFun();
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
  onPullDownRefresh: function() {

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

  }
})