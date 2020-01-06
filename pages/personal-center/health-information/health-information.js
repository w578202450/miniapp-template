const app = getApp()

Page({
  data: {
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
    medicalList: [{
        name: "先天性心脏病",
        id: "1",
        checked: 'true'
      },
      {
        name: "阴道炎",
        id: "2"
      },
      {
        name: "肿瘤",
        id: "3"
      },
      {
        name: "动脉硬化",
        id: "4"
      },
      {
        name: "脑血管病",
        id: "5"
      },
      {
        name: "冠心病",
        id: "6"
      },
      {
        name: "糖尿病",
        id: "7"
      }
    ],
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
    allergyList: [{
        name: "动物皮屑",
        id: "1",
        checked: 'true'
      },
      {
        name: "尘螨",
        id: "2"
      },
      {
        name: "鸡蛋",
        id: "3"
      },
      {
        name: "牛奶",
        id: "4"
      },
      {
        name: "鱼、虾、海产品",
        id: "5"
      },
      {
        name: "阿司匹林",
        id: "6"
      }
    ],
    liverItems: [{
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
  },
  onLoad: function() {

  },
  smokingAction: function(e) {
    console.log('------------吸烟史：', e.detail);
  },
  drinkingAction: function(e) {
    console.log('------------饮酒史：', e.detail);
  },
  medicalAction: function(e) {
    console.log('------------改变病史：', e.detail);
  },
  addMedical: function() {
    console.log('------------新增一个病史');
  },
  allergyAction: function(e) {
    console.log('------------改变过敏史：', e.detail);
  },
  addAllergy: function(e) {
    console.log('------------新增一个过敏史');
  },
  liverAction: function(e) {
    console.log('------------肝功能：', e.detail);
  },
  kidneyAction: function(e) {
    console.log('------------肾功能：', e.detail);
  },
  gestationAction: function(e) {
    console.log('------------妊娠哺乳：', e.detail);
  }

})