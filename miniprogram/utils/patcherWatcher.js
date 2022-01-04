/*
 * @Description: patcherWatcher.js
 * @Autor: wangwangwang
 * @Date: 2022-01-04 09:49:25
 * @LastEditors: wangwangwang
 * @LastEditTime: 2022-01-04 09:49:26
 */
import Watcher from './Watcher';
function noop() {}

const prePage = Page;
Page = function() {
  const obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const _onLoad = obj.onLoad || noop;
  const _onUnload = obj.onUnload || noop;

  obj.onLoad = function () {
    const updateMethod = this.setState || this.setData;
    const data = obj.data || {};
    this._watcher = this._watcher || new Watcher(data, updateMethod.bind(this));
    return _onLoad.apply(this, arguments);
  };
  obj.onUnload = function () {
    this._watcher.removeObserver();
    return _onUnload.apply(this, arguments);
  };
  return prePage(obj);
};
