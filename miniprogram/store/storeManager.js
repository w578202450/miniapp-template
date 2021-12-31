/*
 * @Description: 全局状态管理
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-31 10:39:19
 */

export function initGlobalData() {
  return {
    logs: [],
  }
}

export default class StoreManager {
  constructor(app) {
    this.app = app || getApp();
    console.log(app)
    console.log(getApp())
    if (!this.app) {
      throw 'StoreManager Error: 获取app实例失败'
    }
  }

  getInstance(app) {
    if (!this._storeManager) {
      this._storeManager = new StoreManager(app)
    }
    return this._storeManager
  }

  initLogs() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now().toString())
    wx.setStorageSync('logs', logs)
    this.setLogs(logs)
  }

  setLogs(logs) {
    this.app.globalData.logs = logs
  }

  getLogs() {
    return this.app.globalData.logs
  }
}

// function StoreManager2 (app) {
//   this.app = app || getApp();
// }

// StoreManager2.getInstance = function(app){
//   if (!this._storeManager) {
//     this._storeManager = new StoreManager2(app)
//   }
//   return this._storeManager
// }

// StoreManager2.initLogs = function(){
//   const logs = wx.getStorageSync('logs') || []
//   logs.unshift(Date.now().toString())
//   wx.setStorageSync('logs', logs)
//   this.setLogs(logs)
// }

// StoreManager2.setLogs = function(logs){
//   this.app.globalData.logs = logs
// }

// StoreManager2.getLogs = function(){
//   return this.app.globalData.logs
// }

// export default StoreManager2;
