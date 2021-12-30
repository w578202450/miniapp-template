/*
 * @Description: 请求处理
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-30 17:20:43
 */
import ENV from 'env'

export default class HttpManager {
  constructor() {
    this.appId = ENV.APP_ID
    this.baseUrl = ENV.BASE_URL
    this.timeDiff = 0
  }
  /**
   * http响应处理
   * @param response - 后端返回的数据
   * @returns 请求结果， true为成功， false为失败
   */
  responseHandle(response) {
    const { statusCode, data } = response
    let success = false
    switch (statusCode) {
    case 200:
      // 处理成功
      success = true
      break
    case 202:
      // 服务器已接受请求，但尚未处理
      break
    case 204:
      // 处理成功，无返回Body
      success = true
      break
    case 400:
    case 401:
    case 403:
    case 404:
    case 429:
    case 500:
    case 502:
    case 503:
      wx.showToast({ title: data.message, icon: 'error' })
      break
    default:
      break
    }
    return success
  }
  request(url, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}${url}`,
        method,
        data: data || '',
        success: (response) => {
          const result = this.responseHandle(response)
          if (result) {
            resolve(response.data)
          } else {
            console.error('请求失败', response)
            reject(response)
          }
        },
        fail: (error) => {
          console.error('请求出错', error)
          reject(data)
        },
      })
    })
  }
  get(url, params) {
    const extra =
      params &&
      Object.keys(params)
        .filter((item) => params[item] === 0 || params[item])
        .map((item) => {
          return `${encodeURIComponent(item)}=${encodeURIComponent(
            params[item]
          )}`
        })
        .join('&')
    return this.request(extra ? `${url}?${extra}` : url, 'GET')
  }
  post(url, data) {
    return this.request(url, 'POST', data)
  }
  put(url, data) {
    return this.request(url, 'PUT', data)
  }
  delete(url) {
    return this.request(url, 'DELETE')
  }
}
