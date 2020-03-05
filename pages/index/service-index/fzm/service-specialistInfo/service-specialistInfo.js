var appBehavior = require('../behaviors/fzm-behaviors')


Component({
  behaviors: [appBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    sectionBanner: {
      type: String,
      value: null
    },
    // 医生信息
    doctorInfo: {
      type: Object,
      value: null
    },
    // 医生专治疾病
    doctorDisease: {
      type: Object,
      value: null
    },
    // 执业许可证信息
    certifyInfo: {
      type: Object,
      value: {}
    },
    // 自定义标题 true:问诊导航栏 false:普通导航栏
    isInquiryNav: {
      type: Boolean,
      value: false
    },
    // 普通导航栏标题
    navTitle: {
      type: String,
      value: "专家门诊"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inquiryBoxHeight: 34,
    // 好评率图标
    comment_icon: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/home_commentNums.png",
    // 服务人数图标
    sever_icon: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/home_serverNums.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 立即问诊
     */
    goToInquiryOption() {
      this.triggerEvent('toOnlineInqueryFun')
      console.log("this.data.doctorInfo-------", this.data.doctorInfo);
    },

    /**
     * 查看介绍(预览门诊医生详情)
     */
    previewDoctorInfo() {
      let staffID = this.data.doctorInfo.keyID
      if (staffID) {
        wx.navigateTo({
          url: '/pages/online-inquiry/doctor-details/doctor-details?staffID=' + staffID,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        });
      }
    }
  }
})