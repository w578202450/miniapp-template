const app = getApp()

Page({
  data: {
    //是否吸烟
    smokingItems: [{
      name: '不吸烟',
      value: '不吸烟',
      id: "1"
    },
    {
      name: '吸烟',
      value: '吸烟',
      checked: 'true',
      id: "2"
    },
    ],
    //是否饮酒
    drinkingItems: [{
      name: '不饮酒',
      value: '不饮酒',
      id: "1"
    },
    {
      name: '饮酒',
      value: '饮酒',
      checked: 'true',
      id: "2"
    },
    ],
    //是否有既往病史
    medicalItems: [{
      name: '有',
      value: '有',
      id: "1"
    },
    {
      name: '无',
      value: '无',
      checked: 'true',
      id: "2"
    },
    ],
    //是否有过敏史
    allergyItems: [{
      name: '有',
      value: '有',
      id: "1"
    },
    {
      name: '无',
      value: '无',
      checked: 'true',
      id: "2"
    },
    ],
    //肝功能是否正常
    liverItems: [{
      name: '正常',
      value: '正常',
      id: "1",
    },
    {
      name: '异常',
      value: '异常',
      checked: 'true',
      id: "2"
    },
    ],
    //肾功能是否正常
    kidneyItems: [{
      name: '正常',
      value: '正常',
      id: "1"
    },
    {
      name: '异常',
      value: '异常',
      checked: 'true',
      id: "2"
    },
    ],
    //是否有妊娠哺乳
    gestationItems: [{
      name: '有',
      value: '有',
      id: "1"
    },
    {
      name: '无',
      value: '无',
      checked: 'true',
      id: "2"
    },
    ],
    //既往病史列表
    medicalList: [{
      name: "先天性心脏病",
      id: "1",
      checked: false
    },
    {
      name: "阴道炎",
      id: "2",
      checked: false
    },
    {
      name: "肿瘤",
      id: "3",
      checked: false
    },
    {
      name: "动脉硬化",
      id: "4",
      checked: false
    },
    {
      name: "脑血管病",
      id: "5",
      checked: false
    },
    {
      name: "冠心病",
      id: "6",
      checked: false
    },
    {
      name: "糖尿病",
      id: "7",
      checked: false
    }
    ],
    //过敏史列表
    allergyList: [{
      name: "动物皮屑",
      id: "1",
      checked: false
    },
    {
      name: "尘螨",
      id: "2",
      checked: false
    },
    {
      name: "鸡蛋",
      id: "3",
      checked: false
    },
    {
      name: "牛奶",
      id: "4",
      checked: false
    },
    {
      name: "鱼、虾、海产品",
      id: "5",
      checked: false
    },
    {
      name: "阿司匹林",
      id: "6",
      checked: false
    }
    ],


    //是否显示既往病史、过敏史选择列表
    isHiddenMedicalList: true,
    isHiddenAllergyList: true,
    //输入框
    dialogInput: "",
    isHiddenDialog: true,
    dialogTarget: ""
  },
  onLoad: function () {

  },
  //methods
  // 选择吸烟史
  smokingAction: function (e) {
    console.log('------------吸烟史：', e.detail);
  },
  // 选择饮酒史
  drinkingAction: function (e) {
    console.log('------------饮酒史：', e.detail);
  },
  // 选择既往病史
  medicalAction: function (e) {
    this.setData({
      isHiddenMedicalList: (e.detail == "无") ? true : false
    })
  },
  // 选择既往病史列表
  medicalGridsChange: function (e) {
    var index = e.detail;
    var item = this.data.medicalList[e.detail];
    item.checked = !item.checked
    // var selectedData = []
    // for (var i = 0; i < this.data.medicalList.length; i++) {
    //   if (this.data.medicalList[i].checked) {
    //     selectedData.push(this.data.medicalList[i].name)
    //   }
    // }
    console.log("既往病史-------", e.detail)
  },
  // 选择饮酒史列表
  allergyGridsChange: function (e) {
    var index = e.detail;
    var item = this.data.medicalList[e.detail];
    item.checked = !item.checked
    // var selectedData = []
    // for (var i = 0; i < this.data.medicalList.length; i++) {
    //   if (this.data.medicalList[i].checked) {
    //     selectedData.push(this.data.medicalList[i].name)
    //   }
    // }
    console.log("既往病史-------", e.detail)
  },
  // 添加既往病史
  addMedical: function () {
    console.log('------------新增一个病史');
    this.setData({
      dialogInput: "",
      dialogTarget: "既往病史",
      isHiddenDialog: false,
    })

  },
  // 选择饮酒史
  allergyAction: function (e) {
    this.setData({
      isHiddenAllergyList: (e.detail == "无") ? true : false
    })
  },
  // 添加饮酒史
  addAllergy: function (e) {
    console.log('------------新增一个过敏史');
    this.setData({
      dialogInput: "",
      dialogTarget: "过敏史",
      isHiddenDialog: false
    })
  },
  // 选择肝功能
  liverAction: function (e) {
    console.log('------------肝功能：', e.detail);
  },
  // 选择肾功能
  kidneyAction: function (e) {
    console.log('------------肾功能：', e.detail);
  },
  // 选择妊娠哺乳
  gestationAction: function (e) {
    console.log('------------妊娠哺乳：', e.detail);
  },

  // 弹框取消
  cancleDialog: function () {
    this.setData({
      isHiddenDialog: true,
      dialogTarget: ""
    })
  },
  // 弹框保存
  confirmDialog: function () {
    var value = this.data.dialogInput;
    if (!value) {
      wx.showToast({
        title: '增值不能为空',
        icon: "none"
      })
      return;
    }
    console.log("------sss", this.data.dialogInput, this.data.dialogTarget)
    if (this.data.dialogTarget == "既往病史") {
      var list = this.data.medicalList
      list.push({
        name: this.data.dialogInput,
        id: "1",
        checked: true
      })
      this.setData({
        isHiddenDialog: true,
        dialogTarget: "",
        medicalList: list
      })
    } else if (this.data.dialogTarget == "过敏史") {
      var list = this.data.allergyList
      list.push({
        name: this.data.dialogInput,
        id: "1",
        checked: true
      })
      this.setData({
        isHiddenDialog: true,
        dialogTarget: "",
        allergyList: list,
      })
    }

  },
  // 获取弹框中输入框的值
  fetchInput: function (e) {
    this.setData({
      dialogInput: e.detail.value
    })
  }
})