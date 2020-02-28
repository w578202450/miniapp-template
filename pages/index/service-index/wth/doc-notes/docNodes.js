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
      publishDate: ""
      }
    },
    // 评价内容
    contentText: {
      type: String,
      value: "暂无评价"
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
    toDetail: function() {
      let that = this;
      that.triggerEvent('toDetail');
    }
  }
})
