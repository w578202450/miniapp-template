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
    levelIconSrc: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/levelIcon.png", // 星级图标
    unfoldIconSrc: "/images/home/unfoldIcon.png", // 展开图标
    packUpIconSrc: "/images/home/packUpIcon.png", // 收起图标
    materialImgBac: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png", // 评论内容中的背景图片
    videoIconSrc: "/images/chat/videoPlayIcon.png", // 视频播放按钮的图标
    isShowAllContent: false, // 是否展开显示所有评价内容
    unfoldTxt: "展开", // 展开、收起字样
    illnessSumList: [], // 患者评价的统计星级数据
    evaluateData: [], // 患者评价的内容
    httpParams: {} // 传递给下一个组件：查看更多数据的请求参数
  },

  /**attached：节点树完成，可以用setData渲染节点，但无法操作节点 */
  attached: function() {
    // let that = this;
    // if (that.data.evaluateAllData) {
    //   let httpParamsData = {
    //     nextPage: "/pages/index/service-index/ht/patient-evaluate-list/patient-evaluate-list",
    //     doctorID: that.data.evaluateAllData.doctorID,
    //     orgID: that.data.evaluateAllData.orgID
    //   }
    //   that.setData({
    //     evaluateData: that.data.evaluateAllData.evaluateData[0] ? that.data.evaluateAllData.evaluateData[0]: [],
    //     illnessSumList: that.data.evaluateAllData.illnessSumList ? that.data.evaluateAllData.illnessSumList: [],
    //     httpParams: httpParamsData
    //   });
    // }

    let that = this;
    // 拟定假数据
    let evaData = [{
      keyID: "11",
      disease: "类风湿关节炎",
      curativeEffectName: "满意",
      doctorAttitudeName: "满意",
      patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132",
      patientName: "张三三",
      content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了",
      addTime: "2020-02-20 00:15:00",
      materialList: [{
        keyID: "1101",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1102",
        materialType: 1,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1103",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1104",
        materialType: 1,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1105",
        materialType: 1,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1106",
        materialType: 1,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1107",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1108",
        materialType: 1,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }, {
        keyID: "1109",
        materialType: 0,
        materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
      }]
    }]; // 图文视频

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
      }
    ];
    this.setData({
      evaluateData: evaData,
      illnessSumList: illList,
      httpParams: {
        nextPage: "/pages/index/service-index/ht/patient-evaluate-list/patient-evaluate-list",
        doctorID: "1000",
        orgID: "1223"
      }
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
      let that = this;
      console.log(e);
      let index = e.currentTarget.dataset.index; // 点击的评论（即item）所在下标
      let indexs = e.currentTarget.dataset.indexs; // 点击的图片所在评论的materialList中的（即items）下标
      let materialItem = { ...e.currentTarget.dataset.material
      }; // 点击的items
      // materialType： 0图片 1视频
      if (materialItem.materialType == 0) {
        let allMaterial = that.data.evaluateData[index].materialList; // 临时存储点击的评论的所有图片、视频素材
        let previewImgArr = []; // 要展示的图片集合
        allMaterial.forEach((item) => {
          if (item.materialType == 0) {
            previewImgArr.push(item.materialUrl);
          }
        });
        wx.previewImage({
          current: materialItem.materialUrl, // 当前图片地址 必须是---线上---的图片
          urls: previewImgArr, // 所有要预览的图片的地址集合 数组形式
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {}
        });
      } else if (materialItem.materialType == 1) {
        if (materialItem.materialUrl.length == 0 || !materialItem.materialUrl) {
          wx.showToast({
            title: '视频链接地址错误，无法查看',
          });
          return;
        }
        console.log("点击的视频，需要跳转到视频播放页");
        let materialData = {
          materialType: 1, // （必传）要查看的素材类型 0图文 1视频
          title: "患者评价相关素材", // 待确认，可先不传
          url: materialItem.materialUrl, // （必传）图文、视频 的网络地址链接
          logoUrl: "" // 视频的封面图片(没有就传空字符窜)
        };
        wx.navigateTo({
          url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
        });
      }
    }
  }
})