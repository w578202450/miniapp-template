// pages/index/home-index/home-module-doctorteam-item/home-module-doctorteam-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 医师团队item
     */
    pageItem: {
      type:Object,
      value:{}
    },
    diseaseName: {
      type: Object,
      value: []
    },
    /**
     * 容器样式
     */
    pageStyle: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // diseaseName: []
    defaultPhotoUrl:"../../../../images/chat/personBacImg.png"
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