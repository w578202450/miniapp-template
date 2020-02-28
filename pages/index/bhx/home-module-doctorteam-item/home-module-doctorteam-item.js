// pages/index/bhx/home-module-doctorteam-item/home-module-doctorteam-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    doctorinfo:{
      type:Object,
      value:{}
    },
    /**
     * 容器样式
     */
    pageStyle: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodAts: ["风湿骨病", "痛风"]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickItem(){
      this.triggerEvent('clickItem');
    }
  }
})