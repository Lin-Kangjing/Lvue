/*
 * @Description:
 * @FilePath: \lvue\src\defineReactive.js
 * @Date: 2022-07-06 19:38:10
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 20:15:17
 * @author: Lin_kangjing
 */
import Dep from "./dep.js";
import observe from "./observe.js";
/**通过Object.defineProperty为obj.key设置getter，setter拦截
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 * @return {*}
 * @author: Lin_kangjing
 */
export default function defineReactive(obj, key, val) {
  // 递归调用，处理val任然为对象的情况
  const childOb = observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        // dep.depend和childOb.dep收集的都是同一个watcher
        dep.depend();
        if (childOb) {
          // 数组更新的watcher收集，重写数组原型方法的时候，ob.dep.notify()就是需要这里收集的watcher
          //Vue.set中也需要
          childOb.dep.depend();
        }
      }
      console.log(`getter:key=${key}`);
      return val;
    },
    set(newV) {
      console.log(`setter:${key}=${newV}`);
      if (newV === val) return;
      val = newV;
      // 对新值进行响应式处理
      observe(val);
      // 数据更新时值dep通知自己收集到的所有watcher执行update方法
      dep.notify();
    },
  });
}
