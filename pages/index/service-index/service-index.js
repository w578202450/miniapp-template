// pages/index/service-index/service-index.js
const app = getApp();
const commonFun = require('../../../utils/common.js');
const HTTP = require('../../../utils/http-util');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    isSearchState: false, // 是否第一次加载
    shareOrgID: "", // 进入页面携带的orgID
    shareAssistantStaffID: "", // 进入页面携带的医助ID
    doctorInfo: {}, // 医师的信息
    certifyInfo: {}, // 医师资质许可证等信息
    assistantDoctorInfo: {}, // 助理医师的信息
    // 患者评价相关的所有数据
    evaluateAllData: {
      evaluateData: [],
      illnessSumList: [],
      doctorID: "",
      orgID: ""
    },
    // doctorStaffID: "", // 门诊医生staffId
    scrollTop: 0,
    // 患者分享相关数据
    patientShareGetData: {
      keyID: "",
      patientName: "",
      patientFace: "",
      patientAddress: "",
      contentSummary: "",
      detailUrl: "",
      publishDate: ""
    },
    // 患者手记相关数据
    inquiryCaseData: {
      keyID: "",
      patientName: "",
      patientFace: "",
      patientAddress: "",
      contentSummary: "",
      detailUrl: "",
      publishDate: ""
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log("进入小程序首页携带的参数：" + JSON.stringify(options));
    app.globalData.isHaveOptions = false; // 初始化进入小程序有无携带参数状态
    if (options) {
      if (options.q) { // 通过扫码进入时：q的值为url带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数，状态改为true
        var scan_url = decodeURIComponent(options.q); // 赋值q参数
        let shareOrgID = that.initOptionsFun(scan_url, "orgID"); // 解析q的值中的orgID
        let shareAssistantStaffID = that.initOptionsFun(scan_url, "assistantStaffID"); // 解析q的值中的assistantStaffID
        that.data.shareOrgID = shareOrgID ? shareOrgID : "";
        wx.setStorageSync("shareOrgID", shareOrgID);
        that.data.shareAssistantStaffID = shareAssistantStaffID ? shareAssistantStaffID : "";
        wx.setStorageSync("shareAssistantStaffID", shareAssistantStaffID);
      } else if (options.assistantStaffID || options.orgID) { // 通过分享的小程序进入时：直接带参
        app.globalData.isHaveOptions = true; // 进入小程序携带有参数
        if (options.orgID) {
          that.data.shareOrgID = options.orgID;
          wx.setStorageSync("shareOrgID", options.orgID);
        }
        if (options.assistantStaffID) {
          that.data.shareAssistantStaffID = options.assistantStaffID;
          wx.setStorageSync("shareAssistantStaffID", options.assistantStaffID);
        }
      }
    }
    let sendOptions = { ...options
    };
    commonFun.startLoginFun(sendOptions); // 尝试自动登录 
    that.initDocInfoFun();
    that.patientShareGet();
    that.inquiryCaseGet();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialog");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.isSearchState) {
      this.initDocInfoFun();
      this.patientShareGet();
      this.inquiryCaseGet();
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

  /**初始化数据 */
  initDocInfoFun: function() {
    let that = this;
    if (that.data.shareAssistantStaffID) {
      that.getDefaultDocInfoFun();
    } else {
      wx.getStorage({
        key: 'personInfo',
        success: function(res) {
          // console.log("获取的用户缓存问诊信息：" + JSON.stringify(res));
          that.fetchDoctorInfo(res.data.doctorStaffID); // 获取主治医师信息
          that.fetchAssistantDoctorInfo(res.data.assistantStaffID); // 获取助理医生信息
          that.getOrderCommentData(res.data.orgID, res.data.doctorStaffID); // 获取患者评价信息
          // that.data.doctorStaffID = res.data.doctorStaffID;
          that.getToolClassifyById(res.data.orgID); // 文章模块分类获取
        },
        fail: function(err) {
          // console.log("获取用户缓存问诊信息失败：" + JSON.stringify(err));
          that.getDefaultDocInfoFun();
        },
        complete: function(e) {
          that.setData({
            isSearchState: true
          });
        }
      });
    }
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
              doctorInfo: res.data
            });
            app.globalData.doctorInfo = res.data;
            wx.setStorageSync('doctorInfo', res.data);
            that.fetchDoctorQualification(res.data.doctorID); // 获取医生资质编号
            // 获取主治医生的专治疾病
            that.getDoctorDiseaseByDoctorID(res.data.doctorID).then(function(res) {
              that.setData({
                doctorDisease: res
              })
            })

          }
        }
      }).catch(e => {
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
            that.setData({
              assistantDoctorInfo: res.data
            });
            wx.setStorageSync('assistantInfo', res.data);
            app.globalData.assistantInfo = res.data;
            // 获取主治医生的专治疾病
            that.getDoctorDiseaseByDoctorID(res.data.doctorID).then(function(res) {
              that.setData({
                assistantdoctorDisease: res
              })
            })
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

  /**查询：无缓存患者信息时，查询默认推荐医生信息 */
  getDefaultDocInfoFun: function() {
    let that = this;
    HTTP.getDefaultDocInfo({
        orgID: that.data.shareOrgID,
        assistantStaffID: that.data.shareAssistantStaffID,
        entryType: ""
      })
      .then(res => {
        console.log("获取的临时推荐医生信息：" + JSON.stringify(res.data));
        if (res.code == 0) {
          wx.setStorageSync("shareAssistantStaffID", res.data.assistantStaffID);
          wx.setStorageSync("shareOrgID", res.data.orgID);
          wx.setStorageSync('personInfo', res.data);
          that.getOrderCommentData(res.data.orgID, res.data.doctorStaffID); // 获取患者评价信息
          that.fetchDoctorInfo(res.data.doctorStaffID); // 获取主治医师信息
          that.fetchAssistantDoctorInfo(res.data.assistantStaffID); // 获取助理医生信息
        }
      });
  },

  /**
   * 查询：患者评价信息
   */
  getOrderCommentData: function(orgID, doctorStaffID) {
    let that = this;
    HTTP.orderCommentGet({
      orgID: orgID
    }).then(res => {
      console.log("获取的患者评价信息：" + JSON.stringify(res.data));
      if (res.data) {
        that.setData({
          ["evaluateAllData.evaluateData"]: res.data,
          ["evaluateAllData.doctorID"]: doctorStaffID,
          ["evaluateAllData.orgID"]: orgID
        });
      }
    });
  },

  //------------------------------fzm-------------------------------
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
  getToolClassifyById(orgID) {
    HTTP.getToolClassifyById({
      classifyType: 2,
      orgID: orgID
    }).then(res => {
      let tempTitles = res.data
      // 初始化组件数据源
      let articleDatas = {};
      tempTitles.forEach((item) => {
        let currentCategoryData = {};
        currentCategoryData["hasMore"] = false
        currentCategoryData["hasData"] = false
        currentCategoryData["pageSize"] = 4
        currentCategoryData["pageIndex"] = 1
        articleDatas[item.keyID] = currentCategoryData;
      })
      this.setData({
        articleTitles: tempTitles,
        articleDatas: articleDatas
      })

      // 初始化文章模块第一栏的数据
      if (tempTitles.length > 0) {
        this.articleByClassifyId(tempTitles, articleDatas)
      }
    });
  },
  /**
   * 根据分类id获取文章列表
   */
  articleByClassifyId(tempTitles, articleDatas) {
    // 初始化第一条数据
    let classifyID = tempTitles[0].keyID;
    let orgID = tempTitles[0].orgID;
    let currentCategoryData = articleDatas[classifyID];
    HTTP.articleByClassifyId({
      "orgID": orgID,
      "pageSize": 10,
      "pageIndex": 1,
      "classifyID": classifyID
    }).then(res => {
      let list = res.data;
      if (list && list.datas && list.datas.length > 0) {
        currentCategoryData["hasData"] = true;
        currentCategoryData["hasMore"] = list.datas.length < currentCategoryData.pageSize ? false : true;
        currentCategoryData.datas = list.datas;
        articleDatas[classifyID] = currentCategoryData;
        this.setData({
          currentCategoryData: currentCategoryData,
          articleDatas: articleDatas
        });
      } else {
        // 不许渲染数据
      }
    })
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
          if (res.code == 0) {
            if (res.data) {
              var disease = []
              for (var index in res.data) {
                disease.push(res.data[index].diseaseName)
              }
              resolve(disease)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none'
            })
            resolve([]);
          }
        }).catch(e => {
          wx.showToast({
            title: '连接失败',
            icon: 'none'
          })
          resolve([]);
        })
    })
    return promise;

  },

  /**
   * 操作：开始问诊
   * 1.已登录，直接到问诊页
   * 2.未登录，授权登录
   *  */
  toOnlineInqueryFun: function() {
    if (app.globalData.isInitInfo) {
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
  },

  //------------------------------fzm-------------------------------
  /**
   * 查询：患者分享信息
   */
  patientShareGet: function(orgID, sectionID, doctorStaffID) {
    let that = this;
    HTTP.patientShareGet({
      orgID: "19101610315474350800511001",
      sectionID: "20021811095450646230521001",
      doctorStaffID: "19101610315474330040514001",
    }).then(res => {
      console.log("获取的患者ASDASD：" + JSON.stringify(res.data));
      if (res.data) {
        that.setData({
          ["patientShareGetData.keyID"]: res.data.keyID,
          ["patientShareGetData.patientName"]: res.data.patientName,
          ["patientShareGetData.patientFace"]: res.data.patientFace,
          ["patientShareGetData.patientAddress"]: res.data.patientAddress,
          ["patientShareGetData.contentSummary"]: res.data.contentSummary,
          ["patientShareGetData.detailUrl"]: res.data.detailUrl,
          ["patientShareGetData.publishDate"]: res.data.publishDate
        });
        // console.log(this.data.patientShareGetData);
      }
    });
  },
  /**
   * 查询：患者手记信息
   */
  inquiryCaseGet: function(orgID, sectionID, doctorStaffID) {
    let that = this;
    HTTP.inquiryCaseGet({
      orgID: "19101610315474350800511001",
      sectionID: "20021811095450646230521001",
      doctorStaffID: "19101610315474330040514001",
    }).then(res => {
      // console.log("获取的患者ASDASD：" + JSON.stringify(res.data));
      if (res.data) {
        that.setData({
          ["inquiryCaseData.keyID"]: res.data.keyID,
          ["inquiryCaseData.authorName"]: res.data.authorName,
          ["inquiryCaseData.photoUrl"]: res.data.photoUrl,
          ["inquiryCaseData.patientAddress"]: res.data.patientAddress,
          ["inquiryCaseData.contentSummary"]: res.data.contentSummary,
          ["inquiryCaseData.detailUrl"]: res.data.detailUrl,
          ["inquiryCaseData.publishDate"]: res.data.publishDate
        });
        // console.log(this.data.patientShareGetData);
      }
    });
  }
})