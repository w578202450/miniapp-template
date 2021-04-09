Page({

  /**
   * 组件的初始数据
   */
  data: {
    satisfybgtitle: "/images/home/title_bg.png",
    satisfybg1: "https://com-shuibei-peach-static.100cbc.com/tmccontent/8788/org/feichange01.png",
    satisfybg2: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/feichange02.png",
    homeDazhongLeft: "/images/home/home_dazhong_left.png",
    homeDazhongRight: "/images/home/home_dazhong_right.png",
    homeBannerDefaultUrl: "https://com-shuibei-peach-static.oss-cn-shenzhen.aliyuncs.com/tmccontent/8788/jiesao.png", // 首页banner
    middleOnefei1: "https://com-shuibei-peach-static.100cbc.com/tmccontent/8788/glh1.png",
    middleOnefei2: "https://com-shuibei-peach-static.100cbc.com/tmccontent/8788/glh2.png",
    middleOnefei3: "https://com-shuibei-peach-static.100cbc.com/tmccontent/8788/glh5.png",
    middleOnefei4: "https://com-shuibei-peach-static.100cbc.com/tmccontent/8788/org/fei4.png",
    helpfulNum: 12324,
    helpmedicineIcon: "/images/home/help_medicine.png",
    medicineIcon: "/images/home/home_dazhong_medicine.png",
    bottomIcon: "/images/home/home_dazhong_bottom_icon.png",
    rectangleBackgroundImg: "/images/home/home_rectangle_background.png",
    patientList: [
      {
        keyID: "1",
        patientName: "李**",
        content: "已获得免费持续治疗援助1支",
        time: "刚刚"
      },
      {
        keyID: "2",
        patientName: "苏**",
        content: "已获得免费持续治疗援助2支",
        time: "1分钟前"
      },
      {
        keyID: "3",
        patientName: "刘**",
        content: "已获得免费援助药品1个月用量",
        time: "3分钟前"
      },
      {
        keyID: "4",
        patientName: "蒋**",
        content: "已获得免费持续治疗援助1支",
        time: " 8分钟前"
      },
      {
        keyID: "5",
        patientName: "王**",
        content: "已获得免费持续治疗援助2支",
        time: "15分钟前"
      },
      {
        keyID: "6",
        patientName: "李**",
        content: "已获得免费援助药品1个月用量",
        time: "19分钟前"
      },
      {
        keyID: "7",
        patientName: "陈**",
        content: "已获得免费持续治疗援助2支",
        time: "20分钟前"
      },
      {
        keyID: "8",
        patientName: "曾**",
        content: "已获得免费持续治疗援助1支",
        time: "27分钟前"
      },
      {
        keyID: "9",
        patientName: "赖**",
        content: "已获得免费持续治疗援助2支",
        time: "半小时前"
      },
      {
        keyID: "10",
        patientName: "邱**",
        content: "已获得免费持续治疗援助2支",
        time: "半小时前"
      },
      {
        keyID: "11",
        patientName: "邢**",
        content: "已获得免费援助药品1个月用量",
        time: "半小时前"
      },
      {
        keyID: "12",
        patientName: "徐**",
        content: "已获得免费持续治疗援助2支",
        time: "半小时前"
      },
      {
        keyID: "13",
        patientName: "贾**",
        content: "已获得免费持续治疗援助1支",
        time: "1小时前"
      },
      {
        keyID: "14",
        patientName: "汪**",
        content: "已获得免费持续治疗援助2支",
        time: "1小时前"
      }
    ],

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