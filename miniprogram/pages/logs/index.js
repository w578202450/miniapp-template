/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 13:59:17
 */

// 获取应用实例
const app = getApp();
Page({
  data: {
    test: 'test2',
    age: '',
    name: '',
  },
  onLoad() {
  },
  handleClick () {
    app.globalData.name = '2222'
    console.log(this.data.name)
    console.log(app.globalData.name)
  }
})
