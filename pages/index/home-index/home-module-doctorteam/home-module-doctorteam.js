// pages/index/home-index/home-module-doctor-team/home-module-doctor-team.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    doctorTeamIntroduce: {
      type: String,
      value: ""
    },
    pageItem: {
      type: Object,
      value: {}
    },
    doctorTeamList: {
      type: Array,
      value: []
      // value: [
      //   {
      //   photoUrl: "/images/chat/personBacImg.png",
      //   doctorName: "冯文全",
      //   duty: "主治医生",
      //   workPlace: "侯丽萍风湿骨病中医医院",
      //   sectionName: "风湿科",
      //   diseaseName: ["风湿骨科", "痛风"],
      //   sortNo: "1"
      // }
      // , {
      //   facename: "/images/chat/personBacImg.png",
      //   doctorname: "冯文全",
      //   posation: "主治医生",
      //   hospital: "侯丽萍风湿骨病中医医院",
      //   department: "风湿科",
      //   goodAts: ["风湿骨科", "痛风"],
      //   id: "1"
      // }, {
      //   facename: "/images/chat/personBacImg.png",
      //   doctorname: "冯文全",
      //   posation: "主治医生",
      //   hospital: "侯丽萍风湿骨病中医医院",
      //   department: "风湿科",
      //   goodAts: ["风湿骨科", "痛风"],
      //   id: "2"
      // }, {
      //   facename: "/images/chat/personBacImg.png",
      //   doctorname: "冯文全",
      //   posation: "主治医生",
      //   hospital: "侯丽萍风湿骨病中医医院",
      //   department: "风湿科",
      //   goodAts: ["风湿骨科", "痛风"],
      //   id: "3"
      // }, {
      //   facename: "/images/chat/personBacImg.png",
      //   doctorname: "冯文全",
      //   posation: "主治医生",
      //   hospital: "侯丽萍风湿骨病中医医院",
      //   department: "风湿科",
      //   goodAts: ["风湿骨科", "痛风"],
      //   id: "4"
      // }, {
      //   facename: "/images/chat/personBacImg.png",
      //   doctorname: "冯文全",
      //   posation: "主治医生",
      //   hospital: "侯丽萍风湿骨病中医医院",
      //   department: "风湿科",
      //   goodAts: ["风湿骨科", "痛风"],
      //   id: "5"
      // }
      // ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultPhotoUrl: "/images/chat/personBacImg.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})