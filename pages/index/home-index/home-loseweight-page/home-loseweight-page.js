// pages/index/home-index/home-999-page/home-999-page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    homeBannerDefaultUrl: {
      type: String,
      value: ""
    },
    onload: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.createHelpfulNumFun()
      }
    } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    homeTopBackgroundImage: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/top.png",
    homeads1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/ads1.png",
    homeads2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/ads2.png",
    homeico1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/top-icon1.png",
    homeico2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/top-icon2.png",
    homeico3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/top-icon3.png",
    homeico4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/top-icon4.png",
    homemiddlebanner1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/middle-banner1.png",
    homemiddlebanner2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/middle-banner2.png",
    homemiddlebanner3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/middle-banner3.png",
    homemiddlebanner4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/middle-banner4.png",
    homemenu1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/menu1.png",
    homemenu2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/menu2.png",
    homemenu3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/menu3.png",
    hometitle1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/title1.png",
    hometitle2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/8228/title2.png",
    helpfulNum: 12324
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 立即进入专家门诊 */
    toServiceIndexFun() {
      this.triggerEvent('toServiceIndexFun');
    },
    createHelpfulNumFun: function () {
      let that = this;
      var data = "1970-01-01 00:00:00";
      let date1 = new Date(data.replace(/-/g, '/')); // 开始时间
      let date2 = new Date(); // 结束时间
      // console.log(date1.getTime());
      // console.log(date2.getTime());
      let date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
      let randomNum = Math.round((date3 / 1000 - (3600 * 24 * 365 * 49.6)) / 1800); /** 一小时加两个 */
      that.setData({
        helpfulNum: randomNum
      });
    }
  }
})
