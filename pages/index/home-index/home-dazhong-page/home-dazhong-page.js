// pages/index/home-index/home-dazhong-page/hom-dazhong-page.js
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
    onload: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    homeBannerDefaultUrl: "/images/home/home_banner_default.png", // 首页banner
    middleOnefei1: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei1.png",
    middleOnefei2: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei2.png",
    middleOnefei3: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei3.png",
    middleOnefei4: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei4.png",
    helpfulNum: 12324,
    medicineIcon: "/images/home/home_dazhong_medicine.png",
    rectangleBackgroundImg: "/images/home/home_rectangle_background.png",
    // news: [
    //   '李**     已获得免费持续治疗援助1支       刚刚',
    //   '苏**     已获得免费持续治疗援助2支       1分钟前',
    //   '张**     已获得免费援助药品一个月用量    3分钟前',
    //   '王**     已获得免费持续治疗援助2支       6分钟前',
    //   '程**     已获得免费持续治疗援助3支       8分钟前',
    //   '吴**     已获得免费援助药品二个月用量    10分钟前',
    // ],
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
      let date1 = "1970-01-01 00:00:00"; // 开始时间
      let date2 = new Date(); // 结束时间
      let date3 = date2.getTime() - new Date(date1).getTime(); // 时间差的毫秒数
      let randomNum = Math.round((date3 / 1000 - (3600 * 24 * 365 * 49.6)) / 1800); /** 一小时加两个 */
      that.setData({
        helpfulNum: (int)(Math.random() * 100)
      });
      console.log("========helpfulNum=======" + that.data.helpfulNum);
    },
  },

  observers: {

  }
})