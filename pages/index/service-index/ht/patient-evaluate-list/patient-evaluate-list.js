// pages/index/service-index/ht/patient-evaluate-list/patient-evaluate-list.js
const HTTP = require('../../../../../utils/http-util');
const commonFun = require('../../../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelIconSrc: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/levelIcon.png", // 星级图标
    materialImgBac: "https://com-shuibei-peach-static.100cbc.com/tmcpro/images/home/imgNone.png", // 评论内容中的背景图片
    videoIconSrc: "/images/chat/videoPlayIcon.png", // 视频播放按钮的图标
    illnessSumList: [], // 患者评价的统计星级数据
    evaluateListData: [], // 患者评价的内容
    httpParams: {} // 查看更多数据的请求参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "侯丽萍医生的评价"
    });
    let that = this;
    that.data.httpParams = JSON.parse(options.httpParams);
    console.log(that.data.httpParams);
    // that.getPatientEvaluateListFun(); // 查询：患者评价列表数据
    that.initNoRealyData(); // 拟定假数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return commonFun.onShareAppMessageFun();
  },

  /**查询：患者评价列表数据 */
  getPatientEvaluateListFun: function() {
    let that = this;
    let params = {
      doctorID: that.data.httpParams.doctorID
    };
    HTTP.getPatientEvaluateList(params).then(res => {
      if (res.data) {
        that.setData({
          evaluateListData: res.data.evaluateListData ? res.data.evaluateListData: [],
          illnessSumList: res.data.illnessSumList ? res.data.illnessSumList : []
        });
      }
    });
  },

  /**操作：点击某张图片或者某个视频 */
  toDetailFun: function(e) {
    let that = this;
    console.log(e);
    let index = e.currentTarget.dataset.index; // 点击的评论（即item）所在下标
    let indexs = e.currentTarget.dataset.indexs; // 点击的图片所在评论的materialData中的（即items）下标
    let materialItem = {
      ...e.currentTarget.dataset.material
    }; // 点击的items
    // materialType： 0图片 1视频
    if (materialItem.materialType == 0) {
      let allMaterial = that.data.evaluateListData[index].materialData; // 临时存储点击的评论的所有图片、视频素材
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
      console.log("点击了视频，需要跳转到视频播放页");
      // let materialUrl = materialItem.materialUrl;
      // wx.navigateTo({
      //   url: ''
      // });
    }
  },

  initNoRealyData: function() {
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
          },

        ]
      },
      {
        keyID: "11",
        disease: "类风湿关节炎",
        curativeEffectName: "满意",
        doctorAttitudeName: "满意",
        patientFace: "https://wx.qlogo.cn/mmopen/vi_32/nibb7W6bx5xlU6A10icFLGnNr7KpftYFiaqNpciccwWlt2Ps657yq4jHwdCQTXribHBxdEiangOq9VrzAicZ6dBhvicPvA/132",
        patientName: "张三三",
        content: "张医生对待病人认真负责，问诊细心，真的非常感谢！也庆幸自己能遇到这么好的医生，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了，现在我的情况吃了药好多了",
        addTime: "2020-02-20 00:15:00",
        materialData: [{
          keyID: "1201",
          materialType: 0,
          materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
        }, {
          keyID: "1202",
          materialType: 0,
          materialUrl: "https://com-shuibei-peach-hospital-cs.100cbc.com/res/19122116554357936820511001/20011909031475771110201210.jpg"
        }]
      }
    ]; // 图文视频

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
      evaluateListData: evaData,
      illnessSumList: illList
    });
  }
})