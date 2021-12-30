/*
 * @Description: 
 * @Autor: wangwangwang
 * @Date: 2021-12-30 16:34:26
 * @LastEditors: wangwangwang
 * @LastEditTime: 2021-12-30 17:17:57
 */

module.exports = {
  parser: 'esprima', 
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  extends: ['eslint:recommended'],
  rules: {
    "indent": ["error", 2],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
  },
  globals: {
    "__DEV__": true,
    "__WECHAT__": true,
    "__ALIPAY__": true,
    "App": true,
    "Page": true,
    "Component": true,
    "wx": true,
    "getApp": true,
    "getCurrentPages": true,
  },
}
