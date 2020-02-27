// pages/index/service-index/ht/patient-evaluate/patient-evaluate.js
var HTTP = require('../../../../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 患者评价的所有相关数据
    evaluateAllData: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    levelIconSrc: "/images/home/levelIcon.png", // 星级图标
    unfoldIconSrc: "/images/home/unfoldIcon.png", // 展开图标
    packUpIconSrc: "/images/home/packUpIcon.png", // 收起图标
    materialImgBac: "/images/home/imgNone.png", // 评论内容中的背景图片
    isShowAllContent: false, // 是否展开显示所有评价内容
    unfoldTxt: "展开", // 展开、收起字样
    illnessSumList: [], // 患者评价的统计星级数据
    evaluateData: [], // 患者评价的内容
    moreBtnUrl: "" // 查看更多的h5链接
  },

/**attached：节点树完成，可以用setData渲染节点，但无法操作节点 */
  attached: function() {
    let that = this;
    // if (that.data.evaluateAllData) {
    //   that.setData({
    //     evaluateData: alldData.evaluateData,
    //     illnessSumList: alldData.illnessSumList,
    //     moreBtnUrl: alldData.moreBtnUrl
    //   });
    // }


   // 拟定假数据
    // let evaData = [{
    //     keyID: "11",
    //     disease: "类风湿关节炎",
    //     curativeEffectName: "满意",
    //     doctorAttitudeName: "满意",
    //     patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132",
    //     patientName: "张三三",
    //     content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了",
    //     addTime: "2020-02-20 00:15:00"
    //   }]; // 文字

    let evaData = [{
      keyID: "11",
      disease: "类风湿关节炎",
      curativeEffectName: "满意",
      doctorAttitudeName: "满意",
      patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132",
      patientName: "张三三",
      content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了",
      addTime: "2020-02-20 00:15:00",
      materialData: [{
        keyID: "1101",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1102",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1103",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1104",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1105",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1106",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1107",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1108",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1109",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }]
    }]; // 图文

    // let evaData = [{
    //   keyID: "11",
    //   disease: "类风湿关节炎",
    //   curativeEffectName: "满意",
    //   doctorAttitudeName: "满意",
    //   patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132",
    //   patientName: "张三三",
    //   content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了",
    //   addTime: "2020-02-20 00:15:00",
    //   materialData: [{
    //     keyID: "1101",
    //     materialType: 0,
    //     materialUrl: ""
    //   }]
    // }]; // 文字、视频

    let illList = [{
      keyID: "1",
      illnessName: "风湿骨病",
      num: 60
    },
    {
      keyID: "2",
      illnessName: "类风湿关节炎",
      num: 40
    },
    {
      keyID: "3",
      illnessName: "肌肉萎缩",
      num: 36
    },
    {
      keyID: "4",
      illnessName: "痛风",
      num: 24
    },
    {
      keyID: "5",
      illnessName: "关节肿痛",
      num: 60
    }];
    this.setData({
      evaluateData: evaData,
      illnessSumList: illList
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    },

    /**操作：点击某张图片或者某个视频 */
    toDetailFun: function(e) {
      console.log(e);
    }
  }
})