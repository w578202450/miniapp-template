/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 11:15:59
 */

// 获取应用实例
const app = getApp();
Page({
  data: {
    test: 'test2'
  },
  onLoad() {
  },
  handleClick () {
    app.globalData.name = '2222'
    console.log(this.data.name)
    console.log(app.globalData.name)
  }
})
