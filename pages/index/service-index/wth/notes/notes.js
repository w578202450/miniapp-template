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
        publishDate: "",
        photoUrl: ""
      }
    },
    httpParams: {
      type: Object,
      value: {
        nextPage: "/pages/index/service-index/wth/notes-list/notes-list",
        sectionID: "",
        orgID: "",
        doctorStaffID: ""
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    moreBtnUrl: "",
    contentText: ""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toDetail: function() {
      this.data.paersonInfo.content = encodeURIComponent(this.data.paersonInfo.content);
      wx.navigateTo({
        url: "/pages/index/service-index/wth/notes-details/notes-details?keyID=" + this.data.paersonInfo.keyID // 传输对象、数组时，需要转换为字符窜
      });
    }
  }
})