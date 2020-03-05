const HTTP = require('../../../utils/http-util')
const commonFun = require('../../../utils/common')
let app = getApp()

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
    var staffID = e.staffID
    this.fetchDoctorInfo(staffID)
  },

  /**
   * 医师信息
   */
  fetchDoctorInfo(doctorId) {
    var that = this;
    HTTP.getDoctorInfo({
        staffID: doctorId
      })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.setData({
              doctorInfo: res.data
            })
            this.getDoctorDiseaseByDoctorID(res.data.doctorID)
            this.getOrderCommentData(res.data.orgID, doctorId)
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
      orgID: orgID
    };
    HTTP.orderCommentGet(params).then(res => {
      // console.log("获取的患者评价信息：" + JSON.stringify(res.data));
      if (res.code == 0 && res.data) {
        that.setData({
          ["evaluateAllData.evaluateData"]: res.data,
          ["evaluateAllData.doctorID"]: doctorStaffID,
          ["evaluateAllData.orgID"]: orgID
        });
      }
    });
  },
  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  }
})