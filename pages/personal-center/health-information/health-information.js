const HTTP = require('../../../utils/http-util')
const Common = require('../../../common/common')
const commonFun = require('../../../utils/common')
let app = getApp()

Page({
  data: {
    //是否吸烟
    smokingItems: [{
        name: '不吸烟',
        value: '不吸烟',
        checked: 'true',
        id: "1"
      },
      {
        name: '吸烟',
        value: '吸烟',
        id: "2"
      },

    ],
    hiddenSmokeInput: true,
    //是否饮酒
    drinkingItems: [{
        name: '不饮酒',
        value: '不饮酒',
        checked: 'true',
        id: "1"
      },
      {
        name: '饮酒',
        value: '饮酒',
        id: "2"
      },
    ],
    hiddenDrinkInput: true,
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
        name: '是',
        value: '是',
        id: "1"
      },
      {
        name: '否',
        value: '否',
        checked: 'true',
        id: "2"
      },
    ],
    //既往病史列表
    medicalList: [{
        name: "先天性心脏病",
        id: 1,
        checked: false
      },
      {
        name: "阴道炎",
        id: 2,
        checked: false
      },
      {
        name: "肿瘤",
        id: 3,
        checked: false
      },
      {
        name: "动脉硬化",
        id: 4,
        checked: false
      },
      {
        name: "脑血管病",
        id: 5,
        checked: false
      },
      {
        name: "冠心病",
        id: 6,
        checked: false
      },
      {
        name: "糖尿病",
        id: 7,
        checked: false
      }
    ],
    //过敏史列表
    allergyList: [{
        name: "动物皮屑",
        id: 1,
        checked: false
      },
      {
        name: "尘螨",
        id: 2,
        checked: false
      },
      {
        name: "鸡蛋",
        id: 3,
        checked: false
      },
      {
        name: "牛奶",
        id: 4,
        checked: false
      },
      {
        name: "鱼、虾、海产品",
        id: 5,
        checked: false
      },
      {
        name: "阿司匹林",
        id: 6,
        checked: false
      }
    ],


    //是否显示既往病史、过敏史选择列表
    isHiddenMedicalList: true,
    isHiddenAllergyList: true,
    //输入框
    dialogInput: "",
    isHiddenDialog: true,
    dialogTarget: "",
    //---------------上传data---------
    patientID: "",
    medicalSendList: [],
    allergySendList: [],
    // 身高信息
    heightInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_PERSONAL",
      docGroupName: "健康资料",
      docItemCode: "HEIGHT",
      docItemName: "身高",
      docItemValue: "",
      docItemDesc: ""
    }, // 体重信息
    weightInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_PERSONAL",
      docGroupName: "健康资料",
      docItemCode: "WEIGHT",
      docItemName: "体重",
      docItemValue: "",
      docItemDesc: ""
    },
    // 吸烟史
    smokeInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_HABIT",
      docGroupName: "生活习惯",
      docItemCode: "SMOKE",
      docItemName: "吸烟史",
      docItemValue: "不吸烟",
      docItemDesc: ""
    },
    // 饮酒史
    drinkInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_HABIT",
      docGroupName: "生活习惯",
      docItemCode: "DRINK",
      docItemName: "饮酒史",
      docItemValue: "不饮酒",
      docItemDesc: ""
    },
    // 既往病史
    historyOfSicknessInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_SICKNESS",
      docGroupName: "疾病史",
      docItemCode: "ILLNESS",
      docItemName: "既往病史",
      docItemValue: "无",
      docItemDesc: ""
    },
    // 过敏史
    historyOfAllergyInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_SICKNESS",
      docGroupName: "疾病史",
      docItemCode: "ALLERGY",
      docItemName: "过敏史",
      docItemValue: "无",
      docItemDesc: ""
    },
    // 肝功能
    liverInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_SICKNESS",
      docGroupName: "疾病史",
      docItemCode: "LIVER",
      docItemName: "肝功能",
      docItemValue: "正常",
      docItemDesc: ""
    },
    // 肾功能
    renalInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_SICKNESS",
      docGroupName: "疾病史",
      docItemCode: "KIDNEY",
      docItemName: "肾功能",
      docItemValue: "正常",
      docItemDesc: ""
    },
    // 妊娠哺乳
    pregnancyInfo: {
      patientID: "",
      orgID: "",
      docGroupCode: "D_TMC_DOCS_SICKNESS",
      docGroupName: "疾病史",
      docItemCode: "PREGNANCY",
      docItemName: "妊娠哺乳",
      docItemValue: "无",
      docItemDesc: ""
    }
  },

  onLoad: function() {
    let that = this;
    this.data.patientID = app.globalData.patientID;
    this.loadDatas();
  },
  //methods
  /**
   * 高度输入
   */
  heightInput: function(e) {
    this.data.heightInfo.docItemValue = e.detail.value;
  },
  /**
   * 体重输入
   */
  weightInput: function(e) {
    this.data.weightInfo.docItemValue = e.detail.value;
  },
  /**
   * 烟龄
   */
  smokeInput: function(e) {
    this.data.smokeInfo.docItemDesc = e.detail.value;
  },
  /***
   * 烟龄
   */
  drinkInput: function(e) {
    this.data.drinkInfo.docItemDesc = e.detail.value;
  },
  /**
   * 选择吸烟
   */
  smokingAction: function(e) {
    console.log('------------吸烟史：', e.detail);
    this.data.smokeInfo.docItemValue = e.detail;
    this.setData({
      hiddenSmokeInput: e.detail == "不吸烟" ? true : false,
      smoked: e.detail == "不吸烟" ? "" : e.value
    });
  },
  /**
   * 选择饮酒
   */
  drinkingAction: function(e) {
    console.log('------------饮酒史：', e.detail);
    this.data.drinkInfo.docItemValue = e.detail;
    this.setData({
      hiddenDrinkInput: e.detail == "不饮酒" ? true : false,
      drink: e.detail == "不吸烟" ? "" : e.value
    });
  },
  /**
   * 选择既往病史
   */
  medicalAction: function(e) {
    this.data.historyOfSicknessInfo.docItemValue = e.detail;
    this.setData({
      isHiddenMedicalList: (e.detail == "无") ? true : false
    });
  },

  /**
   * 选择既往病史列表
   */
  medicalGridsChange: function(e) {
    var index = e.detail;
    var item = this.data.medicalList[e.detail];
    item.checked = !item.checked;
    var selectedData = [];
    for (var i = 0; i < this.data.medicalList.length; i++) {
      if (this.data.medicalList[i].checked) {
        selectedData.push(this.data.medicalList[i].name)
      }
    }
    this.data.medicalSendList = selectedData;
    console.log("既往病史-------", e.detail);
  },
  /**
   * 过敏史选择
   */
  allergyGridsChange: function(e) {
    var index = e.detail;
    var item = this.data.allergyList[e.detail];
    item.checked = !item.checked;
    var selectedData = [];
    for (var i = 0; i < this.data.allergyList.length; i++) {
      if (this.data.allergyList[i].checked) {
        selectedData.push(this.data.allergyList[i].name);
      }
    }
    this.data.allergySendList = selectedData;
    console.log("过敏史选择-------", e.detail);
    console.log("this.data.allergySendList-------", this.data.allergySendList);
  },
  /**
   * 添加既往病史
   */
  addMedical: function() {
    console.log('------------新增一个病史');
    this.setData({
      dialogInput: "",
      dialogTarget: "既往病史",
      isHiddenDialog: false,
    })

  },
  /**
   * 选择过敏史
   */
  allergyAction: function(e) {
    console.log("------------", e.detail);
    this.data.historyOfAllergyInfo.docItemValue = e.detail;
    console.log("------------", this.data.historyOfAllergyInfo.docItemValue);
    this.setData({
      isHiddenAllergyList: (e.detail == "无") ? true : false
    });
  },
  /**
   * 添加过敏史
   */
  addAllergy: function(e) {
    console.log('------------新增一个过敏史');
    this.setData({
      dialogInput: "",
      dialogTarget: "过敏史",
      isHiddenDialog: false
    });
  },
  /**
   * 选择肝功能
   */
  liverAction: function(e) {
    console.log('------------肝功能：', e.detail);
    this.data.liverInfo.docItemValue = e.detail;
  },
  /**
   * 选择肾功能
   */
  kidneyAction: function(e) {
    console.log('------------肾功能：', e.detail);
    this.data.renalInfo.docItemValue = e.detail;
  },
  /**
   * 选择妊娠哺乳
   */
  gestationAction: function(e) {
    console.log('------------妊娠哺乳：', e.detail);
    this.data.pregnancyInfo.docItemValue = e.detail;
  },

  /***
   * 弹框取消
   */
  cancleDialog: function() {
    this.setData({
      isHiddenDialog: true,
      dialogTarget: ""
    });
  },
  /**
   *弹框保存
   */
  confirmDialog: function() {
    var value = this.data.dialogInput;
    if (!value) {
      wx.showToast({
        title: '增值不能为空',
        icon: "none"
      })
      return;
    }
    console.log("------sss", this.data.dialogInput, this.data.dialogTarget);
    if (this.data.dialogTarget == "既往病史") {
      this.data.medicalSendList.push(this.data.dialogInput);
      var list = this.data.medicalList;
      list.push({
        name: this.data.dialogInput,
        id: "1",
        checked: true
      });
      this.setData({
        isHiddenDialog: true,
        dialogTarget: "",
        medicalList: list
      });
    } else if (this.data.dialogTarget == "过敏史") {
      this.data.allergySendList.push(this.data.dialogInput);
      var list = this.data.allergyList;
      list.push({
        name: this.data.dialogInput,
        id: "1",
        checked: true
      });
      this.setData({
        isHiddenDialog: true,
        dialogTarget: "",
        allergyList: list,
      });
    }

  },
  /**
   * 获取弹框中输入框的值
   */
  fetchInput: function(e) {
    let value = Common.filterEmoji(e.detail.value);
    this.setData({
      dialogInput: value
    });
    return {
      value: value
    }

  },

  /**
   * 查询健康信息
   */
  loadDatas() {
    let that = this;
    wx.showNavigationBarLoading();
    HTTP.getPatientDoc({
        orgID: app.globalData.orgID,
        keyID: this.data.patientID
      })
      .then(res => {
        wx.hideNavigationBarLoading();
        if (res.data) {
          for (var index in res.data) {
            that.handleQueryInfo(res.data[index]);
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          });
        }

      }).catch(e => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        wx.showToast({
          title: '获取信息失败',
          icon: 'none',
          duration: 2000
        });
      })
  },
  /**
   * 载入健康信息
   */
  handleQueryInfo: function(item) {
    let that = this
    // 身高
    if (item.docGroupCode === this.data.heightInfo.docGroupCode &&
      item.docItemCode === this.data.heightInfo.docItemCode) {
      this.data.heightInfo.docItemValue = item.docItemValue;
      this.setData({
        height: item.docItemValue
      })
      // 体重
    } else if (item.docGroupCode === this.data.weightInfo.docGroupCode &&
      item.docItemCode === this.data.weightInfo.docItemCode) {
      this.data.weightInfo.docItemValue = item.docItemValue;
      this.setData({
        weight: item.docItemValue
      })
      // 吸烟史
    } else if (item.docGroupCode === this.data.smokeInfo.docGroupCode &&
      item.docItemCode === this.data.smokeInfo.docItemCode) {
      this.data.smokeInfo.docItemValue = item.docItemValue;
      this.data.smokeInfo.docItemDesc = item.docItemDesc;
      for (var index in this.data.smokingItems) {
        if (this.data.smokingItems[index].name == item.docItemValue) {
          this.data.smokingItems[index].checked = true;
        } else {
          this.data.smokingItems[index].checked = false;
        }
      }
      this.setData({
        smokingItems: that.data.smokingItems,
        smoked: item.docItemDesc,
        hiddenSmokeInput: item.docItemValue == '不吸烟' ? true : false
      })
      // 饮酒史
    } else if (item.docGroupCode === this.data.drinkInfo.docGroupCode &&
      item.docItemCode === this.data.drinkInfo.docItemCode) {
      this.data.drinkInfo.docItemValue = item.docItemValue;
      for (var index in this.data.drinkingItems) {
        if (this.data.drinkingItems[index].name == item.docItemValue) {
          this.data.drinkingItems[index].checked = true;
        } else {
          this.data.drinkingItems[index].checked = false;
        }
      }
      this.setData({
        drinkingItems: that.data.drinkingItems,
        drink: item.docItemDesc,
        hiddenDrinkInput: item.docItemValue == '不饮酒' ? true : false
      })
      // 既往病史
    } else if (item.docGroupCode === this.data.historyOfSicknessInfo.docGroupCode &&
      item.docItemCode === this.data.historyOfSicknessInfo.docItemCode) {

      this.data.historyOfSicknessInfo.docItemValue = item.docItemValue;
      for (var index in this.data.medicalItems) {
        if (this.data.medicalItems[index].name == item.docItemValue) {
          this.data.medicalItems[index].checked = true;
        } else {
          this.data.medicalItems[index].checked = false;
        }
      }
      this.data.historyOfSicknessInfo.docItemDesc = item.docItemDesc;
      this.data.medicalSendList = item.docItemDesc.split(',')
      if (item.docItemDesc.length > 0 && this.data.historyOfSicknessInfo.docItemValue == '有') {
        var tempMedicalList = []
        for (var i in this.data.medicalSendList) {
          let obj = {
            name: this.data.medicalSendList[i],
            id: i,
            checked: false
          }
          tempMedicalList.push(obj)
        }

        for (var i in this.data.medicalList) {
          for (var j in tempMedicalList) {
            if (tempMedicalList[j].name == this.data.medicalList[i].name) {
              this.data.medicalList[i].checked = true;
              tempMedicalList[j].checked = true;
            }
          }
        }
        for (var j in tempMedicalList) {
          if (tempMedicalList[j].checked == false) {
            let obj = {
              name: tempMedicalList[j].name,
              id: Number(this.data.medicalList.length) + 1,
              checked: true
            }
            this.data.medicalList.push(obj)
          }
        }
      }
      this.setData({
        medicalItems: that.data.medicalItems,
        medicalList: that.data.medicalList,
        isHiddenMedicalList: item.docItemValue == '无' ? true : false
      })
      // 过敏史
    } else if (item.docGroupCode === this.data.historyOfAllergyInfo.docGroupCode &&
      item.docItemCode === this.data.historyOfAllergyInfo.docItemCode) {
      this.data.historyOfAllergyInfo.docItemValue = item.docItemValue;
      for (var index in this.data.allergyItems) {
        if (this.data.allergyItems[index].name == item.docItemValue) {
          this.data.allergyItems[index].checked = true;
        } else {
          this.data.allergyItems[index].checked = false;
        }
      }
      this.data.historyOfAllergyInfo.docItemDesc = item.docItemDesc;
      this.data.allergySendList = item.docItemDesc.split(',')
      if (item.docItemDesc.length > 0 && this.data.historyOfAllergyInfo.docItemValue == '有') {
        var tempAllergyList = []
        for (var i in this.data.allergySendList) {
          let obj = {
            name: this.data.allergySendList[i],
            id: i,
            checked: false
          }
          tempAllergyList.push(obj)
        }

        for (var i in this.data.allergyList) {
          for (var j in tempAllergyList) {
            if (tempAllergyList[j].name == this.data.allergyList[i].name) {
              this.data.allergyList[i].checked = true;
              tempAllergyList[j].checked = true;
            }
          }
        }
        for (var j in tempAllergyList) {
          if (tempAllergyList[j].checked == false) {
            let obj = {
              name: tempAllergyList[j].name,
              id: Number(this.data.allergyList.length) + 1,
              checked: true
            }
            this.data.allergyList.push(obj)
          }
        }

      }
      this.setData({
        allergyItems: that.data.allergyItems,
        allergyList: that.data.allergyList,
        isHiddenAllergyList: item.docItemValue == '无' ? true : false
      })
      // 肝功能
    } else if (item.docGroupCode === this.data.liverInfo.docGroupCode &&
      item.docItemCode === this.data.liverInfo.docItemCode) {
      this.data.liverInfo.docItemValue = item.docItemValue;
      for (var index in this.data.liverItems) {
        if (this.data.liverItems[index].name == item.docItemValue) {
          this.data.liverItems[index].checked = true;
        } else {
          this.data.liverItems[index].checked = false;
        }
      }
      this.setData({
        liverItems: that.data.liverItems
      })
      // 肾功能
    } else if (item.docGroupCode === this.data.renalInfo.docGroupCode &&
      item.docItemCode === this.data.renalInfo.docItemCode) {
      this.data.renalInfo.docItemValue = item.docItemValue;
      for (var index in this.data.kidneyItems) {
        if (this.data.kidneyItems[index].name == item.docItemValue) {
          this.data.kidneyItems[index].checked = true;
        } else {
          this.data.kidneyItems[index].checked = false;
        }
      }
      this.setData({
        kidneyItems: that.data.kidneyItems
      })
      // 妊娠
    } else if (item.docGroupCode === this.data.pregnancyInfo.docGroupCode &&
      item.docItemCode === this.data.pregnancyInfo.docItemCode) {
      this.data.pregnancyInfo.docItemValue = item.docItemValue;
      for (var index in this.data.gestationItems) {
        if (this.data.gestationItems[index].name == item.docItemValue) {
          this.data.gestationItems[index].checked = true;
        } else {
          this.data.gestationItems[index].checked = false;
        }
      }
      this.setData({
        gestationItems: that.data.gestationItems,
        sex: app.globalData.personInfo.sex
      })
    }
  },

  /**
   * 保存健康信息操作
   */
  submitAction: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认保存患者信息吗？',
      cancelText: '取消',
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          that.savePatientInfo()
        } else {
          wx.showToast({
            title: '已取消保存患者信息',
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 保存健康信息请求
   */
  savePatientInfo: function() {
    //吸烟史
    if (this.data.smokeInfo.docItemValue === '不吸烟') {
      this.data.smokeInfo.docItemDesc = "";
    }
    //既往病史 list->string
    if (this.data.historyOfSicknessInfo.docItemValue === "无") {
      this.data.historyOfSicknessInfo.docItemDesc = "";
    } else {
      this.data.historyOfSicknessInfo.docItemDesc = this.data.medicalSendList.join(',')
    }
    //过敏史 list->string
    if (this.data.historyOfAllergyInfo.docItemValue === "无") {
      this.data.historyOfAllergyInfo.docItemDesc = "";
    } else {
      this.data.historyOfAllergyInfo.docItemDesc = this.data.allergySendList.join(',')
    }
    let saveData = [
      this.data.heightInfo,
      this.data.weightInfo,
      this.data.smokeInfo,
      this.data.drinkInfo,
      this.data.historyOfSicknessInfo,
      this.data.historyOfAllergyInfo,
      this.data.liverInfo,
      this.data.renalInfo,
      this.data.pregnancyInfo
    ];

    for (var index in saveData) {
      saveData[index].patientID = this.data.patientID;
      saveData[index].orgID = app.globalData.orgID;
    }

    wx.showLoading({
      title: '信息更新...',
    })

    HTTP.savePatientDoc(saveData)
      .then(res => {
        wx.hideLoading();
        if (res.code == 0) {
          wx.showToast({
            title: '更新成功',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(e => {
        wx.hideLoading();
        wx.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 2000
        })
      })
  },

  //右上角分享功能
  onShareAppMessage: function(res) {
    return commonFun.onShareAppMessageFun();
  }
})