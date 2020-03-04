// components/navigation-bar/navigation-bar.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 页面标题文字
    pageName: {
      type: String,
      value: "标题"
    },
    // 页面标题文字颜色（只支持black / white）
    navbarTextStyle: {
      type: String,
      value: "black"
    },
    // 是否显示房子按钮
    showHome: {
      type: Boolean,
      value: true
    },
    // 导航栏背景色
    bgColor: {
      type: String,
      value: "yellow"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function() {
      wx.navigateBack({
        delta: 1
      });
    },
    //回主页
    toIndex: function() {
      wx.navigateTo({
        url: '/pages/index/bhx/home-index'
      });
    }
  }
})