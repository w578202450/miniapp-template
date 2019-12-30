const app = getApp()

Page({
  data: {
      smokingHistoryItmes: [
          { name: '不吸烟', value: '0', checked: true },
          { name: '吸烟', value: '1' ,checked: false}
      ],
      drinkHistoryItems :[
          { name: '不饮酒', value: '0', checked: true },
          { name: '饮酒', value: '1', checked: false }
      ],
      previousHistoryItems: [
          { name: '有', value: '0', checked: true },
          { name: '无', value: '1', checked: false }
      ],
      liverItems: [
          { name: '正常', value: '0', checked: true },
          { name: '异常', value: '1', checked: false }
      ],
      renalItems: [
          { name: '正常', value: '0', checked: true },
          { name: '异常', value: '1', checked: false }
      ],
      gestationItems: [
          { name: '有', value: '0', checked: true },
          { name: '无', value: '1', checked: false }
      ]
  },
  onLoad: function () {

  }
})