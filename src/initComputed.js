/*
 * @Description:
 * @FilePath: \lvue\src\initComputed.js
 * @Date: 2022-07-17 01:20:30
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-17 02:42:53
 * @author: Lin_kangjing
 */
import Watcher from './watcher.js'
/**初始化computed 配置项，为每一个实例化watcher，并将其computed属性队里到vue实例上
 * @param {*} vm
 * @return {*}
 * @author: Lin_kangjing
 */
export default function initComputed(vm) {
  const computed = vm.$options.computed;
  // 记录watcher
  const watcher = (vm._watcher = Object.create(null));
  for (const key in computed) {
    // 实例化watcher
    watcher[key] = new Watcher(computed[key], { lazy: true }, vm);
    // 将computed属性队里到vue实例上
    defineComputed(vm, key);
  }
}

/**将计算属性代理到vue实例上
 * @param {*} vm
 * @param {*} key
 * @return {*}
 * @author: Lin_kangjing
 */
function defineComputed(vm, key) {
  // 属性描述符
  const descriptor = {
    get: function () {
      const watcher = vm._watcher[key];
      console.log(key)
      // 当前computed回调函数在本次渲染周期内没被执行过
      if (watcher.dirty) {
        // 通知watcher执行computed回调函数得到返回值
        watcher.evalute();
      }
      return watcher.value;
    },
    set: function (value) {
      console.log(`set computed ${key}=${value}`);
    },
  };
  // 将计算属性代理到vue实例上
  Object.defineProperty(vm,key,descriptor)
}
