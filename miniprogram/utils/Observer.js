/*
 * @Description: 调度
 * @Autor: wangwangwang
 * @Date: 2022-01-04 09:48:33
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 14:22:49
 */
export default class Observer {
  constructor() {
    this.subscribers = {};
  }

  add (key, obj) {
    if (!this.subscribers[key]) this.subscribers[key] = [];
    this.subscribers[key].push(obj);
  }

  /**
   * @Description: 通过id和keyList进行删除
   * @param {*} data
   * @param {*} id
   * @Author: wangwangwang
   */  
  delete (keyList, id) {
    for (let i in this.subscribers) {
      const index = keyList.findIndex(item => item === i);
      if (index !== -1) {
        const valueData = this.subscribers[keyList[index]];
        const newValueData = valueData.filter(item => item.id !== id);
        this.subscribers[keyList[index]] = newValueData;
      }
    }
  }

  notify(key, value) {
    this.subscribers[key].forEach(item => {
      if (item.update && typeof item.update === 'function') item.update(key, value);
    });
  }
}

Observer.globalDataObserver = new Observer();
