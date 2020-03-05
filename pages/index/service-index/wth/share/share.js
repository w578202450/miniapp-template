// pages/index/service-index/wth/notes/notes.js
// const HTTP = require('../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
      },
      httpParams: {
        type: Object,
        value: {
          nextPage: "/pages/index/service-index/wth/share-list/share-list",
          sectionID: "",
          orgID: "",
          doctorStaffID: ""
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    moreBtnUrl: "",
    paersonInfo: {},
    contentText: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function() {
      let materialData = {
        materialType: 0, // （必传）要查看的素材类型 0图文 1视频
        title: "标题", // 待确认，可先不传
        url: this.data.paersonInfo.detailUrl, // （必传）图文、视频 的网络地址链接
        logoUrl: "" // 视频的封面图片(没有就传空字符窜)
      };
      wx.navigateTo({
        url: "/pages/index/service-index/ht/video-and-h5/video-and-h5?materialData=" + JSON.stringify(materialData) // 传输对象、数组时，需要转换为字符窜
      });
    }
  }
})