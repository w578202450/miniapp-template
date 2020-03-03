var appBehavior = require('../behaviors/fzm-behaviors')


Component({
  behaviors: [appBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
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
    serviceBg: 'https://com-shuibei-peach-tmc-cs.100cbc.com/content/20030314263775883480201210.png',
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
      this.triggerEvent('toOnlineInqueryFun')
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