// pages/index/service-index/wth/docNotes/docNodes.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 查看更多
    httpParams: {
      type: Object,
      value: {}
    },
    // 主题
    title: {
      type: String,
      value: "标题"
    },
    // 更多按钮
    moreBtnName: {
      type: String,
      value: "更多"
    },
    // 患者信息
    paersonInfo: {
      type: Object,
      value: {
        patientName: "",
        patientFace: "",
        patientAddress: "",
        contentSummary: "",
        detailUrl: "",
        publishDate: "",
        authorName: "",
        photoUrl: ""
      },
      observer: function(value) {
        this.handlePersonInfo(value);
      }
    },
    // 评价内容
    type: {
      type: String,
      value: "患者"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    materialImgBac: "/images/chat/personBacImg.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePersonInfo(personInfo) {
      this.setData({
        queryStatisticsParamsOfUseful: {
          systemCode: "tmc",
          bizCode: "inquiryCase",
          objectID: personInfo.keyID,
          statisticsCode: "useful",
          orgID: "",
          deptID: "",
          userID: ''
        },
        queryStatisticsParamsOfView: {
          systemCode: "tmc",
          bizCode: "inquiryCase",
          objectID: personInfo.keyID,
          statisticsCode: "view",
          orgID: "",
          deptID: "",
          userID: ''
        }
      })
    },
    toDetail: function() {
      let that = this;
      that.triggerEvent('toDetail');
    }
  }
})