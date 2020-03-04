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
    // 页面标题文字（10个字以内）
    navbarTitle: {
      type: String,
      value: "标题"
    },
    // 页面标题文字颜色（只允许black，white）
    navbarTextStyle: {
      type: String,
      value: "black"
    },
    // 是否显示房子按钮（true，false）
    // showHome: {
    //   type: Boolean,
    //   value: true
    // },
    // 导航栏背景色
    bgColor: {
      type: String,
      value: "#fff"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    menuBBCRect: app.globalData.menuButtonBoundingClientRect,
    navBackIconWhite: "/images/public/public_left_white.png", // 返回按钮：白色
    navBackIconBlack: "/images/public/public_left.png", // 返回按钮：黑色
    navHomeIconWhite: "/images/public/navHome_white.png", // 房子按钮：白色
    navHomeIconBlack: "/images/public/navHome.png", // 房子按钮：黑色
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