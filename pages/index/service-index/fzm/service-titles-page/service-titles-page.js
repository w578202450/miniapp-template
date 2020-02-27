// pages/index/service-index/fzm/service-titles-page/service-titles-page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageStyle: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: []
    },
    selectedIndex: {
      type: Number,
      value: 0
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
    // 返回事件   
    selectedAction: function (e) {
      console.log("dssss", e.currentTarget.dataset.index);
      var index = e.currentTarget.dataset.index;
      this.triggerEvent('selectedIndex', index);
      this.setData({
        selectedIndex:index
      });
    },
  }
})