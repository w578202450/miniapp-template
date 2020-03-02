// pages/index/bhx/home-index.js
const app = getApp();
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houShiOrgID: "", // 太原侯丽萍风湿骨病医院的机构ID
    shareOrgID: "", // 进入页面携带的orgID
    shareAssistantStaffID: "", // 进入页面携带的医助ID
    // 首页banner
    bannerImage:"",
    // 医疗机构许可证
    certifyNo: "45081134X51012213A1002",
    // 用户浏览数
    browseCount: "0",
    // 用户分享数
    shareCount: "0",
    // 院长信息
    deanInfo: {},
    // 医院信息
    hospitalInfo: {},
    serviceBg: '/images/home/home_service_bg.png',
    goodAts: ["风湿骨科", "针灸"],
    isShowAllContent: false, 
    deanIntroduceData: [], // 院长介绍
    // 院长详细介绍
    deanDetailContent: "太原侯丽萍风湿骨病中医医院院长，北京中医药大学博士生导师，山西省名中医，国家中医药管理局重点专科…",
    hospitalDetailContent: "太原侯丽萍风湿骨病中医医院系国家中医药管理局“十五”、“十一五”、“十二五”风湿病重点专科医院、太原市二级甲等中医专科医院、山西中医学院教学医院、山西中医类风…",
    // 医师团队介绍
    // doctorTeamIntroduce:"侯氏团队在线亲诊解决风湿骨病疑难问题"
    doctorTeamIntroduce: "",
    // 医师团队列表
    doctorTeamList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   *  /**
   * 1.options无参
   *   （1）通过搜索小程序进入时
   * 2.options有参
   *   （1）通过扫码进入时： "q" 的值为url带参
   *   （2）通过分享的小程序进入时：直接带参
   *
   */
  onLoad: function (options) {
    let that = this;
    console.log("进入侯丽萍首页携带的参数：" + JSON.stringify(options));
    if (options) {
      if (options.q) { // 通过扫码进入时：q的值为url带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        var scan_url = decodeURIComponent(options.q);
        let shareOrgID = that.initOptionsFun(scan_url, "orgID");
        let shareAssistantStaffID = that.initOptionsFun(scan_url, "assistantStaffID");
        that.data.shareOrgID = shareOrgID ? shareOrgID : "";
        wx.setStorageSync("shareOrgID", shareOrgID);
        that.data.shareAssistantStaffID = shareAssistantStaffID ? shareAssistantStaffID : "";
        wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
      } else if (options.assistantStaffID) { // 通过分享的小程序进入时：直接带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        if (options.orgID) {
          that.data.shareOrgID = options.orgID;
          wx.setStorageSync("shareOrgID", options.orgID);
        }
        if (options.assistantStaffID) {
          that.data.shareAssistantStaffID = options.assistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
        }
      };
      that.initHomeData();
    }
    // 如果orgID不等于侯丽萍医院的orgID，则直接跳转到专家问诊页
    if (that.data.shareOrgID != that.data.houShiOrgID) {
      wx.switchTab({
        url: '/pages/index/service-index/service-index?orgID=' + that.data.shareOrgID + '&assistantStaffID=' + that.data.shareAssistantStaffID
      });
    }
  },

  /** 初始化数据 */
  initHomeData: function () {
    let that = this;
    that.getBanner(that.data.houShiOrgID); // 获取首页banner
    that.getTeamIntroduce(); // 获取医师团队介绍
    that.getBrowseCount(); // 获取用户浏览数
    that.getShareCount(); // 获取用户分享数
    that.getPhysicianTeamList(); // 获取医师团队列表
  },

  /** 获取首页banner */
  getBanner(houShiOrgID) {
    let that = this;
    HTTP.getBannerTeamIntroduce({
      // orgID: that.data.houShiOrgID,
      orgID: "19072514430966516270514001",
      groupCode: "OP_TMC_ORG",
      paraCode: "OP_TMC_ORG_BANNER"
    })
      .then(res => {
        console.log("===首页banner===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              bannerImage: res.data.paraValue
            });
          }
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
  },

  /** 获取医师团队介绍 */
  getTeamIntroduce(houShiOrgID) {
    let that = this;
    HTTP.getBannerTeamIntroduce({
      // orgID: that.data.houShiOrgID,
      orgID: "19072514430966516270514001",
      groupCode: "OP_TMC_ORG",
      paraCode: "OP_TMC_ORG_GROUPDESC"
    })
      .then(res => {
        // console.log("===获取医师团队介绍===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              doctorTeamIntroduce: res.data.paraValue
            });
          }
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
  },

  /** 获取用户浏览数 */
  getBrowseCount(houShiOrgID) {
    let that = this;
    HTTP.getBrowseShareCount({
      // orgID: that.data.houShiOrgID,
      orgID: "19072514430966516270514001",
      groupCode: "OV_TMC_USER",
      paraCode: "OV_TMC_USER_VIEWS"
    })
      .then(res => {
        // console.log("===获取用户浏览数===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              browseCount: res.data.paraValue
            });
          }
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
  },

  /** 获取用户分享数 */
  getShareCount(houShiOrgID) {
    let that = this;
    HTTP.getBrowseShareCount({
      // orgID: that.data.houShiOrgID,
      orgID: "19072514430966516270514001",
      groupCode: "OV_TMC_USER",
      paraCode: "OV_TMC_USER_SHARES"
    })
      .then(res => {
        // console.log("===获取用户分享数===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              shareCount: res.data.paraValue
            });
          }
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
  },

  /** 获取医师团队列表 */
  getPhysicianTeamList(houShiOrgID) {
    let that = this;
    HTTP.getPhysicianTeamList({
      // orgID: that.data.houShiOrgID,
      orgId: "19072514430966516270514001"
    })
      .then(res => {
        console.log("===获取医师团队列表===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              doctorTeamList: res.data
            });
          }
        } else {
          that.setData({
            doctorTeamList: ""
          });
        }
      }).catch(e => {
        that.setData({
          noNetwork: true
        });
      })
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
    return commonFun.onShareAppMessageFun();
  },

  /**转换传递的url参数 q */
  initOptionsFun: function (scan_url, name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = scan_url.match(reg);
    if (arr != null) {
      return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    } else {
      return "";
    }
  },

  /**操作：立即进入专家门诊 */
  toServiceIndexFun: function () {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  }
})