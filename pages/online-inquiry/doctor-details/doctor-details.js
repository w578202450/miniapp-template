const HTTP = require('../../../utils/http-util')
const commonFun = require('../../../utils/common')
const app = getApp();

Page({
  data: {
    screenWidth: app.globalData.systemInfo.screenWidth,
    list: [{
      name: '张**',
      leve: '2',
      content: '医生的回答很好的解决了我的问题，很不错。'
    }]
  },

  onLoad: function(e) {
    let doctorStaffID = e.staffID;
    this.fetchDoctorInfo(doctorStaffID)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

  /**
   * 医师信息
   */
  fetchDoctorInfo(doctorStaffID) {
    var that = this;
    HTTP.getDoctorInfo({
      staffID: doctorStaffID
      })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.setData({
              doctorInfo: res.data
            });
            this.getDoctorDiseaseByDoctorID(res.data.doctorID);
            this.getOrderCommentData(res.data.orgID, doctorStaffID);
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  },

  /**
   * 获取专治病
   */
  getDoctorDiseaseByDoctorID(doctorId) {
    var that = this;
    HTTP.getDoctorDiseaseByDoctorID({
        doctorID: doctorId
      })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            var disease = []
            for (var index in res.data) {
              disease.push(res.data[index].diseaseName)
            }
            this.setData({
              disease: disease.join(',')
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      }).catch(e => {
        wx.showToast({
          title: '连接失败',
          icon: 'none'
        })
      })
  },
  /**
   * 查询：患者评价信息
   */
  getOrderCommentData: function (orgID, doctorStaffID) {
    let that = this;
    let params = {
      orgID: orgID,
      doctorStaffID: doctorStaffID
    };
    HTTP.orderCommentGet(params).then(res => {
      // console.log("获取的患者评价信息：" + JSON.stringify(res.data));
      if (res.code == 0 && res.data) {
        that.setData({
          ["evaluateAllData.evaluateData"]: res.data,
          ["evaluateAllData.doctorID"]: doctorStaffID,
          ["evaluateAllData.orgID"]: orgID
        });
      } else {
        that.setData({
          ["evaluateAllData.evaluateData"]: [],
          ["evaluateAllData.doctorID"]: doctorStaffID,
          ["evaluateAllData.orgID"]: orgID
        });
      }
    });
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  },

  // 去问诊
  goInquiry: function () {
    console.log("--------去问诊---------");
    if (app.globalData.isInitInfo == "ready") {
      wx.navigateTo({
        url: '/pages/online-inquiry/inquiry/chat/chat'
      });
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  },
  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  }
})