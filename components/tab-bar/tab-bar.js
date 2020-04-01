// components/tab-bar/tab-bar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    secIndex: {
      type: Number,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar: app.globalData.tabbar
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectedTabFun: function(e) {
      let that = this;
      let index = e.currentTarget.dataset.index;
      app.globalData.tabbar.list.forEach((item, ind) => {
        item.selected = false;
        if (index == ind) {
          item.selected = true;
        }
      });
      console.log(app.globalData.isInitInfo);
      if (index == 1) {
        if (app.globalData.isInitInfo) {
          wx.navigateTo({
            url: '/pages/online-inquiry/inquiry/chat/chat'
          });
        } else {
          wx.switchTab({
            url: that.data.tabbar.list[index].pagePath
          });
        }
      } else {
        wx.switchTab({
          url: that.data.tabbar.list[index].pagePath
        });
      }
    }
  }
})
