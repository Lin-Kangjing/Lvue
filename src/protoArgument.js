/*
 * @Description:
 * @FilePath: \lvue\src\protoArgument.js
 * @Date: 2022-07-06 19:50:22
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 17:02:39
 * @author: Lin_kangjing
 */
import Dep from "./dep.js";
// 数组默认原型对象
const arrayProto = Array.prototype;
// 已数组默认原型对象为原型创建一个新的对象
const arrayMethods = Object.create(arrayProto);
// 通过拦截这7个能够改变数组本身的方法来实现响应式
const methodsToPath = [
  "push",
  "pop",
  "unshift",
  "shift",
  "splice",
  "sort",
  "reverse",
];

/**拦截数组原型方法，设置响应式
 * @return {*}
 * @author: Lin_kangjing
 */
methodsToPath.forEach((method) => {
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      const ret = arrayProto[method].apply(this, args);
      console.log("array reactive");
      // 数据需要新增元素的列表
      let inserted = [];
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
        case "splice":
          // splice(idx,num,x)
          inserted = args.slice(2);
          break;
      }
      // 对新增的元素做响应式处理
      inserted.length && this.__ob__.observeArray(inserted);
      // 依赖（childOb.dep.depend()）通知更新
      this.__ob__.dep.notify();
      return ret;
    },
    enumerable: true,
    writable: true,
    configurable: true,
  });
});

/**覆盖数组原型
 * @param {*} arr
 * @return {*}
 * @author: Lin_kangjing
 */
export default function protoArgument(arr) {
  arr.__proto__ = arrayMethods;
}
