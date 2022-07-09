/*
 * @Description:
 * @FilePath: \lvue\src\utils.js
 * @Date: 2022-07-05 19:56:04
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-06 18:58:44
 * @author: Lin_kangjing
 */
/**
 * 将key代理到target上
 * this._data.xx为this.xx
 * @param {*} target
 * @param {*} sourceKey
 * @param {*} key
 * @return {*}
 * @author: Lin_kangjing
 */
export function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key];
    },
    set(newV) {
      target[sourceKey][key] = newV;
    },
  });
}
