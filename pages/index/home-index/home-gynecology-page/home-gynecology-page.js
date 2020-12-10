Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    homeTopBackgroundImage: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/top.png",
    hometitle1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/title1.png",
    hometitle2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/title2.png",
    hometitle3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/title3.png",
    hometitle4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/title4.png",
    homebg1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/bg1.png",
    homebg2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/bg2.png",
    homemiddlebanner1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-banner1.png",
    homemiddlebanner2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-banner2.png",
    homemiddlebanner3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-banner3.png",
    homemiddlebanner4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-banner4.png",
    homeads1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/ads1.png",
    homeico1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-icon1.png",
    homeico2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/middle-icon2.png",
    homemenu1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/menu1.png",
    homemenu2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/menu2.png",
    homemenu3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/menu3.png",
    homemenu4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/3419/menu4.png",
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
      let date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
      let randomNum = Math.round((date3 / 1000 - (3600 * 24 * 365 * 49.6)) / 1800); /** 一小时加两个 */
      that.setData({
        helpfulNum: randomNum + parseInt(wx.getStorageSync("shareOrgID").substring(15,19)) * 10
      });
    }
  }
})
