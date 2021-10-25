const app = getApp();
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
    }],
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