
var appBehavior = require('../behaviors/fzm-behaviors')

Component({
  behaviors: [appBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    doctorInfo: {
      type: Object,
      value: {}
    },
    isInquiryNav: {
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
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})