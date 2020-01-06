// pages/online-inquiry/inquiry/chat/chat.js
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
    userInfo: { keyID: "" },
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
      // { keyID: "1", type: "TIM.TYPES.MSG_TEXT", personID: "111", personName: "大娃", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "医生，你好，我生病了。" },
      // { keyID: "2", type: "TIM.TYPES.MSG_TEXT", personID: "222", personName: "胡助理", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "什么病？" },
      // { keyID: "3", type: "TIM.TYPES.MSG_TEXT", personID: "333", personName: "路医生", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "请描述的详细一些，方便我们诊断。请描述的详细一些，方便我们诊断。请描述的详细一些，方便我们诊断。" },
      // { keyID: "4", type: "TIM.TYPES.MSG_TEXT", personID: "111", personName: "大娃", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "脑壳痛，胸口闷，我有一点昏。脚杆青痛感觉不对头。" },
      // { keyID: "5", type: "TIM.TYPES.MSG_TEXT", personID: "111", personName: "大娃", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "脑壳痛，胸口闷，我有一点昏。脚杆青痛感觉不对头。" },
      // { keyID: "6", type: "TIM.TYPES.MSG_IMAGE", personID: "111", personName: "大娃", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "", imgInfo: { imgUrl: "../../../../images/home/home_doctor.png" } },
      // { keyID: "7", type: "TIM.TYPES.MSG_AUDIO", personID: "111", personName: "大娃", addTime: "2019-12-28 10:03:00", faceImage: "../../../../images/home/home_doctor.png", msgText: "", payload: { second: 5 } }
    ],
    // 输入的聊天内容
    maySendContent: ""
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

  /*输入预发送信息 */
  adInputChange: function (e) {
    let that = this;
    // if (e.detail.value.length < 1) {
    //   this.maySendContent = "";
    // } else {
    //   // that.setData({
    //   //   adTitle: e.detail.value,
    //   // })
    //   this.maySendContent = e.detail.value;
    // }
     that.setData({
       maySendContent: e.detail.value,
      })
    console.log(that.maySendContent);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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