// pages/index/home-index/home-index.js
const app = getApp();
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearchState: false, // 是否进行了一次加载
    /**
     * 侯丽萍开发环境ID： 19101017081245518100511003
     * 侯丽萍测试环境ID： 19121923373037086560511253
     * 侯氏生产环境ID： 20012118570385423810511240
     * 默认医院  19101017081245502880511001
     */
    isAboveHouShiID: -1, // 是否显示侯氏信息，默认-1显示
    houShiOrgID: [], // 太原侯丽萍风湿骨病医院的机构ID
    shareOrgID: "", // 进入页面携带的orgID
    shareAssistantStaffID: "", // 进入页面携带的医助ID
    homeBannerDefaultUrl: "/images/home/home_banner_default.png", // 首页banner
    certifyNo: "45081134X51012213A1002", // 医疗机构许可证
    browseCount: 0, // 用户浏览数
    shareCount: 0, // 用户分享数
    deanInfo: {
      deanPhotoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/2381/houliping.png",
      deanName: "侯丽萍", // 院长名称
      titleName: "院长", // 职位名称
      deanDuty: "主任医师 北京中医药大学博士生导师", // 职称
      deanFamous: "名中医 侯氏三焦气化疗法创始人", // 专长
      goodAts: ["风湿骨病", "疑难杂症"], //擅长
      // 院长详细介绍
      deanDetailContent: "御医传人名老中医石广济弟子，全国优秀中医人才指导老师，中国风湿病学专家、学科带头人，日本东洋医学研究院名誉教授，莫斯科第十医院名誉院长。",
    }, // 院长信息
    hospitalInfo: {
      hospitalPhotoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/2381/yiyuan.png",
      hospitalName: "侯丽萍风湿骨病中医医院",
      hospitalIntroduce: "中医治风湿骨病",
      hospitalDetailContent: "国家中医药管理局“十五”、“十一五”“十二五”风湿病重点专科医院，山西省二级甲等中医专科医院，山西中医学院教学医院，山西省中医研究院附属医院，国家级重点专科（专病…"
    }, // 医院信息
    isShowAllContent: false,
    doctorTeamIntroduce: "", // 医师团队介绍
    newArrayDoctorList: [], // 组合的新数组
    signedDoctor: {}, // 患者签约的医生
    hospitalDetail: {}, // 医院信息
    isHaveWatched: false // 是否监听到变化了一次
  },

  /**
   * 生命周期函数--监听页面加载
   *  /**
   * 1.options无参
   *   （1）通过搜索小程序进入时
   * 2.options有参
   *   （1）通过扫码进入时： "q" 的值为url带参 
   *   （2）通过分享的小程序进入时：直接带参
   */
  onLoad: function(options) {
    let that = this;
    // 生产
    // 侯丽萍
    // options ={
    //   orgID: "20012118570385423810511240",
    //   assistantStaffID: "20020913491781433700514240"
    // }
    // 侯=齐晓红
    // options ={
    //   orgID: "20031709473895879610511240",
    //   assistantStaffID: "20020913491781433700514240"
    // }
    // 李大山
    // options = {
    //   "orgID": "19101017081245502880511001",
    //   "assistantStaffID": "20012214121981875310514240"
    // }
    // 测试
    // 包正一
    // options ={
    //   orgID: "19121923373037086560511253",
    //   assistantStaffID: "20011320532175746910514253"
    // }
    // 徐
    // options = {
    //   assistantStaffID: "20011514000045118050514253",
    //   orgID: "19101017081245502880511001"
    // }
    // options = {
    //   assistantStaffID: "20011909362464071890514253",
    //   orgID: "19121923373037086560511253"
    // }
    // 开发
    options = {
      assistantStaffID: "20011109080410712390514001",
      orgID: "19101017081245502880511001"
    }
    console.log("进入医院首页携带的参数：" + JSON.stringify(options));
    that.data.houShiOrgID = HTTP.houShiOrgIDFun(); // 获取侯氏医院ID
    app.globalData.isHaveOptions = false; // 初始化进入小程序有无携带参数状态
    if (options.q) { // 通过扫码进入时：q的值为url带参
      app.globalData.isHaveOptions = true; // 进入小程序携带有参数
      var scan_url = decodeURIComponent(options.q);
      let shareOrgID = that.initOptionsFun(scan_url, "orgID");
      let shareAssistantStaffID = that.initOptionsFun(scan_url, "assistantStaffID");
      if (shareOrgID && shareOrgID.length > 0) {
        that.setData({
          shareOrgID: shareOrgID
        });
        wx.setStorageSync("shareOrgID", shareOrgID);
      }
      if (shareAssistantStaffID && shareAssistantStaffID.length > 0) {
        that.setData({
          shareAssistantStaffID: shareAssistantStaffID
        });
        wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
      }
    } else if (options.assistantStaffID || options.orgID) { // 通过分享的小程序进入时：直接带参
      if (options.orgID && options.orgID.length > 0) {
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        that.setData({
          shareOrgID: options.orgID
        });
        wx.setStorageSync("shareOrgID", options.orgID);
      }
      if (options.assistantStaffID && options.assistantStaffID.length > 0) {
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        that.setData({
          shareAssistantStaffID: options.assistantStaffID
        });
        wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
      }
    }
    wx.showLoading({
      title: '拼命加载中...',
    });
    // 先监听是否尝试了登录：isStartLogin
    app.watch((value) => {
      // value为app.js中传入的值
      console.log("是否尝试自动登录了：", value);
      console.log("是否带参进入小程序：", app.globalData.isHaveOptions);
      if (value) {
        if (!that.data.isHaveWatched) {
          that.data.isHaveWatched = true;
          if (app.globalData.isInitInfo == "ready") {
            console.log("尝试了且成功了");
            that.initHomeData(); // 初始化参数
          } else {
            console.log("尝试了没成功");
            that.getDefaulShowInfo(); // 初始化调用请求方法
          }
        }
      }
    }, "isStartLogin");
    commonFun.startLoginFun(options); // 尝试自动登录
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
    if (that.data.isSearchState) {
      that.initHomeData(); // 初始化参数
    }
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
    return commonFun.onShareAppMessageFun();
  },

  /**转换传递的url参数 q */
  initOptionsFun: function(scan_url, name) {
    var reg = new RegExp("[^\?&]?" + encodeURI(name) + "=[^&]+");
    var arr = scan_url.match(reg);
    if (arr != null) {
      return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    } else {
      return "";
    }
  },

  /** 初始化参数 */
  initHomeData: function() {
    let that = this;
    that.setData({
      shareOrgID: wx.getStorageSync("shareOrgID"),
      shareAssistantStaffID: wx.getStorageSync("shareAssistantStaffID")
    });
    that.initFunctionFun();
  },

  /**初始化调用请求方法 */
  initFunctionFun: function() {
    let that = this;
    wx.showLoading({
      title: '拼命加载中...',
    });
    that.setData({
      isAboveHouShiID: that.data.houShiOrgID.indexOf(that.data.shareOrgID)
    });
    that.getBanner(); // 获取首页banner
    that.getTeamIntroduce(); // 获取医师团队介绍
    that.getBrowseCount(); // 获取用户浏览数
    that.getShareCount(); // 获取用户分享数
    that.getSignedDoctor(); // 通过医助查询到的签约医生
    that.getHospitalInfo(); //查询医院详情信息
    setTimeout(() => {
      wx.hideLoading();
    }, 2000)
  },

  /** 获取首页banner */
  getBanner() {
    let that = this;
    HTTP.getBannerTeamIntroduce({
        orgID: that.data.shareOrgID,
        groupCode: "OP_TMC_ORG",
        paraCode: "OP_TMC_ORG_BANNER"
      })
      .then(res => {
        // console.log("===首页banner===" + JSON.stringify(res));
        if (res.code == 0 && res.data) {
          that.setData({
            homeBannerDefaultUrl: res.data.paraValue
          });
        }
      });
  },

  /** 获取医师团队介绍  */
  getTeamIntroduce() {
    let that = this;
    HTTP.getBannerTeamIntroduce({
        orgID: that.data.shareOrgID,
        groupCode: "OP_TMC_ORG",
        paraCode: "OP_TMC_ORG_GROUPDESC"
      })
      .then(res => {
        // console.log("===获取医师团队介绍===" + JSON.stringify(res));
        if (res.code == 0 && res.data) {
          that.setData({
            doctorTeamIntroduce: res.data.paraValue
          });
        }
      })
  },

  /** 获取用户浏览数 */
  getBrowseCount() {
    let that = this;
    HTTP.getBrowseShareCount({
        orgID: that.data.shareOrgID,
        groupCode: "OV_TMC_USER",
        paraCode: "OV_TMC_USER_VIEWS"
      })
      .then(res => {
        // console.log("===获取用户浏览数===" + JSON.stringify(res));
        if (res.code == 0 && res.data) {
          that.setData({
            browseCount: res.data.paraValue
          });
        }
      })
  },

  /** 获取用户分享数 */
  getShareCount() {
    let that = this;
    HTTP.getBrowseShareCount({
        orgID: that.data.shareOrgID,
        groupCode: "OV_TMC_USER",
        paraCode: "OV_TMC_USER_SHARES"
      })
      .then(res => {
        // console.log("===获取用户分享数===" + JSON.stringify(res));
        if (res.code == 0 && res.data) {
          that.setData({
            shareCount: res.data.paraValue
          });
        }
      });
  },

  /** 通过医助查询到的签约医生 */
  getSignedDoctor() {
    let that = this;
    let doctorTeamList = [];
    HTTP.getSignedDoctor({
        assistantStaffID: that.data.shareAssistantStaffID,
        orgID: that.data.shareOrgID
      })
      .then(res => {
        // console.log("!!!!!通过医助查询到的签约医生!!!!!" + JSON.stringify(res));
        if (res.code == 0 && res.data) {
          that.setData({
            signedDoctor: res.data
          });
          HTTP.getPhysicianTeamList({
              orgId: that.data.shareOrgID
            })
            .then(res => {
              // console.log("!!!!!获取医师团队列表!!!!!" + JSON.stringify(res));
              if (res.code == 0 && res.data) {
                doctorTeamList = res.data;
                // 医师团队列表里是否存在签约那个医生
                // const physicianTeam = that.data.doctorTeamList.find(
                //   it => it.doctorDTOForTMC.staffId === this.data.signedDoctor.doctorDTOForTMC.staffId
                // );
                for (let i = 0; i < doctorTeamList.length; i++) {
                  let temp = doctorTeamList[i];
                  if (temp.doctorStaffID === this.data.signedDoctor.doctorStaffID) {
                    doctorTeamList.splice(i, 1);
                    break;
                  }
                }
                doctorTeamList.unshift(this.data.signedDoctor);
                if (doctorTeamList.length == 1) {
                  doctorTeamList.push({});
                }
                that.setData({
                  newArrayDoctorList: doctorTeamList
                });
              }
            });
        } else { // 如果通过医助查询到的签约医生没有的话
          // 无签约医生 
          HTTP.getPhysicianTeamList({
              orgId: that.data.shareOrgID
            })
            .then(res => {
              // console.log("!!!!!无签约医生获取医师团队列表!!!!!" + JSON.stringify(res));
              if (res.code == 0 && res.data) {
                that.setData({
                  newArrayDoctorList: res.data
                });
              }
            });
        }
      });
  },

  /** 获取医院详情简介信息 */
  getHospitalInfo() {
    let that = this;
    let params = {
      orgID: that.data.shareOrgID
    }
    HTTP.getHospitalInfo(params).then(res => {
      // console.log("===获取医院详情简介信息===" + JSON.stringify(res));
      if (res.code == 0 && res.data) {
        that.setData({
          hospitalDetail: res.data
        });
        if (res.data.orgName) {
          app.globalData.orgName = res.data.orgName; // 医院名称
        }
      }
    });
  },

  /** 获取默认进小程序显示信息  */
  getDefaulShowInfo() {
    let that = this;
    let params = {
      orgID: that.data.shareOrgID,
      assistantStaffID: that.data.shareAssistantStaffID,
      entryType: ""
    }
    HTTP.getDefaultDocInfo(params).then(res => {
      console.log("获取默认的首页信息：" + JSON.stringify(res.data));
      if (res.code == 0 && res.data) {
        that.setData({
          shareOrgID: res.data.orgID,
          shareAssistantStaffID: res.data.assistantStaffID
        });
        wx.setStorageSync("shareAssistantStaffID", res.data.assistantStaffID);
        wx.setStorageSync("shareOrgID", res.data.orgID);
        wx.setStorageSync("shareDoctorStaffID", res.data.doctorStaffID);
        that.initFunctionFun();
      } else {
        wx.showToast({
          title: '获取默认数据失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  /** 跳转到院长详情 */
  toDeanDetail() {
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "侯丽萍的医生主页", // 待确认，可先不传
      url: encodeURIComponent("https://res.100cbc.com/tmc/hospital/2381/docDetail.html"), // （必传）图文、视频 的网络地址链接,需要加密
      logoUrl: encodeURIComponent("") // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },

  /** 跳转到医院详情 */
  toHospitalDetail() {
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "医院主页", // 待确认，可先不传
      url: encodeURIComponent("https://res.100cbc.com/tmc/hospital/2381/hosDetail.html"), // （必传）图文、视频 的网络地址链接,需要加密
      logoUrl: encodeURIComponent("") // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },

  // 分享给更多需要的人
  shareMore() {
    commonFun.onShareAppMessageFun();
  },

  /**操作：立即进入专家门诊 */
  toServiceIndexFun: function() {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  }
})