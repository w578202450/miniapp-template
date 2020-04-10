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

  },

  /**
   * 组件的初始数据
   */
  data: {
    homeBannerDefaultUrl: "/images/home/home_banner_default.png",
    middleOnefei1: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei1.png",
    middleOnefei2: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei2.png",
    middleOnefei3: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei3.png",
    middleOnefei4: "https://com-shuibei-peach-static.100cbc.com/tmccontent/6788/org/fei4.png",
    medicineIcon: "/images/home/home_dazhong_medicine.png",
    rectangleBackgroundImg: "/images/home/home_rectangle_background.png",
    news: [
      '李**     已获得免费持续治疗援助1支       刚刚',
      '苏**     已获得免费持续治疗援助2支       1分钟前',
      '张**     已获得免费援助药品一个月用量    3分钟前',
      '王**     已获得免费持续治疗援助2支       6分钟前',
      '程**     已获得免费持续治疗援助3支       8分钟前',
      '吴**     已获得免费援助药品二个月用量    10分钟前',

    ],
    autoplay: true,
    interval: 1000,
    duration: 2000,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 立即进入专家门诊 */
    toServiceIndexFun() {
      this.triggerEvent('toServiceIndexFun');
    }
  }
})