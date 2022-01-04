/*
 * @Description: 调度
 * @Autor: wangwangwang
 * @Date: 2022-01-04 09:48:33
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 09:48:33
 */
export default class Observer {
  constructor() {
    this.subscribers = {};
  }

  add (key, obj) {
    if (!this.subscribers[key]) this.subscribers[key] = [];
    this.subscribers[key].push(obj);
  }

  delete () { // 删除依赖
    this.subscribers = {};
  }

  notify(key, value) {
    this.subscribers[key].forEach(item => {
      if (item.update && typeof item.update === 'function') item.update(key, value);
    });
  }
}

Observer.globalDataObserver = new Observer();
