/*
 * @Description: 小程序默认首页
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 11:37:25
 */

require('./utils/patcherWatcher');
const { reactive } = require('./utils/reactive');

App({
  onLaunch: function () {
    this.globalData = reactive(this.globalData); // globalData响应式化
  },
  globalData: {
    name: 11111,
    age: 22,
  },
})
