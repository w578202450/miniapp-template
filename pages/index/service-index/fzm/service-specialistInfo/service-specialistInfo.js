// pages/index/service-index/fzm/service-specialistinfo/service-specialistinfo.

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageStyle: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    serviceBg: '/images/home/home_service_banner.png',
    goodAts: ["风湿骨病", "类风湿关节炎", "类风湿关节炎"]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 立即问诊
     */
    goToInquiryOption() {

    },

    /**
     * 查看介绍(预览门诊医生详情)
     */
    previewDoctorInfo() {

    }
  }
})