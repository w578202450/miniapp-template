// pages/index/service-index/service-index.js
const app = getApp();
import { onShareAppMessageFun, requestMsgFun } from '../../../utils/common.js';
import { heartFun,intervalTime } from '../../../utils/heart.js';
const HTTP = require('../../../utils/http-util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponData:{rule:{}},
    timer:null,
    pageName:'专家门诊页',
    copyrightInfo: {
      copyrightIcon: "/images/inquiry/inquiry_copyright.png",
      nationalEmblemIcon: "/images/inquiry/inquiry_nationalEmblem.png",
      details_one: "2015-2020桃子互联网医院",
      details_two: "蜀ICP备16030538号",
      details_three: "互联网药品信息服务资格证：（川）-经营性-2017-0003",
      details_four: "电信增值业务经营许可证：川B2-20170157"
    },
    articleCurrentOrgID: "", // 当前请求文章模块的orgID 当orgID变化的时候才进行文章模块的刷新
    navHomeIconBlack: "/images/public/navHome.png", // 房子按钮：黑色
    capsuleRect: app.globalData.menuButtonBoundingClientRect,
    systemInfo: app.globalData.systemInfo,
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    isSearchState: false, // 是否第一次加载
    shareOrgID: "", // 缓存中的orgID
    shareAssistantStaffID: "", // 缓存中的医助ID
    shareDoctorStaffID: "", // 缓存中的医生ID
    doctorInfo: {}, // 医师的信息
    certifyInfo: {}, // 医师资质许可证等信息
    assistantDoctorInfo: {}, // 助理医师的信息
    // 患者评价相关的所有数据
    evaluateAllData: {
      // evaluateData: [],
      illnessSumList: [],
      // doctorID: "",
      // orgID: ""
    },
    scrollTop: 0,
    // 患友分享相关数据
    patientShareGetData: {
      keyID: "",
      patientName: "",
      patientFace: "",
      patientAddress: "",
      contentSummary: "",
      detailUrl: "",
      publishDate: "",
      httpParams: {
        nextPage: "/pages/index/service-index/wth/share-list/share-list",
        sectionID: "",
        orgID: "",
        doctorStaffID: ""
      }
    },
    // 患者手记相关数据
    inquiryCaseData: {
      keyID: "",
      patientName: "",
      patientFace: "",
      patientAddress: "",
      contentSummary: "",
      detailUrl: "",
      publishDate: "",
      httpParams: {
        nextPage: "/pages/index/service-index/wth/notes-list/notes-list",
        sectionID: "",
        orgID: "",
        doctorStaffID: ""
      }
    },
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},
    // 互联网医院执业许可
    license_icon: "/images/home/practice_license.png",
    // 网信认证
    attestation_icon: "/images/home/net_letter_attestation.png",
    // 咨询电话图标
    expert_clinic_tel: "/images/home/expert_clinic_tel.png",
    // 联系邮箱图标
    expert_clinic_email: "/images/home/expert_clinic_email.png",
    // dialog关闭按钮图标
    dialog_close: "/images/home/dialog_close.png",
    // 咨询电话
    consulting_tel: "028-6455 3998",
    // 联系邮箱
    contact_email: "shuibei@100cbc.com",
    isHaveWatched: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // app.hideTabBarFun();
    wx.showLoading({
      title: '加载中...'
    });
    if (app.globalData.isStartLogin) {
      if (app.globalData.isInitInfo) {
        console.log("尝试登录，成功了");
        that.initDocInfoFun(); // 初始化参数
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
              that.initDocInfoFun(); // 初始化参数
            } else {
              console.log("尝试登录，失败了");
              that.getDefaulShowInfo(); // 初始化调用请求方法
            }
          }
        }
      }, "isStartLogin");
    }
    this.couponRefs = this.selectComponent("#coupon")
    app.watch((value) => {
      // value为app.js中传入的值
      console.log('isShowCoupon22222:',app.globalData.isShowCoupon)
      this.sendCoupon()
     }, "isShowCoupon");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
    app.watch((value) => {
      // value为app.js中传入的值
      if(value){
        this.popup.hidePopup()
      }else{
        app.globalData.isClickChat=false    
      }
  }, "isClickChat");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.hideTabBarFun();
    if (this.data.isSearchState) {
      this.initDocInfoFun();
    }
    this.timer=setInterval(() => {
      heartFun(this.data.pageName,this.__route__)
    }, intervalTime);
  },
  /** 发放优惠券 */
  sendCoupon: function(){
    let params = {
      orgID: app.globalData.orgID,
      patientID: app.globalData.patientID
    }
  
    HTTP.sendCoupon(params).then(res=>{
      if(res.data&&res.data.length){
          this.couponRefs.showCouponDialog()
          this.setData({
            couponData:res.data[0]
          })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('---onHide')
    clearInterval(this.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('---onUnload')
    clearInterval(this.timer)
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
    return onShareAppMessageFun("/pages/index/service-index/service-index");
    // return onShareAppMessageFun();
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

  /**初始化数据 */
  initDocInfoFun: function() {
    let that = this;
    app.globalData.isShowCoupon = true;
    that.data.shareOrgID = wx.getStorageSync("shareOrgID");
    that.data.shareDoctorStaffID = wx.getStorageSync("shareDoctorStaffID");
    that.data.shareAssistantStaffID = wx.getStorageSync("shareAssistantStaffID");
    if (!that.data.shareOrgID || !that.data.shareDoctorStaffID || !that.data.shareAssistantStaffID) {
      setTimeout(() => {
        that.fetchDoctorInfo(that.data.shareDoctorStaffID); // 获取主治医师信息
        that.fetchAssistantDoctorInfo(that.data.shareAssistantStaffID); // 获取助理医生信息
      }, 1500);
    } else {
      that.fetchDoctorInfo(that.data.shareDoctorStaffID); // 获取主治医师信息
      that.fetchAssistantDoctorInfo(that.data.shareAssistantStaffID); // 获取助理医生信息
    }
  },

  getDefaulShowInfo() {
    let that = this;
    that.setData({
      shareOrgID: wx.getStorageSync("shareOrgID"),
      shareAssistantStaffID: wx.getStorageSync("shareAssistantStaffID")
    });
    let params = {
      orgID: that.data.shareOrgID,
      assistantStaffID: that.data.shareAssistantStaffID,
      entryType: ""
    }
    HTTP.getDefaultDocInfo(params).then(res => {
      console.log("获取默认数据结果2---"+JSON.stringify(res));
      if (res.code == 0 && res.data) {
        that.setData({
          shareOrgID: res.data.orgID,
          shareAssistantStaffID: res.data.assistantStaffID
        });
        wx.setStorageSync("shareAssistantStaffID", res.data.assistantStaffID);
        wx.setStorageSync("shareOrgID", res.data.orgID);
        wx.setStorageSync("shareDoctorStaffID", res.data.doctorStaffID);
        that.initDocInfoFun();
      } else {
        wx.hideLoading();
        that.setData({
          isSearchState: true
        });
        wx.showToast({
          title: '获取默认数据失败',
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(() => {
      wx.hideLoading();
      that.setData({
        isSearchState: true
      });
    });
  },

  /**获取主治医师信息*/
  fetchDoctorInfo(staffID) {
    let that = this;
    HTTP.getDoctorInfo({
        staffID: staffID
      })
      .then(res => {
        if (res.code == 0) {
          if (res.data) {
            that.setData({
              doctorInfo: res.data,
              isSearchState: true
            });
            app.globalData.doctorInfo = res.data;
            wx.setStorageSync('doctorInfo', res.data);
            that.getHospitalInfo(res.data.orgID); //查询医院详情信息
            that.getOrderCommentData(res.data.orgID, staffID); // 获取患者评价信息
            that.getToolClassifyById(res.data.orgID, staffID, res.data.sectionID); // 文章模块分类获取
            that.fetchDoctorQualification(res.data.doctorID); // 获取医生资质编号
            that.getDoctorDiseaseByDoctorID(res.data.doctorID).then(function(res) {
              that.setData({
                doctorDisease: res
              });
            }); // 获取主治医生的专治疾病
            // that.patientShareGet(that.data.doctorInfo.sectionID, that.data.doctorInfo.orgID, staffID); // 患友分享
            that.inquiryCaseGet(that.data.doctorInfo.sectionID, that.data.doctorInfo.orgID, staffID); // 康复案例
            that.getSectionByKeyID();
            wx.hideLoading();
          }
        }
      }).catch(() => {
        wx.hideLoading();
        that.setData({
          isSearchState: true
        });
      });
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
            that.setData({
              assistantDoctorInfo: res.data
            });
            wx.setStorageSync('assistantInfo', res.data);
            app.globalData.assistantInfo = res.data;
            // 获取助理医生的专治疾病
            that.getDoctorDiseaseByDoctorID(res.data.doctorID).then(function(res) {
              that.setData({
                assistantdoctorDisease: res
              });
            });
          }
        }
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
          });
        }
      });
  },

  /**操作：点击查看医生详情 */
  doctorDetailTap: function(e) {
    let index = e.currentTarget.dataset.index;
    let staffID = index == '0' ? app.globalData.personInfo.doctorStaffID : app.globalData.personInfo.assistantStaffID;
    if (staffID) {
      wx.navigateTo({
        url: '/pages/online-inquiry/doctor-details/doctor-details?staffID=' + staffID
      });
    }
  },

  /**
   * 查询：患者评价信息
   */
  getOrderCommentData: function(orgID, doctorStaffID) {
    let that = this;
    that.setData({
      evaluateAllData: null
    });
    let params = {
      orgID: orgID,
      doctorStaffID: doctorStaffID
    };
    HTTP.orderCommentGet(params).then(res => {
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

  //------------------------------fzm-------------------------------开始
  /**
   * 查看门诊医生介绍
   */
  previewDoctorInfo() {

  },

  /**
   * 监听屏幕滚动 判断上下滚动
   */
  onPageScroll: function(ev) {
    this.setData({
      scrollTop: ev.scrollTop
    })
  },
  /**
   * 获取文章模块的分类
   */
  getToolClassifyById(defaultOrgID, doctorStaffID, departmentCanSee) {
    let orgID = wx.getStorageSync("shareOrgID") || defaultOrgID;
    // 限制onShow频繁刷新 只有orgID变化的情况下 才进行刷新
    if (orgID === this.data.articleCurrentOrgID) {
      return;
    }
    HTTP.getToolClassifyById({
      classifyType: 2,
      orgID: orgID
    }).then(res => {
      if (res.code == 0 && res.data) {
        this.data.articleCurrentOrgID = orgID;
        this.setData({
          articleTitles: res.data,
          baseParams: {
            "isPublish": 1,
            "doctorCanSee": doctorStaffID,
            "departmentCanSee": departmentCanSee
          }
        });
      }
    });
  },
  /**
   * 获取专治病
   */
  getDoctorDiseaseByDoctorID(doctorId) {
    var that = this;
    var promise = new Promise(function(resolve, reject) {
      HTTP.getDoctorDiseaseByDoctorID({
          doctorID: doctorId
        })
        .then(res => {
          if (res.code == 0 && res.data) {
            var disease = []
            for (var index in res.data) {
              disease.push(res.data[index].diseaseName)
            }
            resolve(disease);
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
            resolve([]);
          }
        }).catch(e => {
          resolve([]);
        });
    })
    return promise;
  },
  /**
   * 获取门诊logo
   */
  getSectionByKeyID() {
    HTTP.getSectionByKeyID({
        keyID: this.data.doctorInfo.sectionID
      })
      .then(res => {
        this.setData({
          sectionBanner: res.data.sectionBanner
        })
      }).catch(e => {});
  },

  /**
   * 操作：开始问诊
   * 1.已登录，直接到问诊页
   * 2.未登录，授权登录
   *  */
  toOnlineInqueryFun: function() {
    if (app.globalData.isInitInfo) {
      requestMsgFun();
    } else {
      let nextPageName = "chat";
      this.popup.showPopup(nextPageName); // 显示登录确认框
    }
  },

  /** 资格证书底部弹出浪框 */
  // 显示对话框
  showBottomDialog: function() {
    var that = this;
    that.setData({
      hideModal: false
    });
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
      delay: 0
    })
    this.animation = animation;
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏对话框
  hideModal: function() {
    var that = this;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation;
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 200) //先执行下滑动画，再隐藏模块
  },

  //动画集
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },

  fadeDown: function() {
    this.animation.translateY(500).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  // 一键拨打
  callPhone: function() {
    wx.makePhoneCall({
      phoneNumber: '02864553998',
      success: function() {
      },
      fail: function() {
      }
    })
  },

  /**取消事件 */
  _error() {
    this.popup.hidePopup();
  },

  /**确认事件 */
  _success() {
    this.popup.hidePopup();
  },

  /** 获取医院详情信息 */
  getHospitalInfo(orgID) {
    let that = this;
    let params = {
      orgID: orgID
    }
    HTTP.getHospitalInfo(params).then(res => {
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

  //回主页
  goToBackHome: function() {
    // let orgID = wx.getStorageSync("shareOrgID");
    // let assistantStaffID = wx.getStorageSync("shareAssistantStaffID");
    // wx.reLaunch({
    //   url: '/pages/index/home-index/home-index?orgID=' + orgID + '&assistantStaffID=' + assistantStaffID
    // });
    wx.reLaunch({
      url: '/pages/index/home-index/home-index'
    });
  },
  //------------------------------fzm-------------------------------结束

  /**
   * 查询：患友分享信息
   */
  patientShareGet: function(sectionID, orgID, doctorStaffID) {
    let that = this;
    HTTP.patientShareGet({
      orgID: orgID,
      sectionID: sectionID,
      doctorStaffID: doctorStaffID
    }).then(res => {
      if (res.code == 0 && res.data) {
        that.setData({
          ["patientShareGetData.keyID"]: res.data.keyID,
          ["patientShareGetData.patientName"]: res.data.patientName,
          ["patientShareGetData.patientFace"]: res.data.patientFace,
          ["patientShareGetData.patientAddress"]: res.data.patientAddress,
          ["patientShareGetData.contentSummary"]: res.data.contentSummary,
          ["patientShareGetData.detailUrl"]: res.data.detailUrl,
          ["patientShareGetData.publishDate"]: res.data.publishDate,
          ["patientShareGetData.httpParams.sectionID"]: sectionID,
          ["patientShareGetData.httpParams.orgID"]: orgID,
          ["patientShareGetData.httpParams.doctorStaffID"]: doctorStaffID
        });
      }
    });
  },
  /**
   * 查询：康复案例信息
   */
  inquiryCaseGet: function(sectionID, orgID, doctorStaffID) {
    let that = this;
    HTTP.inquiryCaseGet({
      orgID: orgID,
      sectionID: sectionID,
      doctorStaffID: doctorStaffID
    }).then(res => {
      if (res.code == 0 && res.data) {
        that.setData({
          ["inquiryCaseData.keyID"]: res.data.keyID,
          ["inquiryCaseData.authorName"]: res.data.authorName,
          ["inquiryCaseData.photoUrl"]: res.data.photoUrl,
          ["inquiryCaseData.patientAddress"]: res.data.patientAddress,
          ["inquiryCaseData.contentSummary"]: res.data.contentSummary,
          ["inquiryCaseData.detailUrl"]: res.data.detailUrl,
          ["inquiryCaseData.httpParams.sectionID"]: sectionID,
          ["inquiryCaseData.httpParams.orgID"]: orgID,
          ["inquiryCaseData.publishDate"]: res.data.publishDate,
          ["inquiryCaseData.httpParams.doctorStaffID"]: doctorStaffID,
          ["inquiryCaseData.content"]: res.data.content
        });
      }
    });
  },
  /**
   * 统计计数刷新
   */
  refreshStatistics(modelName, objectName) {
    // 文章模块
    if (modelName === "article") {
      let component = this.selectComponent("#article");
      if (objectName === "view") {
        component.refreshArticleViewNum();
      } else if (objectName === "useful") {
        component.refreshCurrentArticleUsefulNum();
      }
    }
  }
})