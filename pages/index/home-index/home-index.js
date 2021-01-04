// pages/index/home-index/home-index.js
const app = getApp();
import {
  onShareAppMessageFun
} from '../../../utils/common.js';
import {
  heartFun,
  intervalTime
} from '../../../utils/heart.js';
const HTTP = require('../../../utils/http-util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData: {},
    isHideCoupon: true,
    timer: null,
    pageName: '首页',
    isSearchState: false, // 是否进行了一次加载
    /**
     * 侯丽萍开发环境ID： 19101017081245518100511003
     * 侯丽萍测试环境ID： 19121923373037086560511253
     * 侯氏生产环境ID： 20012118570385423810511240
     * 默认医院  19101017081245502880511001
     */
    isAboveHouShiID: -1, // 是否显示侯氏信息，默认-1显示
    isShowHarbinyouhaoID: -1, // 是否显示哈尔滨友好医院
    houShiOrgID: [], // 太原侯丽萍风湿骨病医院的机构ID
    harbinyouhaoOrgID: [], // 哈尔滨友好医院机构ID
    dazhongOrgID: [], // 大冢医药机构ID
    tmcneikeOrgID: [], // tmc内科
    xinnaoxueguanOrgID: [], //新脑血管机构ID
    loseweightOrgID: [], // 桃子互联网医院减肥中心机构ID
    gynecologyOrgID: [], // 桃子互联网医院妇科诊疗中心机构ID
    andrologyOrgID: [], // 桃子互联网医院男科诊疗中心机构ID
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
    harbinyouhaoInfo: {
      hospitalPhotoUrl: "https://com-shuibei-peach-static.100cbc.com/tmccontent/5532/org/5532-hospital.png",
      hospitalName: "哈尔滨友好风湿病医院",
      hospitalDetailContent: "哈尔滨友好风湿病医院，创建于2006年，是北京中医药大学博士侯丽萍教授在黑龙江创建的风湿骨病中医专科医院。医院自立业开始，便悉尊古方精细选材，依照古法炮制配伍。通过纯中医药物结合特色体质疗法，辨证施治，一人一方。"
    },
    isShowAllContent: false,
    doctorTeamIntroduce: "", // 医师团队介绍
    newArrayDoctorList: [], // 组合的新数组
    signedDoctor: {}, // 患者签约的医生
    hospitalDetail: {}, // 医院信息
    isHaveWatched: false, // 是否监听到变化了一次
    showOrgID: 0, // 区分展示哪家机构(0:成都华府中医远程诊疗中心;1:侯丽萍风湿骨病中医医院;2:大冢医药;3:桃子互联网医院减肥中心;4.桃子互联网医院妇科诊疗中心)
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
  onLoad: function (options) {
    let that = this;
    this.couponRefs = this.selectComponent("#couponDialog");
    // wx.hideShareMenu(); // 隐藏本页面右上角的分享功能
    that.data.houShiOrgID = HTTP.houShiOrgIDFun(); // 获取侯氏医院ID
    that.data.harbinyouhaoOrgID = HTTP.harbinyouhaoOrgIDFun(); // 获取哈尔滨友好医院ID
    that.data.dazhongOrgID = HTTP.dazhongOrgIDFun(); // 获取大冢医药ID
    that.data.xinnaoxueguanOrgID = HTTP.xinnaoxueguanOrgIDFun();
    that.data.tmcneikeOrgID = HTTP.tmcneikeFun(); // 获取tmc内科
    that.data.loseweightOrgID = HTTP.loseweightOrgIDFun(); // 获取桃子互联网医院减肥中心ID
    that.data.gynecologyOrgID = HTTP.gynecologyOrgIDFun(); // 获取桃子互联网医院妇科诊疗中心机构ID
    that.data.andrologyOrgID = HTTP.andrologyOrgIDFun(); // 获取桃子互联网医院男科诊疗中心机构ID
    // 先监听是否尝试了登录：isStartLogin
    if (app.globalData.isStartLogin) {
      if (app.globalData.isInitInfo) {
        console.log("尝试登录，成功了");
        that.initHomeData(); // 初始化参数
      } else {
        console.log("尝试登录，失败了");
        that.getDefaulShowInfo(); // 初始化调用请求方法
      }
    } else {
      app.watch((value) => {
        // value为app.js中传入的值
        console.log("是否尝试自动登录了：", value);
        console.log("是否带参进入小程序：", app.globalData.isHaveOptions);
        if (value) {
          if (!that.data.isHaveWatched) {
            that.data.isHaveWatched = true;
            if (app.globalData.isInitInfo) {
              console.log("尝试登录，成功了");
              that.initHomeData(); // 初始化参数
            } else {
              console.log("尝试登录，失败了");
              that.getDefaulShowInfo(); // 初始化调用请求方法
            }
          }
        }
      }, "isStartLogin");
    }
  },
  /** 发放优惠券 */
  sendCoupon: function () {

    let params = {
      orgID: app.globalData.orgID,
      patientID: app.globalData.patientID
    }
    HTTP.sendCoupon(params).then(res => {
      if (res.data && res.data.length) {
        this.setData({
          couponData: res.data[0]
        })
        this.couponRefs.showCouponDialog()
      }
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
    let that = this;
    this.timer = setInterval(() => {
      heartFun(this.data.pageName, this.__route__)
    }, intervalTime);
    if (that.data.isSearchState) {
      that.initHomeData(); // 初始化参数
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
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
    return onShareAppMessageFun();
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

  /** 初始化参数 */
  initHomeData: function () {
    //后面移动
    console.log('isShowCoupon222222222222:', app.globalData.isShowCoupon)
    this.sendCoupon();
    console.log("=====初始化参数=======");
    let that = this;
    that.setData({
      shareOrgID: wx.getStorageSync("shareOrgID"),
      // shareOrgID: "20050916495074555320511240",
      shareAssistantStaffID: wx.getStorageSync("shareAssistantStaffID")
    });

    // console.error(that.data.tmcneikeOrgID,that.data.shareOrgID)
    console.log("=====shareOrgID=======" + that.data.shareOrgID);
    // 判断是否是侯丽萍中医院远程门诊
    if (that.data.houShiOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是侯丽萍医院
      that.setData({
        showOrgID: 1
      })
      that.initFunctionFun();
    } else if (that.data.dazhongOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是大冢医药
      that.setData({
        showOrgID: 2
      })
      that.initDefaultFun();
    } else if (that.data.loseweightOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是桃子互联网医院减肥中心
      that.setData({
        showOrgID: 3
      })
      that.initCustomDefaultFun();
    } else if (that.data.gynecologyOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是桃子互联网医院妇科诊疗中心
      that.setData({
        showOrgID: 4
      })
      that.initCustomDefaultFun();
    } else if (that.data.andrologyOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是桃子互联网医院男科诊疗中心
      that.setData({
        showOrgID: 5
      })
      that.initCustomDefaultFun();
    } else if (that.data.harbinyouhaoOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是哈尔滨友好医院
      that.setData({
        showOrgID: 6,
        isShowHarbinyouhaoID: that.data.harbinyouhaoOrgID.indexOf(that.data.shareOrgID)
      })
      that.initFunctionFun();
    }
    // else if (that.data.tmcneikeOrgID.indexOf(that.data.shareOrgID) > -1) {
    //   // 判断是否是tmc内科
    //   that.setData({
    //     showOrgID: 7
    //   })
    //   that.initDefaultFun();
    // }
    else if (that.data.xinnaoxueguanOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是tmc内科
      that.setData({
        showOrgID: 8
      })
      that.initDefaultFun();
    } else { // 默认显示成都华府中医远程诊疗中心
      that.setData({
        showOrgID: 0
      })
      that.initFunctionFun();
    }
    console.log("----showOrgID----" + that.data.showOrgID);
    console.log("----shareOrgID----" + that.data.shareOrgID);
    console.log("----harbinyouhaoOrgID----" + that.data.harbinyouhaoOrgID);
  },

  /**初始化调用请求方法 */
  initFunctionFun: function () {
    let that = this;
    wx.showLoading({
      title: '拼命加载中...',
    });
    that.setData({
      isAboveHouShiID: that.data.houShiOrgID.indexOf(that.data.shareOrgID),
      isShowHarbinyouhaoID: that.data.harbinyouhaoOrgID.indexOf(that.data.shareOrgID),
    });
    console.log("^^^^^^isShowHarbinyouhaoID^^^^^" + that.data.isShowHarbinyouhaoID);
    that.getHospitalInfo(); //查询医院详情信息
    that.getBanner(); // 获取首页banner
    that.getTeamIntroduce(); // 获取医师团队介绍
    that.getBrowseCount(); // 获取用户浏览数
    that.getShareCount(); // 获取用户分享数
    that.getSignedDoctor(); // 通过医助查询到的签约医生
    setTimeout(() => {
      wx.hideLoading();
      that.data.isSearchState = true;
    }, 1500);
  },

  /**初始化 大冢医院 默认加载数据 */
  initDefaultFun: function () {
    let that = this;
    wx.showLoading({
      title: '拼命加载中...',
    });
    that.setData({
      isAboveHouShiID: that.data.houShiOrgID.indexOf(that.data.shareOrgID),
    });
    that.getHospitalInfo(); //查询医院详情信息
    that.getBanner(); // 获取首页banner
    that.getSignedDoctor(); // 通过医助查询到的签约医生
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
  },

  /**初始桃子互联网医院减肥中心默认加载数据 */
  initCustomDefaultFun: function () {
    let that = this;
    wx.showLoading({
      title: '拼命加载中...',
    });
    that.setData({
      isAboveHouShiID: that.data.houShiOrgID.indexOf(that.data.shareOrgID),
    });
    that.getHospitalInfo(); //查询医院详情信息
    that.getSignedDoctor(); // 通过医助查询到的签约医生
    setTimeout(() => {
      wx.hideLoading();
    }, 1000);
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
        if (res.code == 0 && res.data) {
          that.setData({
            signedDoctor: res.data
          });
          HTTP.getPhysicianTeamList({
              orgId: that.data.shareOrgID
            })
            .then(res => {
              if (res.code == 0 && res.data) {
                doctorTeamList = res.data;
                for (let i = 0; i < doctorTeamList.length; i++) {
                  let temp = doctorTeamList[i];
                  if (temp.doctorStaffID === this.data.signedDoctor.doctorStaffID) {
                    doctorTeamList.splice(i, 1);
                    break;
                  }
                }
                doctorTeamList.unshift(this.data.signedDoctor);
                that.setData({
                  newArrayDoctorList: doctorTeamList
                });
              }
            });
          that.toDoctorDetailFun(res.data.doctorStaffID); // 是否直接跳往医生详情页
        } else { // 如果通过医助查询到的签约医生没有的话
          // 无签约医生 
          HTTP.getPhysicianTeamList({
              orgId: that.data.shareOrgID
            })
            .then(res => {
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
      if (res.code == 0 && res.data) {
        that.setData({
          hospitalDetail: res.data
        });
        if (res.data.orgName) {
          app.globalData.orgName = res.data.orgName; // 机构名称
          // 动态设置小程序的navigationBarTitleText
          wx.setNavigationBarTitle({
            title: app.globalData.orgName
          });
        }
      }
    });
  },

  /** 获取默认进小程序显示信息  */
  getDefaulShowInfo() {
    let that = this;
    that.setData({
      shareOrgID: wx.getStorageSync("shareOrgID"),
      // shareOrgID: "20050916495074555320511240",
      shareAssistantStaffID: wx.getStorageSync("shareAssistantStaffID")
    });
    // 判断是否是侯丽萍中医院远程门诊
    if (that.data.houShiOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是侯丽萍医院
      that.setData({
        showOrgID: 1
      })
      // 判断是否是大冢医药
    } else if (that.data.dazhongOrgID.indexOf(that.data.shareOrgID) > -1) {
      that.setData({
        showOrgID: 2
      })
      // 判断是否是桃子互联网医院减肥中心
    } else if (that.data.loseweightOrgID.indexOf(that.data.shareOrgID) > -1) {
      that.setData({
        showOrgID: 3
      })
      // 判断是否是桃子互联网医院妇科诊疗中心
    } else if (that.data.gynecologyOrgID.indexOf(that.data.shareOrgID) > -1) {
      that.setData({
        showOrgID: 4
      })
    } else if (that.data.andrologyOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是桃子互联网医院男科诊疗中心
      that.setData({
        showOrgID: 5
      })
    } else if (that.data.harbinyouhaoOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是哈尔滨友好医院
      that.setData({
        showOrgID: 6,
        isShowHarbinyouhaoID: that.data.harbinyouhaoOrgID.indexOf(that.data.shareOrgID)
      })
      // } else if (that.data.tmcneikeOrgID.indexOf(that.data.shareOrgID) > -1) {
      //   that.setData({
      //     showOrgID: 7
      //   })
      //   // 判断是否是桃子互联网医院减肥中心
    } else if (that.data.xinnaoxueguanOrgID.indexOf(that.data.shareOrgID) > -1) {
      // 判断是否是tmc内科
      that.setData({
        showOrgID: 8
      })
    } else {
      that.setData({
        showOrgID: 0
      })
    }
    console.log("===showOrgID===" + that.data.showOrgID);
    let params = {
      orgID: that.data.shareOrgID,
      assistantStaffID: that.data.shareAssistantStaffID,
      entryType: ""
    }
    HTTP.getDefaultDocInfo(params).then(res => {
      console.log("获取默认数据结果1---" + JSON.stringify(res));
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

  /** 跳转到侯丽萍医院详情 */
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

  /** 跳转到哈尔滨友好医院详情 */
  toharbinHospitalDetail() {
    let materialData = {
      materialType: 0, // （必传）要查看的素材类型 0图文 1视频
      title: "医院主页", // 待确认，可先不传
      url: encodeURIComponent("https://res.100cbc.com/tmc/hospital/2381/haErBingHosDetail.html"), // （必传）图文、视频 的网络地址链接,需要加密
      logoUrl: encodeURIComponent("") // 视频的封面图片(没有就传空字符窜)
    };
    wx.navigateTo({
      url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
    });
  },

  // 分享给更多需要的人
  shareMore() {
    onShareAppMessageFun();
  },

  /**操作：立即进入专家门诊 */
  toServiceIndexFun: function () {
    wx.switchTab({
      url: '/pages/index/service-index/service-index'
    });
  },
  // 判断app.globalData.p是否存在，是否跳往医生详情页
  toDoctorDetailFun(doctorStaffID) {
    let that = this;
    if (!doctorStaffID) {
      return;
    }
    // 注释 跳转专家页面
    // if (app.globalData.p && app.globalData.p === "d") {
    //   app.globalData.p = "";
    //   that.toServiceIndexFun();
    // }
  }
})