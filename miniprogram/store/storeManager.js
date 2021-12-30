/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-30 17:18:32
 */

export function initGlobalData() {
  return {
    logs: [],
  }
}

export default class StoreManager {
  constructor() {
    this._app = app || getApp()
    if (!this._app) {
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
    this._app.globalData.logs = logs
  }

  getLogs() {
    return this._app.globalData.logs
  }
}
