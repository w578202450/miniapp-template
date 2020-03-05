// pages/index/home-index/home-index.js
const app = getApp();
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 测试环境
     * 侯丽萍医院 19121923373037086560511253
     * 默认医院  19101017081245502880511001
     */
    houShiOrgID: "19121923373037086560511253", // 太原侯丽萍风湿骨病医院的机构ID
    shareOrgID: "", // 进入页面携带的orgID
    shareAssistantStaffID: "", // 进入页面携带的医助ID
    homeBannerDefaultUrl: "/images/home/home_banner_default.png", // 首页banner
    certifyNo: "45081134X51012213A1002", // 医疗机构许可证
    browseCount: 0, // 用户浏览数
    shareCount: 0, // 用户分享数
    // 院长信息
    deanInfo: {
      deanPhotoUrl: "https://com-shuibei-peach-tmc-cs.100cbc.com/content/20030314092085694750201210.png",
      deanName: "候丽萍", // 院长名称
      deanDuty: "主任医师 山西名中医 博士生导师", // 职称
      deanFamous: "侯氏三焦气化疗法创始人", // 专长
      goodAts: ["风湿骨科", "针灸"], //擅长
      // 院长详细介绍
      deanDetailContent: "北京中医药大学博士生导师，山西省名中医，国家中医药管理局重点专科风湿病学科带头人，国家中医药管理局重点专科风湿病皮痹协作组组长，全国第六批优秀中医人才指导老师，世界中医药联合会特聘专家；侯氏中医风湿三焦气化诊疗体系主要传承人，侯氏中医风湿三焦气化流派代表传承人.",
    },
    // 医院信息
    hospitalInfo: {
      hospitalPhotoUrl: "https://com-shuibei-peach-tmc-cs.100cbc.com/content/20030314541664857580201210.png",
      hospitalName: "候丽萍风湿骨病中医医院",
      hospitalIntroduce: "中医治风湿骨病",
      hospitalDetailContent: "太原侯丽萍风湿骨病中医医院系国家中医药管理局“十五”、“十一五”“十二五”风湿病重点专科医院、太原市二级甲等中医专科医院、山西中医学院教学医院、山西中医类风湿病医疗中心。本院始建于1987年，在侯丽萍院长的领导下，大力开展科学研究和临床实践，博取中医传统医学之精华与现代科学技术之长，创立了中医治疗风湿、类风湿的系统综合疗法--- 侯氏中医风湿三焦气化疗法，在治疗类风湿、强直性脊柱炎、红斑狼疮、骨关节病等各种关节疾病的诊治方面，取得了良好的疗效，已在全国二十多各省市推广使用，并与北美、日本、东南亚等国建立了长期合作关系。"
    },
    isShowAllContent: false,
    doctorTeamIntroduce: "", // 医师团队介绍
    doctorTeamList: [], // 医师团队列表
    newArrayDoctorList: [], // 组合的新数组
    signedDoctor: {}, // 患者签约的医生
    hospitalDetail: {}, // 医院信息
    // defaultPhotoUrl: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/chat/docBacImg.png"
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
    console.log("进入侯丽萍首页携带的参数：" + JSON.stringify(options));
    app.globalData.isHaveOptions = false; // 初始化进入小程序有无携带参数状态
    if (options) {
      if (options.q) { // 通过扫码进入时：q的值为url带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        var scan_url = decodeURIComponent(options.q);
        let shareOrgID = that.initOptionsFun(scan_url, "orgID");
        let shareAssistantStaffID = that.initOptionsFun(scan_url, "assistantStaffID");
        if (shareOrgID && shareOrgID.length > 0) {
          that.data.shareOrgID = shareOrgID;
          wx.setStorageSync("shareOrgID", shareOrgID);
        }
        if (shareAssistantStaffID && shareAssistantStaffID.length > 0) {
          that.data.shareAssistantStaffID = shareAssistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
        }
      } else if ((options.assistantStaffID && options.assistantStaffID.length > 0) || (options.orgID && options.orgID.length > 0)) { // 通过分享的小程序进入时：直接带参
        if (options.orgID && options.orgID.length > 0) {
          app.globalData.isHaveOptions = true; // 进入小程序携带有参数
          that.data.shareOrgID = options.orgID;
          wx.setStorageSync("shareOrgID", options.orgID);
        }
        if (options.assistantStaffID && options.assistantStaffID.length > 0) {
          app.globalData.isHaveOptions = true; // 进入小程序携带有参数
          that.data.shareAssistantStaffID = options.assistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
        }
      }
    }
    console.log("=======isHaveOptions=========" + app.globalData.isHaveOptions);
    if (app.globalData.isHaveOptions) {
      that.initHomeData();
    } else {
      that.getDefaulShowInfo(); // 获取默认展示信息
    }
    if (!app.globalData.isInitInfo)  {
      let sendOptions = {
        ...options
      };
      commonFun.startLoginFun(sendOptions); // 尝试自动登录  
    }
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

  /** 初始化数据 */
  initHomeData: function() {
    let that = this;
    that.getBanner(); // 获取首页banner
    that.getTeamIntroduce(); // 获取医师团队介绍
    that.getBrowseCount(); // 获取用户浏览数
    that.getShareCount(); // 获取用户分享数
    // that.getPhysicianTeamList(); // 获取医师团队列表
    that.getHospitalInfo(); //查询医院详情信息
    that.getSignedDoctor(); // 通过医助查询到的签约医生
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
        console.log("===首页banner===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              homeBannerDefaultUrl: res.data.paraValue
            });
          }
        }
      });
  },

  /** 获取医师团队介绍 */
  getTeamIntroduce() {
    let that = this;
    HTTP.getBannerTeamIntroduce({
        orgID: that.data.shareOrgID,
        groupCode: "OP_TMC_ORG",
        paraCode: "OP_TMC_ORG_GROUPDESC"
      })
      .then(res => {
        console.log("===获取医师团队介绍===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              doctorTeamIntroduce: res.data.paraValue
            });
          }
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
        console.log("===获取用户浏览数===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              browseCount: res.data.paraValue
            });
          }
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
        console.log("===获取用户分享数===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              shareCount: res.data.paraValue
            });
          }
        }
      });
  },

  /** 通过医助查询到的签约医生 */
  getSignedDoctor() {
    let that = this;
    HTTP.getSignedDoctor({
      assistantStaffID: that.data.shareAssistantStaffID,
      orgID: that.data.shareOrgID
      // assistantStaffID: "20020509480115486460514001",
      // orgID: "19101017081245502880511001"
      })
      .then(res => {
        console.log("!!!!!通过医助查询到的签约医生!!!!!" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              signedDoctor: res.data
            });
            // wx.setStorageSync('signedDoctorInfo', res.data);
            HTTP.getPhysicianTeamList({
                orgId: that.data.shareOrgID
              })
              .then(res => {
                console.log("!!!!!获取医师团队列表!!!!!" + JSON.stringify(res));
                if (res.code == 0) {
                  if (res.data) {
                    that.setData({
                      doctorTeamList: res.data
                    });
                    // 医师团队列表里是否存在签约那个医生
                    const physicianTeam = that.data.doctorTeamList.find(
                      it => it.doctorDTOForTMC.staffId === this.data.signedDoctor.doctorDTOForTMC.staffId
                    );
                    // A.存在
                    if (physicianTeam && res.data.doctorDTOForTMC && res.data.doctorDTOForTMC.staffId) {
                      for (let i = 0; i < res.data.length; i++) {
                        let id = res.data.doctorDTOForTMC.staffId;
                        if (id != signedDoctor.doctorDTOForTMC.staffId) {
                          let arraySignedDoctor = new Array(this.data.signedDoctor);
                          arraySignedDoctor.push(res.data[i]);
                        }
                      }
                      console.log("!!!!!排序后团队arraySignedDoctor!!!!!" + JSON.stringify(arraySignedDoctor));
                      // B.不存在
                    } else {
                      var arraySignedDoctor = new Array(this.data.signedDoctor);
                      for (let i = 0; i < res.data.length; i++) {
                        arraySignedDoctor.push(res.data[i]);
                      }
                      console.log("!!!!排序后团队arraySignedDoctor!!!!!" + JSON.stringify(arraySignedDoctor));
                    }
                    that.setData({
                      newArrayDoctorList: arraySignedDoctor
                    });
                  }
                }
              });
          }
        } else { // 如果通过医助查询到的签约医生没有的话
          // 无签约医生 
          HTTP.getPhysicianTeamList({
              // orgId: "19101017081245502880511001"
              orgId: that.data.shareOrgID
            })
            .then(res => {
              console.log("!!!!!无签约医生获取医师团队列表!!!!!" + JSON.stringify(res));
              if (res.code == 0) {
                if (res.data) {
                  that.setData({
                    newArrayDoctorList: res.data
                  });
                }
              }
            });
        }
      });
  },

  /** 获取医师团队列表 */
  getPhysicianTeamList() {
    let that = this;
    HTTP.getPhysicianTeamList({
        // orgId: "19101017081245502880511001"
        orgId: that.data.shareOrgID
      })
      .then(res => {
        console.log("===获取医师团队列表===" + JSON.stringify(res));
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              doctorTeamList: res.data
            });

          }
        }
      });
  },

  /** 获取医院详情信息 */
  getHospitalInfo() {
    let that = this;
    let params = {
      orgID: that.data.shareOrgID
    }
    HTTP.getHospitalInfo(params).then(res => {
      console.log("===获取医院信息===" + JSON.stringify(res));
      if (res.code == 0) {
        if (res.data) {
          that.setData({
            hospitalDetail: res.data
          });

          if (res.data.orgName) {
            app.globalData.orgName = res.data.orgName; // 医院名称
          }
        }
      }
    });
  },

  /** 获取默认进小程序显示信息 */
  getDefaulShowInfo() {
    let that = this;
    HTTP.getDefaultDocInfo({
        // orgID: that.data.shareOrgID,
        // assistantStaffID: that.data.shareAssistantStaffID,
        orgID: "",
        assistantStaffID: "",
        entryType: ""
      })
      .then(res => {
        console.log("获取默认的首页信息：" + JSON.stringify(res.data));
        if (res.code == 0) {
          that.data.shareOrgID = res.data.orgID;
          that.data.shareAssistantStaffID = res.data.assistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", res.data.assistantStaffID);
          wx.setStorageSync("shareOrgID", res.data.orgID);
          wx.setStorageSync("shareDoctorStaffID", res.data.doctorStaffID);
          that.initHomeData(); // 初始化数据
        }
      });
  },

  /** 跳转到院长详情 */
  toDeanDetail() {
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "侯丽萍的医生主页", // 待确认，可先不传
      url: "https://res.100cbc.com/tmc/hospital/2381/docDetail.html", // （必传）图文、视频 的网络地址链接
      logoUrl: "" // 视频的封面图片(没有就传空字符窜)
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
      url: "https://res.100cbc.com/tmc/hospital/2381/hosDetail.html", // （必传）图文、视频 的网络地址链接
      logoUrl: "" // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },

  // 分享给更多需要的人
  shareMore() {
    let that = this;
    commonFun.onShareAppMessageFun();
  },

  /**操作：立即进入专家门诊 */
  toServiceIndexFun: function() {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  }
})