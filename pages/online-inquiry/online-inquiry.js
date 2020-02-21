//index.js
//获取应用实例

const HTTP = require('../../utils/http-util')
const app = getApp()
const commonFun = require('../../utils/common.js')

Page({
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    screenHeight: app.globalData.systemInfo.screenHeight,
    screenWidth: app.globalData.systemInfo.screenWidth,
    pixelRatio: app.globalData.systemInfo.pixelRatio,
    isSearchState: false // 是否第一次加载
  },

  onLoad: function() {
    // console.log('---用户端系统信息---', app.globalData.systemInfo);
    this.initDocInfoFun();
  },

  // 返回页面时，刷新数据
  onShow: function() {
    let that = this;
    if (that.data.isSearchState) {
      that.initDocInfoFun();
    }
  },

  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  },

  userInfoHandler: function() {

  },

  initDocInfoFun: function() {
    let that = this;
    wx.getStorage({
      key: 'personInfo',
      success: function(res) {
        console.log("获取用户缓存信息成功：" + JSON.stringify(res));
        that.fetchDoctorInfo(res.data.doctorStaffID); // 获取主治医师信息
        that.fetchAssistantDoctorInfo(res.data.assistantStaffID); // 获取助理医生信息
      },
      fail: function(err) {
        console.log("获取用户缓存信息失败：" + JSON.stringify(err));
        that.getDefaultDocInfoFun();
      },
      complete: function(e) {
        that.setData({
          isSearchState: true
        });
      }
    });
  },

  /**获取主治医师信息*/
  fetchDoctorInfo(staffID) {
    let that = this;
    HTTP.getDoctorInfo({
        staffID: staffID
      })
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          if (res.data) {
            app.globalData.doctorInfo = res.data;
            wx.setStorageSync('doctorInfo', res.data);
            // that.fetchDoctorQualification(res.data.doctorID); // 获取医生资质编号
            that.setData({
              doctorInfo: res.data,
              orgName: app.globalData.orgName
            });
          }
        }
      }).catch(e => {
        wx.hideLoading();
        that.setData({
          noNetwork: true
        });
      })
  },

  /**获取助理医生信息 */
  fetchAssistantDoctorInfo(staffID) {
    let that = this;
    HTTP.getDoctorInfo({
        staffID: staffID
      })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            wx.setStorageSync('assistantInfo', res.data);
            app.globalData.assistantInfo = res.data;
            that.setData({
              assistantDoctorInfo: res.data
            });
          }
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
  },

  /**获取医生资质编号 */
  fetchDoctorQualification(doctorID) {
    let that = this;
    HTTP.getDoctorQualification({
        doctorID: doctorID,
        certifyCode: 'PROFESSION'
      })
      .then(res => {
        if (res.code == 0) {
          that.setData({
            certifyInfo: res.data
          })
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        })
      })
  },

  /**操作：点击查看医生详情 */
  doctorDetailTap: function(e) {
    let index = e.currentTarget.dataset.index;
    let staffID = index == '0' ? app.globalData.personInfo.doctorStaffID : app.globalData.personInfo.assistantStaffID;
    if (staffID) {
      wx.navigateTo({
        url: '/pages/online-inquiry/doctor-details/doctor-details?staffID=' + staffID,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
    }
  },

  /**操作：开始问诊 */
  toOnlineInqueryFun: function() {
    let that = this;
    wx.navigateTo({
      url: '/pages/login/login?pageName=' + 'online-inquiry'
    });
  },

  /**查询：无缓存患者信息时，查询默认推荐医生信息 */
  getDefaultDocInfoFun: function() {
    let that = this;
    HTTP.getDefaultDocInfo({
        orgID: "",
        assistantStaffID: "",
        entryType: ""
      })
      .then(res => {
        console.log("获取临时推荐医生信息成功：" + JSON.stringify(res));
        if (res.code == 0) {
          wx.setStorageSync('personInfo', res.data);
          that.fetchDoctorInfo(res.data.doctorStaffID); // 获取主治医师信息
          that.fetchAssistantDoctorInfo(res.data.assistantStaffID); // 获取助理医生信息
        }
      }).catch(e => {
        // wx.showToast({
        //   title: '数据异常，请重新进入小程序',
        //   icon: none,
        //   duration: 3000
        // });
      })
  }
})