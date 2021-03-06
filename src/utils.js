/*
 * @Description:
 * @FilePath: \lvue\src\utils.js
 * @Date: 2022-07-05 19:56:04
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-16 12:17:54
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
/**是否为自闭合标签,这里只是简单处理
 * @param {*} tagName
 * @return {*}
 * @author: Lin_kangjing
 */
export function isUnaryTag(tagName){
  const unaryTag = ['input','image']
  return unaryTag.includes(tagName)
}
/**是否为保留节点
 * @param {*} tagName
 * @return {*}
 * @author: Lin_kangjing
 */
export function isReserveTag(tagName){
  const reserveTag  = ['div', 'h3','h2','h1', 'span', 'input', 'select', 'option', 'p', 'button', 'template']
  return reserveTag.includes(tagName)
}
