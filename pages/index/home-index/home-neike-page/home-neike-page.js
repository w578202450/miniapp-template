Component({
  /**
   * 组件的属性列表
   */
  properties: {
    homeBannerDefaultUrl: {
      type: String,
      value: ""
    },
    rectangleBackgroundImg: {
      type: String,
      value: ""
    },
    onload:{
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
    helpfulNum: 18946,
    rectangleBackgroundImgs: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/neike-bg.png",
    contentImg: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/neike-bg2.png",
    autoplay: true,
    interval: 1000,
    duration: 1500,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 立即进入专家门诊 */
    toServiceIndexFun() {
      this.triggerEvent('toServiceIndexFun');
    },
    createHelpfulNumFun: function() {
      let that = this;
      var data = "1970-01-01 00:00:00";
      let date1 = new Date(data.replace(/-/g, '/')); // 开始时间
      let date2 = new Date(); // 结束时间
      // console.log(date1.getTime());
      // console.log(date2.getTime());
      let date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
      let randomNum = Math.round((date3 / 1000 - (3600 * 24 * 365 * 49.6)) / 1800); /** 一小时加两个 */
      that.setData({
        helpfulNum: randomNum + parseInt(wx.getStorageSync("shareOrgID").substring(15,19)) * 10
      });
    }
  },

})