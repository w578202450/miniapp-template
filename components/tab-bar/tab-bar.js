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

  attached: function () {
    // 在组件实例进入页面节点树时执行
    //获得popup组件：登录确认框
    this.popup = this.selectComponent("#loginDialogCom");
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
        if (app.globalData.isInitInfo == "ready") {
          wx.navigateTo({
            url: '/pages/online-inquiry/inquiry/chat/chat'
          });
        } else {
          // wx.switchTab({
          //   url: that.data.tabbar.list[index].pagePath
          // });
          let nextPageName = "chat";
          this.popup.showPopup(nextPageName); // 显示登录确认框
        }
      } else {
        wx.switchTab({
          url: that.data.tabbar.list[index].pagePath
        });
      }
    },
    /**取消事件 */
    _error() {
      this.popup.hidePopup();
    },

    /**确认事件 */
    _success() {
      this.popup.hidePopup();
    }
  }
})
