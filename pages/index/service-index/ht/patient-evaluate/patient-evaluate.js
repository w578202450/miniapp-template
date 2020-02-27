// pages/index/service-index/ht/patient-evaluate/patient-evaluate.js
var HTTP = require('../../../../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 医生的ID
    doctorID: {
      type: String,
      value: ""
    },
    // 查看更多的h5链接
    moreBtnUrl: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    levelIconSrc: "/images/home/levelIcon.png", // 星级图标
    unfoldIconSrc: "/images/home/unfoldIcon.png", // 展开图标
    packUpIconSrc: "/images/home/packUpIcon.png", // 收起图标
    isShowAllContent: false, // 是否展开显示所有评价内容
    unfoldTxt: "展开", // 展开、收起字样
    illnessSumList: [
      { keyID: "1", illnessName: "风湿骨病", num: 60 },
      { keyID: "2", illnessName: "类风湿关节炎", num: 40 },
      { keyID: "3", illnessName: "肌肉萎缩", num: 36 },
      { keyID: "4", illnessName: "痛风", num: 24 },
      { keyID: "5", illnessName: "关节肿痛", num: 60 },
    ], // 患者评价的统计星级数据
    evaluateData: [
      { keyID: "11", disease: "类风湿关节炎", curativeEffectName: "满意", doctorAttitudeName: "满意", patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132", patientName: "张三三", content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了", addTime: "2020-02-20 00:15:00" }
    ] // 患者评价的内容
  },

  attached: {

  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    /**查询：患者评论信息 */
    getEvaluateDataFun: function() {
      let that = this;
      let params = {
        doctorID: that.data.doctorID
      }
      HTTP.getEvaluateData(params).then(res => {

      });
    },

    /**操作：展开、收起评论内容 */
    unfoldContentFun: function() {
      let that = this;
      if (that.data.isShowAllContent) {
        that.setData({
          isShowAllContent: false,
          unfoldTxt: "展开"
        });
      } else {
        that.setData({
          isShowAllContent: true,
          unfoldTxt: "收起"
        });
      }
    }
  }
})
