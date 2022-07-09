/*
 * @Description:
 * @FilePath: \lvue\src\watcher.js
 * @Date: 2022-07-09 13:16:53
 * @LastEditors: Lin_kangjing
 * @LastEditTime: 2022-07-09 19:52:01
 * @author: Lin_kangjing
 */
import Dep from "./dep.js";
/**watcher,渲染Dom和computed和watch都是使用Watcher
 * @param {function} cb
 * @return {*}
 * @author: Lin_kangjing
 */
export default function Watcher(cb) {
  this._cb = cb
  // 实例化时赋值给Dep.target
  Dep.target = this;
  // 执行回调函数cb，cb中会发生vm.xx的属性读取行为，进行依赖收集
  cb();
  // 依赖收集完毕，Dep.target重新赋值为null，之后再读取vm.xx,不再收集依赖，防止重复收集
  Dep.target = null;
}
/**响应式数据更新是，dep通知watcher执行update方法，让update方式执行this._cb函数执行对应的更新
 * @return {*}
 * @author: Lin_kangjing
 */
Watcher.prototype.update = function(){
  this._cb()
}
