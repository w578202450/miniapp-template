const app = getApp();
const HTTP = require('../../../../utils/http-util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    doctorList: [{
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21102010260392436390201240.png',
      doctorName: '才让端智',
      titleName: '院长',
      goodAt: '治疗心脑血管疾病、风湿、类风湿性关节炎、消化系统疾病、泌尿、生殖系统疾病、藏医特色养生滋补调理补肾等。',
      online: true,
    }, {
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21111014131960327170201233.png',
      doctorName: '匡凤玲',
      titleName: '主治医师',
      goodAt: '擅长以中藏药为主的联合用药，治疗各种疼痛，慢性病综合调理，妇科疾病，月经失调，不孕不育，乳腺疾病，更年期综合症等。',
      online: true,
    }, {
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21102010263085934490201233.png',
      doctorName: '胡燕芹',
      titleName: '副主任医师',
      goodAt: '治疗各类妇科疑难杂症，对风湿、类风湿性关节炎以及心脑血管、消化系统等疾病有着丰富的临床经验。',
      online: false,
    }, {
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21102010265805650270201240.png',
      doctorName: '彭毛东主',
      titleName: '主任医师',
      goodAt: '治疗风湿、类风湿性关节炎，银屑病、鱼鳞病、硬皮病、带状疱疹、寻常疣、扁平疣、传染性软疣、荨麻疹、黄褐斑、白癜风等各种皮肤病和尖锐湿疣、生殖器疱疹、梅毒等各种性病。',
      online: false,
    }, 
    {
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21121309573358125990201233.png',
      doctorName: '张健',
      titleName: '主任医师',
      goodAt: '各种类型的急慢性肝炎、肝硬化、脂肪肝、胆囊炎、胆石症及胃肠疾病，特别对肝硬化腹水、肝癌、慢性萎 缩性胃炎的治疗，具有较深的理论研究和丰富的临床经验。',
      online: false,
    },
    {
      image: 'https://com-shuibei-peach-pharmacy.100cbc.com/rp/21030410325655262692822001/21121309570309855430201233.png',
      doctorName: '更登加措',
      titleName: '主治医师',
      goodAt: '治疗类风湿性关节炎、心脑血管疾病、肝胆系统疾病等，对慢性疾病的管理治疗有着丰富的临床经验。',
      online: false,
    }
  ],
  },

  /**
   * 组件的方法列表
   */

  methods: {
    handleClick() {
      if (app.globalData.isInitInfo&&app.globalData.unionid && app.globalData.openid) {
        this.triggerEvent('toServiceIndexFun');
      } else {
        let nextPageName = "chat";
        this.popup.showPopup(nextPageName); // 显示登录确认框
      }
    },
    personClick (e) {
      let { online, index } = e.currentTarget.dataset;
      if (online) {
        if (app.globalData.isInitInfo&&app.globalData.unionid && app.globalData.openid) {
          const params = {
            orgID: HTTP.getOrgId(),
            doctorID: HTTP.getDoctorId(index),
            personID: app.globalData.personID,
          }
          HTTP.repalceAssicDocandassistgroup(params).then(res => {
            if (res) {
              wx.setStorage({
                key: 'shareDoctorStaffID',
                data: res.data.doctorStaffID
              });
              wx.setStorage({
                key: 'shareAssistantStaffID',
                data: res.data.assistantStaffID
              });
              wx.setStorageSync('personInfo', res.data);
            }
            this.triggerEvent('toServiceIndexFun');
          })
        } else {
          app.globalData.doctorType = index;
          let nextPageName = "chat";
          this.popup.showPopup(nextPageName); // 显示登录确认框
        }
        return
      }
      wx.showToast({
        title: "该医生已离线",
        icon: 'none',
        duration: 2000
      })
    },
    /**取消事件 */
    _error() {
      this.popup.hidePopup();
    },

    /**确认事件 */
    _success() {
      this.popup.hidePopup();
    },
  },
  ready: function() {
    this.popup = this.selectComponent("#loginDialog");
  },
})