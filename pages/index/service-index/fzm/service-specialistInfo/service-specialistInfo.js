var appBehavior = require('../behaviors/fzm-behaviors')


Component({
  behaviors: [appBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    doctorInfo: {
      type: Object,
      value: null
    },

    certifyInfo: {
      type: Object,
      value: {}
    },

    isCustomTitle: {
      type: Boolean,
      value: false
    },

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
      console.log("this.data.doctorInfo-------",this.data.doctorInfo);
    },

    /**
     * 查看介绍(预览门诊医生详情)
     */
    previewDoctorInfo() {
      this.triggerEvent('previewDoctorInfo')
      console.log("this.data.doctorInfo-------", this.data.doctorInfo);
    }
  }
})