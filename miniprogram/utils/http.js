/*
 * @Description: 请求处理
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-31 14:23:01
 */
const md5 = require('./md5')

function responseHandle (response) {
  const { statusCode, data } = response
  let success = false
  switch (statusCode) {
  case 200:
    success = true
    break
  case 202:
    break
  case 204:
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

export default function Http (options) {
  const { url, method, data = {} } = options;

  return new Promise(function (resolve, reject) {
    let date = Date.parse(new Date());
    let clientType = "wxpro";
    let dataValues = md5.objKeySort(data);
    let encodeURI = encodeURIComponent(dataValues + clientType + date + "ka5qEcegfYS3r4dH");
    let encodeURIReplace = encodeURI.replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\\~/g, '%7E');
    let signed = md5.md5(encodeURIReplace);

    wx.request({
      method,
      url,
      header: {
        'content-type': 'application/json',
        'token': 'aaaa',
        'clientType': clientType,
        'timestamp': date,
        'sign': signed,
        'source':'tmc'
      },
      data,
      success: (response) => {
        const result = responseHandle(response);
        if (result) {
          resolve(response.data)
        } else {
          reject(response)
        }
      },
      fail: (error) => {
        reject(error);
        console.log("数据请求失败:", url, error)
      },
    });
  });
}
