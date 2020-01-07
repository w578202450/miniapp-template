const app = getApp()
const tim = app.tim
const TIM = app.TIM

Page({

  /**
   * 页面的初始数据
   */
  onShareAppMessage() {
    return {
      title: 'scroll-view'
    }
  },

  data: {
    toView: 'green',
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
    currentMessageList: [{
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
        msgText: "请描述的详细一些，方便我们诊断。请描述的详细一些，方便我们诊断。请描述的详细一些，方便我们诊断。"
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
        type: "TIM.TYPES.MSG_TEXT",
        personID: "111",
        personName: "大娃",
        addTime: "2019-12-28 10:03:00",
        faceImage: "../../../../images/home/home_doctor.png",
        msgText: "脑壳痛，胸口闷，我有一点昏。脚杆青痛感觉不对头。"
      },
      {
        keyID: "6",
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
        keyID: "7",
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
    toolbarMenus: [
      { title: "图片", iconUrl: "../../../../images/chat/m-image.png", isFifth: false },
      { title: "拍照", iconUrl: "../../../../images/chat/m-camera.png", isFifth: false },
      { title: "视频问诊", iconUrl: "../../../../images/chat/m-video.png", isFifth: false }
    ]
  },

  upper(e) {
    console.log(e)
  },

  lower(e) {
    console.log(e)
  },

  scroll(e) {
    console.log(e)
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  /*查询：列表聊天历史信息 */
  getMsgListFun: function() {
    if (this.data.pageInfo.pageIndex == 1) {
      this.setData({
        toView: `item${this.data.currentMessageList.length - 1}`
      });
    }
    console.log(this.data.toView);
    // let that = this;
    // let params = {
    //   patientID: that.data.userInfo.keyID,
    //   orgID: that.data.userInfo.orgID
    // };
    // wx.request({
    //   url: "",
    //   data: params,
    //   success(res) {
    //     console.log(res.data);
    //     that.setData({
    //       currentMessageList: res.data,
    //       // pageInfo: res.pageInfo,
    //       maySendContent: ""
    //     });
    //     if (that.data.pageInfo.pageIndex == 1) {
    //       that.setData({
    //         toView: `item${that.data.currentMessageList.length}`
    //       });
    //     }
    //   }
    // })
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

  /*操作：发送（消息） */
  sendContentMsg: function(e) {
    let that = this;
    if (that.httpLoading) {
      return;
    }
    that.httpLoading = true;
    let time = new Date();
    let m = time.getMonth() + 1;
    m = m > 10 ? m : ("0" + m);
    let d = time.getDate();
    d = d > 10 ? d : ("0" + d);
    let h = time.getHours();
    h = h > 10 ? h : ("0" + h);
    let minute = time.getMinutes();
    minute = minute > 10 ? minute : ("0" + minute);
    let seconds = time.getSeconds();
    seconds = seconds > 10 ? seconds : ("0" + seconds);
    let nowDateTime = time.getFullYear() + "-" + m + "-" + d + " " + h + ":" + minute + ":" + seconds;
    let obj = {
      keyID: Number(that.data.currentMessageList[that.data.currentMessageList.length - 1].keyID) + 1,
      type: "TIM.TYPES.MSG_TEXT",
      personID: that.data.userInfo.keyID,
      personName: that.data.userInfo.patientName,
      addTime: nowDateTime,
      faceImage: that.data.userInfo.faceImage,
      msgText: that.data.maySendContent
    };
    let nowData = [...that.data.currentMessageList, obj];
    that.setData({
      currentMessageList: nowData,
      maySendContent: ""
    });
    that.httpLoading = false;

    // wx.request({
    //   url: "",
    //   data: obj,
    //   success(res) {
    //     console.log(res.data);
    //     that.getMsgListFun();
    //   }
    // })

    // 发送文本消息，Web 端与小程序端相同
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
    promise.then(function (imResponse) {
      // 发送成功
      console.log(imResponse);
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
    that.getMsgListFun();
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