// components/tmc-button/tmc-button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageStyle: {
      type: String,
      value: ''
    },
    title: {
      type: String
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
    buttonTap: function () {
      this.triggerEvent('buttonTap')
    }
  }
})
