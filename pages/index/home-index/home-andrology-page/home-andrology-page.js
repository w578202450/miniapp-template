Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onload: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        this.createHelpfulNumFun()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    homeTopBackgroundImage: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/top.png",
    hometitle1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/title1.png",
    hometitle2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/title2.png",
    hometitle3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/title3.png",
    hometopicon1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/top-icon1.png",
    hometopicon2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/top-icon2.png",
    hometopicon3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/top-icon3.png",
    hometopicon4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/top-icon4.png",
    homemiddleicon1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/middle-icon1.png",
    homemiddleicon2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/middle-icon2.png",
    homemiddleicon3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/middle-icon3.png",
    homemiddleicon4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/middle-icon4.png",
    homemiddleicon5: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/middle-icon5.png",
    homebottombanner: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/bottom-banner.png",
    homemenu1: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/menu1.png",
    homemenu2: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/menu2.png",
    homemenu3: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/menu3.png",
    homemenu4: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/org/7044/menu4.png",
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