/*
 * @Description: 公共api
 * @Autor: wangwangwang
 * @Date: 2021-12-30 10:43:30
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-31 14:54:56
 */

import request from 'utils/http';
import ENV from '../env';

// 获取微信openid
export function getWXAuth(params) {
  return request({
    url: ENV.API_BASE_URL + 'api/peachUser/wx/getWXAuth',
    method: 'POST',
    params,
  })
}

